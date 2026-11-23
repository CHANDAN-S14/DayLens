import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UploadSimple, FileCsv, CheckCircle, WarningCircle, DownloadSimple } from '@phosphor-icons/react';

export default function CsvImportModal({ isOpen, onClose }) {
  const { importRecordsFromCsv } = useApp();
  const fileInputRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [status, setStatus] = useState({ type: null, message: '' });

  if (!isOpen) return null;

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.endsWith('.csv') && selectedFile.type !== 'text/csv') {
      setStatus({ type: 'error', message: 'Please select a valid .csv file format.' });
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
      setStatus({ type: null, message: '' });
    };
    reader.readAsText(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleImport = () => {
    if (!fileContent) {
      setStatus({ type: 'error', message: 'No CSV content loaded to import.' });
      return;
    }

    const result = importRecordsFromCsv(fileContent);
    if (result.success) {
      setStatus({
        type: 'success',
        message: `Successfully imported ${result.count} daily records into your local storage.`
      });
      setTimeout(() => {
        onClose();
      }, 1800);
    } else {
      setStatus({
        type: 'error',
        message: result.error || 'Failed to process CSV file structure.'
      });
    }
  };

  const downloadSampleCsv = () => {
    const sample = `date,sleepHours,screenTimeHours,steps,exerciseDuration,mood,focus,notes
2026-11-24,8.1,3.4,10200,40,8.5,8.8,"Morning sunlight walk and focused coding sprints"
2026-11-25,7.6,4.0,8900,30,8.0,8.1,"Solid work day, took 20-min break between meetings"
2026-11-26,7.9,3.7,9400,35,8.0,8.4,"Good restorative recovery and evening reading"`;

    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daylens-sample-import.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 border-b border-border bg-sage-50/50">
          <div>
            <h3 className="title-1 text-charcoal">Import Data via CSV</h3>
            <p className="caption-2 text-charcoal-muted mt-0.5">
              Client-side local parsing. Your data never leaves your browser.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-sage-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ease-skill-base ${
              dragActive 
                ? 'border-botanical-600 bg-sage-50' 
                : 'border-border hover:border-botanical-500 hover:bg-sage-50/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => handleFile(e.target.files[0])}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-xl bg-sage-100 text-botanical-800 flex items-center justify-center mx-auto mb-3">
              <UploadSimple className="w-6 h-6" />
            </div>
            <p className="title-4 text-charcoal font-semibold">
              {file ? file.name : "Click to browse or drop CSV file here"}
            </p>
            <p className="caption-2 text-charcoal-muted mt-1">
              Supports columns: date, sleepHours, screenTimeHours, steps, mood, focus
            </p>
          </div>

          {/* Sample template link */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-sage-50/50 border border-border">
            <div className="flex items-center gap-2">
              <FileCsv className="w-5 h-5 text-botanical-700" />
              <span className="caption-2 text-charcoal">Need a reference template?</span>
            </div>
            <button
              onClick={downloadSampleCsv}
              className="caption-3 font-semibold text-botanical-800 hover:text-botanical-700 inline-flex items-center gap-1"
            >
              <DownloadSimple className="w-3.5 h-3.5" />
              <span>Download sample CSV</span>
            </button>
          </div>

          {/* Status feedback */}
          {status.type === 'error' && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 caption-2">
              <WarningCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{status.message}</span>
            </div>
          )}

          {status.type === 'success' && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 caption-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{status.message}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-sage-50/30">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary button-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!fileContent}
            className={`btn-primary button-sm ${!fileContent ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Import to Local Storage
          </button>
        </div>
      </div>
    </div>
  );
}
