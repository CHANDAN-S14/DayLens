import React, { useState } from 'react';
import { Sparkle, User, SpeakerHigh, Stop } from '@phosphor-icons/react';

export default function ChatMessage({ message, onSpeak, isSpeaking }) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
        isUser ? 'bg-charcoal' : 'bg-botanical-800'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Sparkle weight="fill" className="w-4 h-4 text-white" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 transition-all ${
        isUser
          ? 'bg-botanical-800 text-white rounded-tr-none'
          : 'bg-white border border-border text-charcoal rounded-tl-none shadow-xs'
      }`}>
        {/* Header inside assistant message */}
        {!isUser && (
          <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-border/60">
            <div className="flex items-center gap-2">
              <span className="caption-3 font-semibold text-charcoal">DayLens AI</span>
              <span className="caption-5 px-1.5 py-0.2 rounded bg-sage-50 text-charcoal-muted border border-border">
                Local Engine
              </span>
            </div>

            {onSpeak && (
              <button
                onClick={() => onSpeak(message.text)}
                className="p-1 rounded text-charcoal-muted hover:text-charcoal hover:bg-sage-100 transition-colors"
                title={isSpeaking ? "Stop voice audio" : "Read message aloud"}
              >
                {isSpeaking ? <Stop className="w-3.5 h-3.5 text-rose-600" /> : <SpeakerHigh className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        )}

        {/* Text Body */}
        <div className={`body-5 leading-relaxed whitespace-pre-wrap ${isUser ? 'text-white' : 'text-charcoal'}`}>
          {message.text}
        </div>

        {/* Timestamp */}
        <div className={`mt-2 text-right caption-5 ${isUser ? 'text-sage-200' : 'text-charcoal-muted'}`}>
          {message.timestamp}
        </div>
      </div>
    </div>
  );
}
