import React from 'react';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Trash, 
  Calendar, 
  Target, 
  ArrowsLeftRight, 
  Flame,
  Check
} from '@phosphor-icons/react';
import confetti from 'canvas-confetti';

export default function ExperimentCard({
  experiment,
  onToggleDay,
  onUpdateStatus,
  onDelete,
  onCompare
}) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const completedDays = experiment.completedDays || [];
  const isCompletedToday = completedDays.includes(todayStr);

  const percentProgress = Math.min(
    100,
    Math.round((completedDays.length / experiment.durationDays) * 100)
  );

  const handleToggleToday = () => {
    onToggleDay(experiment.id, todayStr);
    if (!isCompletedToday) {
      // Fire subtle celebratory confetti
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#1B4332', '#749682', '#9FC7AE']
      });
    }
  };

  const statusBadges = {
    active: "bg-emerald-50 text-emerald-800 border-emerald-200",
    paused: "bg-amber-50 text-amber-800 border-amber-200",
    completed: "bg-botanical-100 text-botanical-900 border-botanical-300"
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-border-strong transition-all duration-300 ease-skill-base">
      <div>
        {/* Status Header */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className={`caption-4 px-2.5 py-0.5 rounded-full border font-semibold uppercase ${statusBadges[experiment.status] || statusBadges.active}`}>
            {experiment.status}
          </span>
          <div className="flex items-center gap-1 caption-4 text-charcoal-muted">
            <Calendar className="w-3.5 h-3.5" />
            <span>Started {experiment.startDate}</span>
          </div>
        </div>

        {/* Title & Objective */}
        <h3 className="title-2 text-charcoal font-semibold mb-1.5">
          {experiment.title}
        </h3>
        <p className="body-5 text-charcoal-muted mb-4 leading-relaxed">
          {experiment.objective}
        </p>

        {/* Baseline vs Target Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
          <div className="p-2.5 rounded-xl bg-sage-50/50 border border-border">
            <span className="caption-4 text-charcoal-muted block">Baseline:</span>
            <span className="caption-2 font-medium text-charcoal">{experiment.baseline || "Pre-trial average"}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-botanical-50/50 border border-botanical-200">
            <span className="caption-4 text-botanical-800 block">Target:</span>
            <span className="caption-2 font-semibold text-botanical-900">{experiment.target}</span>
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center justify-between caption-3 text-charcoal">
            <span className="font-semibold">Consistency Progress:</span>
            <span className="text-botanical-800 font-bold">
              {completedDays.length} of {experiment.durationDays} days ({percentProgress}%)
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-sage-100 overflow-hidden">
            <div
              className="h-full bg-botanical-800 rounded-full transition-all duration-500 ease-skill-base"
              style={{ width: `${percentProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-border space-y-3">
        {/* Daily Completion Checkbox Action */}
        <button
          onClick={handleToggleToday}
          className={`w-full py-2 px-3 rounded-xl border flex items-center justify-center gap-2 caption-2 font-semibold transition-all duration-300 ease-skill-base ${
            isCompletedToday
              ? 'bg-botanical-800 text-white border-botanical-800'
              : 'bg-white text-charcoal border-border hover:bg-sage-50 hover:border-border-strong'
          }`}
        >
          <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
            isCompletedToday ? 'bg-white text-botanical-800 border-white' : 'border-border'
          }`}>
            {isCompletedToday && <Check className="w-3.5 h-3.5" weight="bold" />}
          </div>
          <span>{isCompletedToday ? "Completed for Today" : "Mark Today as Completed"}</span>
        </button>

        {/* Auxiliary Controls */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={() => onCompare(experiment)}
            className="caption-3 font-semibold text-botanical-800 hover:text-botanical-700 inline-flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-sage-50 transition-colors"
          >
            <ArrowsLeftRight className="w-4 h-4" />
            <span>Compare Before/After</span>
          </button>

          <div className="flex items-center gap-1">
            {experiment.status === 'active' ? (
              <button
                onClick={() => onUpdateStatus(experiment.id, 'paused')}
                className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-sage-50 transition-colors"
                title="Pause experiment"
              >
                <Pause className="w-4 h-4" />
              </button>
            ) : experiment.status === 'paused' ? (
              <button
                onClick={() => onUpdateStatus(experiment.id, 'active')}
                className="p-1.5 rounded-lg text-botanical-800 hover:bg-sage-50 transition-colors"
                title="Resume experiment"
              >
                <Play className="w-4 h-4" />
              </button>
            ) : null}

            {experiment.status !== 'completed' && (
              <button
                onClick={() => onUpdateStatus(experiment.id, 'completed')}
                className="p-1.5 rounded-lg text-charcoal-muted hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                title="Mark experiment completed"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onDelete(experiment.id)}
              className="p-1.5 rounded-lg text-charcoal-muted hover:text-rose-700 hover:bg-rose-50 transition-colors"
              title="Delete experiment"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
