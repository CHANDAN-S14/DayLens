import React from 'react';
import { Database, Sparkle } from '@phosphor-icons/react';

export default function DemoBadge({ variant = "default" }) {
  if (variant === "compact") {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sage-100 border border-sage-200 text-botanical-800 caption-4">
        <span className="w-1.5 h-1.5 rounded-full bg-botanical-600 animate-pulse"></span>
        <span>Demo Data</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-sage-50 border border-sage-200 text-botanical-800 caption-3">
      <Sparkle weight="fill" className="w-3.5 h-3.5 text-botanical-600" />
      <span>Frontend Prototype • Local Storage Mode</span>
    </div>
  );
}
