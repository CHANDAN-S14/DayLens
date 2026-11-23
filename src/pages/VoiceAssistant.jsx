import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PaperPlaneRight, 
  Microphone, 
  Sparkle, 
  Trash, 
  Stop, 
  Info,
  SpeakerHigh,
  Lightbulb
} from '@phosphor-icons/react';
import ChatMessage from '../components/chat/ChatMessage';
import { generateAssistantReply } from '../utils/localAssistantEngine';
import assistantService from '../services/assistantService';
import voiceService from '../services/voiceService';

const SUGGESTED_QUESTIONS = [
  "How did I sleep this week?",
  "When was my focus highest?",
  "Is my screen time increasing?",
  "What patterns do you notice?",
  "What should I improve tomorrow?"
];

export default function VoiceAssistant() {
  const { records, experiments, chatMessages, addChatMessage, clearChat, isAuthenticated, isBackendConnected } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingText, setSpeakingText] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    addChatMessage(userMessage);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // If authenticated, request real backend AI service with persistence
    if (isAuthenticated) {
      try {
        const result = await assistantService.sendMessage(text, isListening);
        if (result?.assistantMessage) {
          addChatMessage({
            id: result.assistantMessage._id || `msg-${Date.now() + 1}`,
            sender: 'assistant',
            timestamp: result.assistantMessage.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: result.assistantMessage.text
          });
          setIsTyping(false);
          return;
        }
      } catch (err) {
        console.warn("Backend assistant request failed, falling back to local engine:", err.message);
      }
    }

    // Fallback to deterministic local statistical engine
    setTimeout(() => {
      const replyText = generateAssistantReply(text, records, experiments);
      const assistantMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: replyText
      };
      addChatMessage(assistantMessage);
      setIsTyping(false);
    }, 500);
  };

  // Browser Speech Recognition Prototype
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. You can type queries into the input field.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error", err);
      setIsListening(false);
    }
  };

  // ElevenLabs Voice Synthesis with client browser fallback
  const handleSpeak = async (text) => {
    if (speakingText) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setSpeakingText(null);
      return;
    }

    setSpeakingText(text);

    // Try backend ElevenLabs voice synthesis first
    try {
      const result = await voiceService.speakText(text);
      if (result.usedBackendTts && result.audio) {
        result.audio.onended = () => setSpeakingText(null);
        result.audio.onerror = () => setSpeakingText(null);
        return;
      }
    } catch (err) {
      // Proceed to browser synthesis
    }

    // Client SpeechSynthesis fallback
    if (window.speechSynthesis) {
      const cleanText = text.replace(/[*#•]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setSpeakingText(null);
      utterance.onerror = () => setSpeakingText(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setSpeakingText(null);
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col bg-white border border-border rounded-2xl shadow-xs overflow-hidden animate-fade-in">
      {/* Top Assistant Header */}
      <div className="p-4 sm:p-5 border-b border-border bg-sage-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-botanical-800 text-white flex items-center justify-center shadow-xs">
            <Sparkle weight="fill" className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="title-2 text-charcoal font-semibold">DayLens AI</h2>
              <span className={`caption-4 px-2 py-0.5 rounded-full font-semibold border ${
                isAuthenticated 
                  ? 'bg-botanical-100 text-botanical-800 border-botanical-200' 
                  : 'bg-sage-100 text-botanical-800 border-sage-200'
              }`}>
                {isAuthenticated ? 'Live AI & MongoDB Connected' : 'Simulated Intelligence Mode'}
              </span>
            </div>
            <p className="caption-3 text-charcoal-muted">
              {isAuthenticated 
                ? `Syncing live with personal database (${records.length} records active)`
                : `Analyzing ${records.length} days of your local biometric and habit data`}
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 rounded-lg text-charcoal-muted hover:text-rose-700 hover:bg-rose-50 transition-colors"
          title="Clear chat history"
          aria-label="Clear chat history"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>

      {/* Notice Banner */}
      <div className="px-4 py-2 bg-sage-50/70 border-b border-border flex items-center justify-between text-charcoal-muted caption-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-botanical-800 flex-shrink-0" />
          <span>
            {isAuthenticated
              ? "Live AI microservice & ElevenLabs TTS enabled. Data processed and grounded in your authenticated MongoDB database."
              : "Simulated conversational assistant. Computes answers entirely inside your browser using client-side statistical logic."}
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-sage-100 text-botanical-800 flex items-center justify-center mb-3">
              <Sparkle className="w-6 h-6" />
            </div>
            <h3 className="title-2 text-charcoal font-semibold">Ask DayLens Anything</h3>
            <p className="caption-2 text-charcoal-muted mt-1 leading-relaxed">
              Inquire about your sleep patterns, peak focus hours, activity trends, or suggestions for tomorrow.
            </p>
          </div>
        ) : (
          chatMessages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onSpeak={msg.sender === 'assistant' ? handleSpeak : null}
              isSpeaking={speakingText === msg.text}
            />
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-botanical-800 text-white flex items-center justify-center">
              <Sparkle weight="fill" className="w-4 h-4 text-white" />
            </div>
            <div className="bg-sage-50 border border-border rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-botanical-600 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-botanical-600 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-botanical-600 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Chips */}
      <div className="px-4 py-2 border-t border-border bg-white flex items-center gap-2 overflow-x-auto no-scrollbar">
        <Lightbulb className="w-4 h-4 text-botanical-700 flex-shrink-0" />
        <span className="caption-4 text-charcoal-muted flex-shrink-0">Try asking:</span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="caption-4 py-1 px-2.5 rounded-full bg-sage-50 border border-border text-charcoal hover:bg-sage-100 hover:border-border-strong whitespace-nowrap transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-border bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice input button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition-all duration-300 ease-skill-base ${
              isListening
                ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                : 'bg-sage-50 text-charcoal-muted border-border hover:text-charcoal hover:bg-sage-100'
            }`}
            title={isListening ? "Listening... click to cancel" : "Speak your query (Local Speech Prototype)"}
            aria-label="Voice input"
          >
            <Microphone className="w-5 h-5" weight={isListening ? "fill" : "regular"} />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? "Listening to your voice..." : "Ask about your sleep, focus, or habits..."}
            className="flex-1 py-2 px-3.5 rounded-xl border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600 focus:border-transparent transition-all"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className={`btn-primary button-sm ${!inputValue.trim() || isTyping ? 'opacity-40 cursor-not-allowed' : ''}`}
            aria-label="Send message"
          >
            <PaperPlaneRight className="w-4 h-4" weight="bold" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
