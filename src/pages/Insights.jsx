import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkle, 
  Funnel, 
  Info, 
  ShieldCheck, 
  WarningCircle, 
  TrendUp,
  Brain,
  Moon,
  Monitor,
  Heart
} from '@phosphor-icons/react';
import { discoverPatterns, filterRecordsByRange } from '../utils/analytics';
import InsightCard from '../components/insights/InsightCard';
import ScatterExplorer from '../components/insights/ScatterExplorer';

export default function Insights() {
  const { records } = useApp();
  const [timeFilter, setTimeFilter] = useState('30d');

  // Filter records based on selected time window
  const activeRecords = filterRecordsByRange(records, timeFilter);
  const patterns = discoverPatterns(activeRecords);

  const filterLabels = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    'all': 'All Available History'
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner & Scope Filters */}
      <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="caption-3 px-2 py-0.5 rounded-full bg-botanical-100 text-botanical-800 font-semibold border border-botanical-200">
                Statistical Intelligence
              </span>
              <span className="caption-4 text-charcoal-muted">
                {activeRecords.length} records in active calculation window
              </span>
            </div>
            <h2 className="heading-5 text-charcoal font-semibold">
              Pattern Discovery & Correlation Analysis
            </h2>
            <p className="body-5 text-charcoal-muted mt-1 max-w-2xl leading-relaxed">
              DayLens computes statistical relationships directly from your stored daily logs. All Pearson correlation values update instantly when entries or date ranges are adjusted.
            </p>
          </div>

          {/* Time Filter Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-sage-50 rounded-xl border border-border flex-shrink-0">
            <button
              onClick={() => setTimeFilter('7d')}
              className={`px-3 py-1.5 rounded-lg caption-3 font-semibold transition-all duration-300 ease-skill-base ${
                timeFilter === '7d'
                  ? 'bg-white text-botanical-800 shadow-xs border border-border'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeFilter('30d')}
              className={`px-3 py-1.5 rounded-lg caption-3 font-semibold transition-all duration-300 ease-skill-base ${
                timeFilter === '30d'
                  ? 'bg-white text-botanical-800 shadow-xs border border-border'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1.5 rounded-lg caption-3 font-semibold transition-all duration-300 ease-skill-base ${
                timeFilter === 'all'
                  ? 'bg-white text-botanical-800 shadow-xs border border-border'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              All Records ({records.length})
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Scientific Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-sage-50/80 border border-border flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-botanical-800 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="caption-1 font-semibold text-charcoal">
            Rigorous Statistical Transparency & Scope
          </p>
          <p className="caption-5 text-charcoal-muted leading-relaxed">
            Observed relationships reflect empirical Pearson associations ($r$) across your local records. Correlation does not imply causation, and personal lifestyle habits are influenced by complex confounding factors. DayLens does not diagnose medical conditions or substitute for professional medical counsel.
          </p>
        </div>
      </div>

      {/* Interactive Scatter Plot Correlation Explorer */}
      <ScatterExplorer records={activeRecords} />

      {/* Pattern Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="title-2 text-charcoal font-semibold">
            Synthesized Pattern Discoveries ({patterns.length})
          </h3>
          <span className="caption-3 text-charcoal-muted">
            Evaluation scope: {filterLabels[timeFilter]}
          </span>
        </div>

        {patterns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patterns.map((pattern) => (
              <InsightCard
                key={pattern.id}
                pattern={pattern}
                dateRangeLabel={filterLabels[timeFilter]}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white border border-border rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-sage-100 text-botanical-800 flex items-center justify-center mx-auto mb-3">
              <Sparkle className="w-6 h-6" />
            </div>
            <h4 className="title-3 text-charcoal font-semibold">Insufficient Data for Pattern Synthesis</h4>
            <p className="caption-2 text-charcoal-muted mt-1 max-w-md mx-auto leading-relaxed">
              We need at least 4 daily logs in the selected timeframe to calculate Pearson correlation coefficients. Log additional days or switch to "All Records".
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
