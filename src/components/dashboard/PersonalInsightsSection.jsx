import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkle, ArrowRight, Info, ShieldCheck, CheckCircle } from '@phosphor-icons/react';
import { discoverPatterns } from '../../utils/analytics';

export default function PersonalInsightsSection({ records = [] }) {
  const patterns = discoverPatterns(records);
  const primaryPattern = patterns[0] || null;
  const secondaryPattern = patterns[1] || null;

  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-botanical-800 text-white flex items-center justify-center flex-shrink-0">
            <Sparkle weight="fill" className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="title-2 text-charcoal font-semibold">Your Personal Insights</h3>
            <p className="caption-2 text-charcoal-muted">
              Observed statistical patterns synthesized from your daily logs
            </p>
          </div>
        </div>

        <Link
          to="/insights"
          className="inline-flex items-center gap-1.5 text-botanical-800 hover:text-botanical-700 caption-1 font-semibold group"
        >
          <span>Explore All Discoveries</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {primaryPattern ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          {/* Card 1: Primary Discovery */}
          <div className="p-5 rounded-xl border border-sage-200 bg-sage-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="caption-3 px-2 py-0.5 rounded-full bg-botanical-100 text-botanical-800 font-semibold border border-botanical-200">
                  {primaryPattern.category}
                </span>
                <span className="caption-4 text-charcoal-muted">
                  {primaryPattern.confidence}
                </span>
              </div>

              <h4 className="title-3 text-charcoal font-semibold mb-1.5">
                {primaryPattern.title}
              </h4>
              <p className="body-6 text-charcoal-muted mb-3">
                {primaryPattern.explanation}
              </p>

              <div className="p-3 rounded-lg bg-white border border-border text-charcoal caption-2 mb-3">
                <span className="font-semibold text-charcoal">Supporting data: </span>
                <span>{primaryPattern.supportingData}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-sage-200/60">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-botanical-700 flex-shrink-0 mt-0.5" />
                <p className="caption-5 text-charcoal-muted leading-relaxed">
                  {primaryPattern.disclaimer}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Secondary Discovery */}
          {secondaryPattern && (
            <div className="p-5 rounded-xl border border-border bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="caption-3 px-2 py-0.5 rounded-full bg-sage-100 text-charcoal font-semibold border border-sage-200">
                    {secondaryPattern.category}
                  </span>
                  <span className="caption-4 text-charcoal-muted">
                    {secondaryPattern.confidence}
                  </span>
                </div>

                <h4 className="title-3 text-charcoal font-semibold mb-1.5">
                  {secondaryPattern.title}
                </h4>
                <p className="body-6 text-charcoal-muted mb-3">
                  {secondaryPattern.explanation}
                </p>

                <div className="p-3 rounded-lg bg-sage-50/50 border border-border text-charcoal caption-2 mb-3">
                  <span className="font-semibold text-charcoal">Observed shift: </span>
                  <span>{secondaryPattern.supportingData}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-charcoal-light flex-shrink-0 mt-0.5" />
                  <p className="caption-5 text-charcoal-muted leading-relaxed">
                    {secondaryPattern.disclaimer}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-sage-50/50 rounded-xl border border-border mt-5">
          <p className="caption-1 text-charcoal font-medium">Insufficient entries for pattern detection</p>
          <p className="caption-5 text-charcoal-muted mt-1">
            Log at least 4 daily entries to discover statistical correlations across your routines.
          </p>
        </div>
      )}
    </div>
  );
}
