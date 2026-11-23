import React from 'react';
import { 
  Sparkle, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Info, 
  CheckCircle, 
  Lightbulb, 
  Calendar 
} from '@phosphor-icons/react';

export default function InsightCard({ pattern, dateRangeLabel = "Last 30 Days" }) {
  const isPositive = pattern.r >= 0;

  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-border-strong transition-all duration-300 ease-skill-base">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="caption-3 px-2.5 py-0.5 rounded-full bg-sage-100 text-botanical-800 font-semibold border border-sage-200">
              {pattern.category}
            </span>
            <div className="flex items-center gap-1 caption-4 text-charcoal-muted">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateRangeLabel}</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded caption-3 font-semibold bg-sage-50 text-charcoal border border-border">
            <span>Pearson r:</span>
            <span className="font-bold text-botanical-900">{pattern.r > 0 ? `+${pattern.r}` : pattern.r}</span>
          </div>
        </div>

        {/* Title & Core Explanation */}
        <h3 className="title-2 text-charcoal font-semibold mb-2">
          {pattern.title}
        </h3>
        <p className="body-5 text-charcoal-muted mb-4 leading-relaxed">
          {pattern.explanation}
        </p>

        {/* Supporting Sample Data Metric */}
        <div className="p-3.5 rounded-xl bg-sage-50/50 border border-border mb-4">
          <p className="caption-3 font-semibold text-charcoal mb-1">Observed Data Pattern</p>
          <p className="caption-2 text-charcoal leading-relaxed">{pattern.supportingData}</p>
        </div>

        {/* Suggested Routine Experiment / Action */}
        <div className="p-3.5 rounded-xl bg-botanical-50/70 border border-botanical-200 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-4 h-4 text-botanical-800" weight="fill" />
            <span className="caption-3 font-semibold text-botanical-900">Suggested Action to Test</span>
          </div>
          <p className="caption-2 text-botanical-800">{pattern.action}</p>
        </div>
      </div>

      {/* Footer / Scientific Rigor Disclaimer */}
      <div className="pt-3 border-t border-border flex flex-col gap-2">
        <div className="flex items-center justify-between caption-4">
          <span className="text-charcoal-muted font-medium">Statistical Evidence:</span>
          <span className="font-semibold text-botanical-800">{pattern.confidence}</span>
        </div>
        <div className="flex items-start gap-2 caption-5 text-charcoal-muted leading-relaxed">
          <Info className="w-3.5 h-3.5 text-charcoal-light flex-shrink-0 mt-0.5" />
          <span>{pattern.disclaimer}</span>
        </div>
      </div>
    </div>
  );
}
