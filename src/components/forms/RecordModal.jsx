import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Moon, Monitor, Footprints, Barbell, Heart, Brain, NotePencil, Check } from '@phosphor-icons/react';

export default function RecordModal({ isOpen, onClose, initialData = null }) {
  const { addRecord, updateRecord } = useApp();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    sleepHours: 7.5,
    screenTimeHours: 4.2,
    steps: 8500,
    exerciseDuration: 30,
    mood: 8,
    focus: 8,
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date || new Date().toISOString().slice(0, 10),
        sleepHours: initialData.sleepHours ?? 7.5,
        screenTimeHours: initialData.screenTimeHours ?? 4.2,
        steps: initialData.steps ?? 8500,
        exerciseDuration: initialData.exerciseDuration ?? 30,
        mood: initialData.mood ?? 8,
        focus: initialData.focus ?? 8,
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        date: new Date().toISOString().slice(0, 10),
        sleepHours: 7.5,
        screenTimeHours: 4.2,
        steps: 8500,
        exerciseDuration: 30,
        mood: 8,
        focus: 8,
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.date) {
      errs.date = "Date is required.";
    }
    const sleep = Number(formData.sleepHours);
    if (isNaN(sleep) || sleep < 0 || sleep > 24) {
      errs.sleepHours = "Sleep must be between 0 and 24 hours.";
    }
    const screen = Number(formData.screenTimeHours);
    if (isNaN(screen) || screen < 0 || screen > 24) {
      errs.screenTimeHours = "Screen time must be between 0 and 24 hours.";
    }
    const steps = Number(formData.steps);
    if (isNaN(steps) || steps < 0 || steps > 100000) {
      errs.steps = "Steps must be a positive number under 100,000.";
    }
    const exercise = Number(formData.exerciseDuration);
    if (isNaN(exercise) || exercise < 0 || exercise > 720) {
      errs.exerciseDuration = "Exercise must be between 0 and 720 minutes.";
    }
    const mood = Number(formData.mood);
    if (isNaN(mood) || mood < 1 || mood > 10) {
      errs.mood = "Mood score must be between 1 and 10.";
    }
    const focus = Number(formData.focus);
    if (isNaN(focus) || focus < 1 || focus > 10) {
      errs.focus = "Focus score must be between 1 and 10.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      sleepHours: Number(Number(formData.sleepHours).toFixed(1)),
      screenTimeHours: Number(Number(formData.screenTimeHours).toFixed(1)),
      steps: Math.round(Number(formData.steps)),
      exerciseDuration: Math.round(Number(formData.exerciseDuration)),
      mood: Number(Number(formData.mood).toFixed(1)),
      focus: Number(Number(formData.focus).toFixed(1)),
    };

    if (initialData && initialData.id) {
      updateRecord(initialData.id, payload);
    } else {
      addRecord(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xl bg-white border border-border rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-sage-50/50">
          <div>
            <h3 className="title-1 text-charcoal">
              {initialData ? "Edit Daily Entry" : "Add Daily Entry"}
            </h3>
            <p className="caption-2 text-charcoal-muted mt-0.5">
              Record personal habits for statistical pattern analysis
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-sage-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Date Picker */}
          <div>
            <label className="block caption-1 text-charcoal mb-1.5">
              Entry Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600 focus:border-transparent transition-all"
              />
            </div>
            {errors.date && <p className="caption-4 text-red-600 mt-1">{errors.date}</p>}
          </div>

          {/* Sleep and Screen Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 caption-1 text-charcoal mb-1.5">
                <Moon className="w-4 h-4 text-botanical-600" />
                Sleep Duration (Hours)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="24"
                value={formData.sleepHours}
                onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                placeholder="7.5"
                className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
              />
              {errors.sleepHours && <p className="caption-4 text-red-600 mt-1">{errors.sleepHours}</p>}
            </div>

            <div>
              <label className="flex items-center gap-1.5 caption-1 text-charcoal mb-1.5">
                <Monitor className="w-4 h-4 text-botanical-600" />
                Screen Time (Hours)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="24"
                value={formData.screenTimeHours}
                onChange={(e) => setFormData({ ...formData, screenTimeHours: e.target.value })}
                placeholder="4.0"
                className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
              />
              {errors.screenTimeHours && <p className="caption-4 text-red-600 mt-1">{errors.screenTimeHours}</p>}
            </div>
          </div>

          {/* Steps and Exercise Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 caption-1 text-charcoal mb-1.5">
                <Footprints className="w-4 h-4 text-botanical-600" />
                Daily Steps
              </label>
              <input
                type="number"
                step="100"
                min="0"
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                placeholder="8500"
                className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
              />
              {errors.steps && <p className="caption-4 text-red-600 mt-1">{errors.steps}</p>}
            </div>

            <div>
              <label className="flex items-center gap-1.5 caption-1 text-charcoal mb-1.5">
                <Barbell className="w-4 h-4 text-botanical-600" />
                Exercise (Minutes)
              </label>
              <input
                type="number"
                step="5"
                min="0"
                value={formData.exerciseDuration}
                onChange={(e) => setFormData({ ...formData, exerciseDuration: e.target.value })}
                placeholder="30"
                className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
              />
              {errors.exerciseDuration && <p className="caption-4 text-red-600 mt-1">{errors.exerciseDuration}</p>}
            </div>
          </div>

          {/* Ratings: Mood and Focus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-border bg-sage-50/40">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 caption-1 text-charcoal">
                  <Heart className="w-4 h-4 text-botanical-600" />
                  Mood Rating
                </label>
                <span className="caption-3 px-2 py-0.5 rounded bg-white border border-border text-charcoal font-semibold">
                  {formData.mood}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="w-full accent-botanical-700 cursor-pointer"
              />
              <div className="flex justify-between caption-5 text-charcoal-muted mt-1">
                <span>Low</span>
                <span>Calm</span>
                <span>Peak</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 caption-1 text-charcoal">
                  <Brain className="w-4 h-4 text-botanical-600" />
                  Focus Rating
                </label>
                <span className="caption-3 px-2 py-0.5 rounded bg-white border border-border text-charcoal font-semibold">
                  {formData.focus}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={formData.focus}
                onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                className="w-full accent-botanical-700 cursor-pointer"
              />
              <div className="flex justify-between caption-5 text-charcoal-muted mt-1">
                <span>Scattered</span>
                <span>Steady</span>
                <span>Flow</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-1.5 caption-1 text-charcoal mb-1.5">
              <NotePencil className="w-4 h-4 text-botanical-600" />
              Daily Reflection (Optional)
            </label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="E.g., Took a morning walk, avoided screen in bed. Felt energized in meetings."
              className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600 resize-none"
            />
          </div>

          {/* Action Buttons */}
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
              {initialData ? "Update Record" : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
