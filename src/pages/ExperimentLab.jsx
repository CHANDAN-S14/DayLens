import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Flask, 
  Plus, 
  Info, 
  CheckCircle, 
  Pause, 
  Play, 
  Sparkle,
  TrendUp
} from '@phosphor-icons/react';
import ExperimentCard from '../components/experiments/ExperimentCard';
import CreateExperimentModal from '../components/experiments/CreateExperimentModal';
import BeforeAfterComparisonModal from '../components/experiments/BeforeAfterComparisonModal';

export default function ExperimentLab() {
  const { 
    experiments, 
    records, 
    addExperiment, 
    toggleExperimentDay, 
    updateExperimentStatus, 
    deleteExperiment 
  } = useApp();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [comparingExperiment, setComparingExperiment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredExperiments = experiments.filter(e => {
    if (filterStatus === 'all') return true;
    return e.status === filterStatus;
  });

  const activeCount = experiments.filter(e => e.status === 'active').length;
  const completedCount = experiments.filter(e => e.status === 'completed').length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header Card */}
      <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="caption-3 px-2 py-0.5 rounded-full bg-botanical-100 text-botanical-800 font-semibold border border-botanical-200">
                Self-Observation Protocol
              </span>
              <span className="caption-4 text-charcoal-muted">
                {activeCount} active • {completedCount} concluded
              </span>
            </div>
            <h2 className="heading-5 text-charcoal font-semibold">
              Personal Experiment Lab
            </h2>
            <p className="body-5 text-charcoal-muted mt-1 max-w-2xl leading-relaxed">
              Design small, iterative habit interventions and track how they impact your sleep, screen time, and focus scores. Test routines like a scientist rather than guessing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="btn-primary button-md"
            >
              <Plus className="w-4 h-4" weight="bold" />
              <span>Design Experiment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-sage-50 rounded-xl border border-border">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg caption-3 font-semibold transition-all duration-300 ease-skill-base ${
              filterStatus === 'all'
                ? 'bg-white text-botanical-800 shadow-xs border border-border'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            All Experiments ({experiments.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-lg caption-3 font-semibold transition-all duration-300 ease-skill-base ${
              filterStatus === 'active'
                ? 'bg-white text-botanical-800 shadow-xs border border-border'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg caption-3 font-semibold transition-all duration-300 ease-skill-base ${
              filterStatus === 'completed'
                ? 'bg-white text-botanical-800 shadow-xs border border-border'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="caption-4 text-charcoal-muted">
          All progress is preserved in your local browser storage.
        </div>
      </div>

      {/* Experiment Cards Grid */}
      {filteredExperiments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExperiments.map((exp) => (
            <ExperimentCard
              key={exp.id}
              experiment={exp}
              onToggleDay={toggleExperimentDay}
              onUpdateStatus={updateExperimentStatus}
              onDelete={deleteExperiment}
              onCompare={(e) => setComparingExperiment(e)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-border rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-sage-100 text-botanical-800 flex items-center justify-center mx-auto mb-3">
            <Flask className="w-6 h-6" />
          </div>
          <h4 className="title-3 text-charcoal font-semibold">No Experiments in this Category</h4>
          <p className="caption-2 text-charcoal-muted mt-1 max-w-sm mx-auto">
            Create a habit experiment to begin testing routine modifications against your daily metrics.
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="mt-4 btn-primary button-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Experiment</span>
          </button>
        </div>
      )}

      {/* Methodological Guidance Note */}
      <div className="p-5 rounded-2xl bg-sage-50/70 border border-border flex items-start gap-3">
        <Info className="w-5 h-5 text-botanical-800 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="caption-1 font-semibold text-charcoal">
            Principles for Valid N-of-1 Personal Experiments
          </p>
          <p className="caption-4 text-charcoal-muted leading-relaxed">
            1. Change only one variable at a time (e.g., test evening phone cutoff before simultaneously altering morning wake time).<br />
            2. Run each intervention for at least 14 continuous days to filter out random weekday vs weekend variances.<br />
            3. Review before and after metric distributions without assuming absolute causal determinism.
          </p>
        </div>
      </div>

      {/* Create Experiment Modal */}
      <CreateExperimentModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {/* Before / After Comparison Modal */}
      {comparingExperiment && (
        <BeforeAfterComparisonModal
          isOpen={!!comparingExperiment}
          onClose={() => setComparingExperiment(null)}
          experiment={comparingExperiment}
          records={records}
        />
      )}
    </div>
  );
}
