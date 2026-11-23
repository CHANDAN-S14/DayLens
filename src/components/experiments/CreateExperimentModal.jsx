import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Flask, Check, Calendar, Target, Lightning } from '@phosphor-icons/react';

const PRESET_TEMPLATES = [
  {
    title: "Sleep 30 minutes earlier",
    objective: "Test whether extending the total time in bed dampens afternoon cognitive lethargy.",
    durationDays: 14,
    baseline: "6.6h sleep, 6.2 focus",
    target: "7.5h+ sleep, 7.8 focus"
  },
  {
    title: "Wind down phone 45 min before bed",
    objective: "Reduce evening screen stimulation to facilitate rapid sleep latency and deep slow-wave sleep.",
    durationDays: 14,
    baseline: "1.5h evening screen time",
    target: "0 min screen time after 10:15 PM"
  },
  {
    title: "Post-lunch 15-minute brisk walk",
    objective: "Utilize light physical activity postprandially to prevent glucose spikes and 2 PM slump.",
    durationDays: 14,
    baseline: "5.5 afternoon alertness",
    target: "7.0+ afternoon alertness"
  },
  {
    title: "Standardized 7:00 AM weekend wake-up",
    objective: "Eliminate social jetlag by waking at the same time on Saturday and Sunday as workdays.",
    durationDays: 21,
    baseline: "Monday mood 5.0",
    target: "Monday mood 7.5+"
  }
];

export default function CreateExperimentModal({ isOpen, onClose }) {
  const { addExperiment } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    objective: '',
    durationDays: 14,
    baseline: '',
    target: '',
    startDate: new Date().toISOString().slice(0, 10),
    notes: ''
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleApplyTemplate = (tpl) => {
    setFormData({
      ...formData,
      title: tpl.title,
      objective: tpl.objective,
      durationDays: tpl.durationDays,
      baseline: tpl.baseline,
      target: tpl.target
    });
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Title is required.";
    if (!formData.objective.trim()) errs.objective = "Objective description is required.";
    if (!formData.target.trim()) errs.target = "Measurable target is required.";
    const dur = Number(formData.durationDays);
    if (isNaN(dur) || dur < 3 || dur > 90) {
      errs.durationDays = "Duration should be between 3 and 90 days.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addExperiment({
      ...formData,
      durationDays: Number(formData.durationDays),
      notes: formData.notes || "Personal self-experiment protocol."
    });
    onClose();
  };

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
              <Flask className="w-5 h-5" />
            </div>
            <div>
              <h3 className="title-1 text-charcoal">Design Habit Experiment</h3>
              <p className="caption-2 text-charcoal-muted mt-0.5">
                Set up a controlled self-observation to test daily habit changes
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

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Presets */}
          <div>
            <label className="caption-1 text-charcoal block mb-2">
              Quick Experiment Starters:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_TEMPLATES.map((tpl, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="text-left p-2.5 rounded-xl border border-border bg-sage-50/40 hover:bg-sage-100 hover:border-border-strong transition-all caption-3 text-charcoal"
                >
                  <p className="font-semibold truncate">{tpl.title}</p>
                  <p className="caption-5 text-charcoal-muted truncate mt-0.5">{tpl.durationDays} days • {tpl.target}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block caption-1 text-charcoal mb-1.5">
              Experiment Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="E.g., Morning sunlight within 30 min of waking"
              className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
            />
            {errors.title && <p className="caption-4 text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* Objective */}
          <div>
            <label className="block caption-1 text-charcoal mb-1.5">
              Test Objective & Hypothesis
            </label>
            <textarea
              rows="2"
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
              placeholder="What question are you testing? E.g., Does stepping outdoors right after waking improve 10 AM focus?"
              className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600 resize-none"
            />
            {errors.objective && <p className="caption-4 text-red-600 mt-1">{errors.objective}</p>}
          </div>

          {/* Grid: Duration & Start Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block caption-1 text-charcoal mb-1.5">
                Duration (Days)
              </label>
              <input
                type="number"
                min="3"
                max="90"
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
              />
              {errors.durationDays && <p className="caption-4 text-red-600 mt-1">{errors.durationDays}</p>}
            </div>

            <div>
              <label className="block caption-1 text-charcoal mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
              />
            </div>
          </div>

          {/* Grid: Baseline & Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block caption-1 text-charcoal mb-1.5">
                Starting Baseline
              </label>
              <input
                type="text"
                value={formData.baseline}
                onChange={(e) => setFormData({ ...formData, baseline: e.target.value })}
                placeholder="E.g., 6.4h sleep, 5.8 focus"
                className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
              />
            </div>

            <div>
              <label className="block caption-1 text-charcoal mb-1.5">
                Measurable Target
              </label>
              <input
                type="text"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                placeholder="E.g., 7.5h sleep, 7.8 focus"
                className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
              />
              {errors.target && <p className="caption-4 text-red-600 mt-1">{errors.target}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary button-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary button-sm"
            >
              <Check className="w-4 h-4" />
              <span>Launch Experiment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
