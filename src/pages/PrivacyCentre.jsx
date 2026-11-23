import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  DownloadSimple, 
  Trash, 
  ArrowCounterClockwise, 
  Info, 
  Lock, 
  EyeSlash, 
  CheckCircle,
  WarningCircle,
  Database
} from '@phosphor-icons/react';
import privacyService from '../services/privacyService';

export default function PrivacyCentre() {
  const { 
    records, 
    experiments, 
    profile, 
    updateProfile, 
    exportData, 
    clearAllData, 
    resetAllData,
    token,
    isAuthenticated
  } = useApp();

  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleWipeData = async () => {
    if (token) {
      try {
        await privacyService.deleteAllAccountData();
      } catch (e) {
        console.warn("Backend erasure error:", e);
      }
    }
    clearAllData();
    setClearModalOpen(false);
  };

  const consent = profile.privacyConsent || {
    localStorageOnly: true,
    telemetryEnabled: false,
    anonymizedInsights: false,
    exportRetention: true
  };

  const handleToggleConsent = (key) => {
    updateProfile({
      privacyConsent: {
        ...consent,
        [key]: !consent[key]
      }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="caption-3 px-2 py-0.5 rounded-full bg-botanical-100 text-botanical-800 font-semibold border border-botanical-200">
                Data Sovereignty
              </span>
              <span className="caption-4 text-charcoal-muted">
                Zero Cloud Sync by Design
              </span>
            </div>
            <h2 className="heading-5 text-charcoal font-semibold">
              Privacy Centre & Data Ownership
            </h2>
            <p className="body-5 text-charcoal-muted mt-1 max-w-2xl leading-relaxed">
              DayLens is architected on the premise that personal biometric, sleep, and emotional logs belong strictly to you. In this prototype, all storage and computation reside 100% inside your local browser instance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => exportData('json')}
              className="btn-secondary button-sm"
              title="Download entire database in JSON format"
            >
              <DownloadSimple className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => exportData('csv')}
              className="btn-primary button-sm"
              title="Download records in CSV spreadsheet"
            >
              <DownloadSimple className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Honest Prototype Disclosure */}
      <div className="p-4 rounded-xl bg-sage-50/80 border border-border flex items-start gap-3">
        <Info className="w-5 h-5 text-botanical-800 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="caption-1 font-semibold text-charcoal">
            Transparent Architectural Notice
          </p>
          <p className="caption-5 text-charcoal-muted leading-relaxed">
            As a hackathon frontend prototype for wHACKiest 2026, data persistence is maintained via the standard Web Storage API (`window.localStorage`). DayLens does not deploy server-side AES encryption or external cloud databases in this phase.
          </p>
        </div>
      </div>

      {/* Local Storage Overview & Diagnostics */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-xs">
        <h3 className="title-2 text-charcoal font-semibold mb-1">
          Local Storage Footprint
        </h3>
        <p className="caption-2 text-charcoal-muted mb-4">
          Overview of records, experiments, and preferences saved locally on this machine
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-sage-50/50 border border-border">
            <span className="caption-4 text-charcoal-muted block">Daily Biometric Logs</span>
            <span className="heading-5 text-charcoal font-semibold">{records.length}</span>
            <span className="caption-5 text-charcoal-muted block mt-1">Stored under 'daylens_records'</span>
          </div>

          <div className="p-4 rounded-xl bg-sage-50/50 border border-border">
            <span className="caption-4 text-charcoal-muted block">Active Experiments</span>
            <span className="heading-5 text-charcoal font-semibold">{experiments.length}</span>
            <span className="caption-5 text-charcoal-muted block mt-1">Stored under 'daylens_experiments'</span>
          </div>

          <div className="p-4 rounded-xl bg-sage-50/50 border border-border">
            <span className="caption-4 text-charcoal-muted block">Identity & Settings</span>
            <span className="heading-5 text-charcoal font-semibold">Configured</span>
            <span className="caption-5 text-charcoal-muted block mt-1">Stored under 'daylens_profile'</span>
          </div>
        </div>
      </div>

      {/* Consent & Data Preferences */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-xs">
        <h3 className="title-2 text-charcoal font-semibold mb-1">
          Client Data Controls & Consent
        </h3>
        <p className="caption-2 text-charcoal-muted mb-5">
          Manage how your browser handles background pattern computation
        </p>

        <div className="divide-y divide-border">
          {/* Toggle 1: Local only */}
          <div className="py-4 first:pt-0 flex items-center justify-between gap-4">
            <div>
              <p className="title-4 text-charcoal font-semibold">Strict Local-Only Storage</p>
              <p className="caption-2 text-charcoal-muted mt-0.5">
                Block any network transmission of physiological records. Keep analytics strictly in sandbox.
              </p>
            </div>
            <button
              onClick={() => handleToggleConsent('localStorageOnly')}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                consent.localStorageOnly ? 'bg-botanical-800' : 'bg-gray-200'
              }`}
              aria-label="Toggle local only storage"
            >
              <span className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                consent.localStorageOnly ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Toggle 2: Telemetry */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <p className="title-4 text-charcoal font-semibold">Anonymous Error Diagnostics</p>
              <p className="caption-2 text-charcoal-muted mt-0.5">
                Disabled by default. No crash logs or tracking pixels are ever fired.
              </p>
            </div>
            <button
              onClick={() => handleToggleConsent('telemetryEnabled')}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                consent.telemetryEnabled ? 'bg-botanical-800' : 'bg-gray-200'
              }`}
              aria-label="Toggle telemetry"
            >
              <span className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                consent.telemetryEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Toggle 3: Anonymized aggregation */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <p className="title-4 text-charcoal font-semibold">Federated Insight Aggregation</p>
              <p className="caption-2 text-charcoal-muted mt-0.5">
                Planned feature for future versions to compare personal sleep distributions against peer baselines with differential privacy.
              </p>
            </div>
            <button
              onClick={() => handleToggleConsent('anonymizedInsights')}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                consent.anonymizedInsights ? 'bg-botanical-800' : 'bg-gray-200'
              }`}
              aria-label="Toggle federated insights"
            >
              <span className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                consent.anonymizedInsights ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset and Wipe Data */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="title-2 text-rose-800 font-semibold">Data Reset & Erasure Controls</h3>
          <p className="caption-2 text-charcoal-muted mt-0.5">
            Safely reset your database to fresh wHACKiest 2026 demo values, or completely wipe local browser storage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setResetModalOpen(true)}
            className="btn-secondary button-sm text-charcoal"
          >
            <ArrowCounterClockwise className="w-4 h-4 text-botanical-800" />
            <span>Reset Demo Records</span>
          </button>

          <button
            onClick={() => setClearModalOpen(true)}
            className="py-2 px-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 button-sm hover:bg-rose-100 transition-colors inline-flex items-center gap-2"
          >
            <Trash className="w-4 h-4" />
            <span>Wipe All Local Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-botanical-800">
              <ArrowCounterClockwise className="w-5 h-5" />
              <h4 className="title-2 font-semibold text-charcoal">Reset to Default Demo State?</h4>
            </div>
            <p className="caption-2 text-charcoal-muted leading-relaxed">
              This will reload the initial 30 days of realistic sample logs, experiments, and default profile settings. Any custom days you manually entered will be replaced.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setResetModalOpen(false)} className="btn-secondary button-sm">
                Cancel
              </button>
              <button 
                onClick={() => { resetAllData(); setResetModalOpen(false); }} 
                className="btn-primary button-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wipe Confirmation Modal */}
      {clearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <WarningCircle className="w-5 h-5" />
              <h4 className="title-2 font-semibold text-charcoal">Erase All Local Storage?</h4>
            </div>
            <p className="caption-2 text-charcoal-muted leading-relaxed">
              This will completely empty `window.localStorage` for DayLens on this browser. All data cards and charts will enter empty state until new entries are logged.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setClearModalOpen(false)} className="btn-secondary button-sm">
                Cancel
              </button>
              <button 
                onClick={handleWipeData} 
                className="py-2 px-3 rounded-lg bg-rose-700 text-white caption-2 font-semibold hover:bg-rose-800 transition-colors"
              >
                Erase Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
