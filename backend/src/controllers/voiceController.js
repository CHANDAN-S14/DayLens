import { synthesizeSpeech, getVoiceConfig } from '../services/voiceService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const speak = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return ApiResponse.error(res, 'Text parameter is required for voice synthesis', 400);
  }

  const result = await synthesizeSpeech(text);

  if (result.available && result.audioBuffer) {
    res.setHeader('Content-Type', result.contentType || 'audio/mpeg');
    res.setHeader('Content-Length', result.audioBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.end(result.audioBuffer);
  }

  return ApiResponse.success(res, {
    useBrowserFallback: true,
    message: result.message
  });
});

export const getStatus = asyncHandler(async (req, res) => {
  const config = getVoiceConfig();
  return ApiResponse.success(res, config);
});
