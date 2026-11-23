import Chat from '../models/Chat.js';
import DailyRecord from '../models/DailyRecord.js';
import Experiment from '../models/Experiment.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateChatResponse } from '../services/aiService.js';

export const chatWithAssistant = asyncHandler(async (req, res) => {
  const { message, isVoice = false } = req.body;

  if (!message || !message.trim()) {
    return ApiResponse.error(res, 'Message text is required', 400);
  }

  const userId = req.user._id;

  // 1. Fetch user's data context from DB
  const records = await DailyRecord.find({ user: userId }).sort({ date: 1 });
  const experiments = await Experiment.find({ user: userId });

  // 2. Persist user message
  const userMsgDoc = await Chat.create({
    user: userId,
    sender: 'user',
    text: message.trim(),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isVoice
  });

  // 3. Generate AI Intelligence Response
  const aiResult = await generateChatResponse({
    query: message.trim(),
    records,
    experiments
  });

  // 4. Persist assistant message
  const assistantMsgDoc = await Chat.create({
    user: userId,
    sender: 'assistant',
    text: aiResult.reply,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isVoice
  });

  return ApiResponse.success(res, {
    userMessage: userMsgDoc,
    assistantMessage: assistantMsgDoc,
    source: aiResult.source,
    model: aiResult.model
  }, 'Assistant response generated');
});

export const getChatHistory = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ user: req.user._id }).sort({ createdAt: 1 });

  if (chats.length === 0) {
    // Return welcome message
    return ApiResponse.success(res, [
      {
        id: 'msg-init-1',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Hello ${req.user.name}. I am your DayLens personal intelligence assistant. I analyze your biometric habits, sleep rhythms, and focus correlations. How can I help you today?`,
        isDemo: false
      }
    ]);
  }

  return ApiResponse.success(res, chats);
});

export const clearChatHistory = asyncHandler(async (req, res) => {
  await Chat.deleteMany({ user: req.user._id });
  return ApiResponse.success(res, null, 'Chat history cleared');
});
