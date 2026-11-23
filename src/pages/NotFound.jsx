import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkle, ArrowLeft } from '@phosphor-icons/react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-12 h-12 rounded-2xl bg-sage-100 text-botanical-800 flex items-center justify-center mb-4">
        <Sparkle className="w-6 h-6" />
      </div>
      <h2 className="heading-4 text-charcoal font-semibold">Page Not Found</h2>
      <p className="caption-1 text-charcoal-muted mt-1 max-w-sm">
        The requested view does not exist in the DayLens prototype. Return to your personal intelligence dashboard.
      </p>
      <Link to="/" className="mt-5 btn-primary button-sm">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Overview</span>
      </Link>
    </div>
  );
}
