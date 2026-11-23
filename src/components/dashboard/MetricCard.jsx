import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from '@phosphor-icons/react';

export default function MetricCard({
  title,
  value,
  unit,
  comparisonLabel,
  comparisonType = "neutral", // 'positive' | 'negative' | 'neutral'
  icon: Icon,
  subtitle
}) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5 shadow-xs transition-all duration-300 ease-skill-base hover:border-border-strong hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-xl bg-sage-50 border border-sage-100 text-botanical-800">
          <Icon className="w-5 h-5" weight="bold" />
        </div>
        {comparisonLabel && (
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md caption-4 font-semibold border ${
            comparisonType === 'positive' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : comparisonType === 'negative'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-sage-50 text-charcoal-muted border-sage-100'
          }`}>
            {comparisonType === 'positive' && <ArrowUpRight className="w-3.5 h-3.5" weight="bold" />}
            {comparisonType === 'negative' && <ArrowDownRight className="w-3.5 h-3.5" weight="bold" />}
            {comparisonType === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            <span>{comparisonLabel}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="caption-2 text-charcoal-muted">{title}</p>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="heading-5 text-charcoal font-semibold tracking-tight">{value}</span>
          {unit && <span className="caption-1 text-charcoal-muted">{unit}</span>}
        </div>
        {subtitle && (
          <p className="caption-5 text-charcoal-light mt-1 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
