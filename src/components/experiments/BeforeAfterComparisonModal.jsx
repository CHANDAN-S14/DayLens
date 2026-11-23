import React from 'react';
import { X, TrendUp, Info, CheckCircle, ArrowsLeftRight } from '@phosphor-icons/react';
import { calculateMean } from '../../utils/analytics';

export default function BeforeAfterComparisonModal({ isOpen, onClose, experiment, records = [] }) {
  if (!isOpen || !experiment) return null;

  // Extract records during experiment dates
  const experimentDays = experiment.completedDays || [];
  const activeRecords = records.filter(r => experimentDays.includes(r.date));
  const otherRecords = records.filter(r => !experimentDays.includes(r.date));

  // Compute metrics during completed days vs outside days
  const avgFocusExp = activeRecords.length > 0 ? calculateMean(activeRecords.map(r => r.focus)) : null;
  const avgFocusBaseline = otherRecords.length > 0 ? calculateMean(otherRecords.map(r => r.focus)) : null;

  const avgSleepExp = activeRecords.length > 0 ? calculateMean(activeRecords.map(r => r.sleepHours)) : null;
  const avgSleepBaseline = otherRecords.length > 0 ? calculateMean(otherRecords.map(r => r.sleepHours)) : null;

  const avgScreenExp = activeRecords.length > 0 ? calculateMean(activeRecords.map(r => r.screenTimeHours)) : null;
  const avgScreenBaseline = otherRecords.length > 0 ? calculateMean(otherRecords.map(r => r.screenTimeHours)) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xl bg-white border border-border rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 border-b border-border bg-sage-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-botanical-800 text-white">
              <ArrowsLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="title-1 text-charcoal">Before & After Habit Comparison</h3>
              <p className="caption-2 text-charcoal-muted mt-0.5">
                Empirical evaluation across your local daily records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-sage-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Experiment Header */}
          <div className="p-4 rounded-xl bg-sage-50/50 border border-border">
            <span className="caption-4 px-2 py-0.5 rounded-full bg-botanical-100 text-botanical-800 font-semibold border border-botanical-200 uppercase">
              {experiment.status}
            </span>
            <h4 className="title-2 text-charcoal font-semibold mt-1.5">
              {experiment.title}
            </h4>
            <p className="caption-2 text-charcoal-muted mt-1">
              {experiment.objective}
            </p>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Focus */}
            <div className="p-4 rounded-xl border border-border bg-white shadow-xs">
              <span className="caption-2 text-charcoal-muted block mb-1">Focus Score</span>
              <div className="space-y-1">
                <div className="flex justify-between caption-4">
                  <span className="text-charcoal-muted">Non-active days:</span>
                  <span className="font-semibold text-charcoal">
                    {avgFocusBaseline !== null ? `${avgFocusBaseline.toFixed(1)}/10` : '—'}
                  </span>
                </div>
                <div className="flex justify-between caption-3">
                  <span className="font-semibold text-botanical-800">Protocol days:</span>
                  <span className="font-bold text-botanical-800">
                    {avgFocusExp !== null ? `${avgFocusExp.toFixed(1)}/10` : '—'}
                  </span>
                </div>
              </div>
              {avgFocusExp !== null && avgFocusBaseline !== null && (
                <div className="mt-2 pt-2 border-t border-border caption-4 text-emerald-700 font-semibold">
                  {avgFocusExp >= avgFocusBaseline ? `+${(avgFocusExp - avgFocusBaseline).toFixed(1)} pts` : `${(avgFocusExp - avgFocusBaseline).toFixed(1)} pts`}
                </div>
              )}
            </div>

            {/* Sleep */}
            <div className="p-4 rounded-xl border border-border bg-white shadow-xs">
              <span className="caption-2 text-charcoal-muted block mb-1">Sleep Hours</span>
              <div className="space-y-1">
                <div className="flex justify-between caption-4">
                  <span className="text-charcoal-muted">Non-active days:</span>
                  <span className="font-semibold text-charcoal">
                    {avgSleepBaseline !== null ? `${avgSleepBaseline.toFixed(1)}h` : '—'}
                  </span>
                </div>
                <div className="flex justify-between caption-3">
                  <span className="font-semibold text-botanical-800">Protocol days:</span>
                  <span className="font-bold text-botanical-800">
                    {avgSleepExp !== null ? `${avgSleepExp.toFixed(1)}h` : '—'}
                  </span>
                </div>
              </div>
              {avgSleepExp !== null && avgSleepBaseline !== null && (
                <div className="mt-2 pt-2 border-t border-border caption-4 text-emerald-700 font-semibold">
                  {avgSleepExp >= avgSleepBaseline ? `+${(avgSleepExp - avgSleepBaseline).toFixed(1)}h` : `${(avgSleepExp - avgSleepBaseline).toFixed(1)}h`}
                </div>
              )}
            </div>

            {/* Screen Time */}
            <div className="p-4 rounded-xl border border-border bg-white shadow-xs">
              <span className="caption-2 text-charcoal-muted block mb-1">Screen Time</span>
              <div className="space-y-1">
                <div className="flex justify-between caption-4">
                  <span className="text-charcoal-muted">Non-active days:</span>
                  <span className="font-semibold text-charcoal">
                    {avgScreenBaseline !== null ? `${avgScreenBaseline.toFixed(1)}h` : '—'}
                  </span>
                </div>
                <div className="flex justify-between caption-3">
                  <span className="font-semibold text-botanical-800">Protocol days:</span>
                  <span className="font-bold text-botanical-800">
                    {avgScreenExp !== null ? `${avgScreenExp.toFixed(1)}h` : '—'}
                  </span>
                </div>
              </div>
              {avgScreenExp !== null && avgScreenBaseline !== null && (
                <div className="mt-2 pt-2 border-t border-border caption-4 text-emerald-700 font-semibold">
                  {avgScreenExp <= avgScreenBaseline ? `${(avgScreenExp - avgScreenBaseline).toFixed(1)}h` : `+${(avgScreenExp - avgScreenBaseline).toFixed(1)}h`}
                </div>
              )}
            </div>
          </div>

          {/* Stated Targets vs Realization */}
          <div className="p-4 rounded-xl bg-sage-50/70 border border-border caption-2 text-charcoal space-y-1.5">
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Stated baseline:</span>
              <span className="font-semibold">{experiment.baseline || "Self-monitored"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Stated target:</span>
              <span className="font-semibold text-botanical-800">{experiment.target}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Total protocol days completed:</span>
              <span className="font-semibold">{experimentDays.length} of {experiment.durationDays} days</span>
            </div>
          </div>

          {/* Scientific Disclaimer */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sage-50/50 border border-border text-charcoal-muted caption-5 leading-relaxed">
            <Info className="w-4 h-4 text-botanical-700 flex-shrink-0 mt-0.5" />
            <span>
              Causal attribution rule: Observed improvements during protocol days co-occur with your habit change. They may also be influenced by weekend rest, stress fluctuations, or season. Never assume absolute single-variable causation.
            </span>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-sage-50/30 flex justify-end">
          <button
            onClick={onClose}
            className="btn-primary button-sm"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
