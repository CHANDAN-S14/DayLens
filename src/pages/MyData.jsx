import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  UploadSimple, 
  DownloadSimple, 
  Database, 
  Info, 
  CheckCircle, 
  Clock,
  X
} from '@phosphor-icons/react';
import { DATA_CATEGORIES } from '../data/demoData';
import DataCategoryCard from '../components/data/DataCategoryCard';
import RecordsTable from '../components/data/RecordsTable';
import CsvImportModal from '../components/data/CsvImportModal';
import RecordModal from '../components/forms/RecordModal';

export default function MyData() {
  const { records, deleteRecord, exportData } = useApp();
  const { openAddModal } = useOutletContext();

  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header & Quick Actions */}
      <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="caption-3 px-2 py-0.5 rounded-full bg-botanical-100 text-botanical-800 font-semibold border border-botanical-200">
                Data Management
              </span>
              <span className="caption-4 text-charcoal-muted">
                {records.length} logged days
              </span>
            </div>
            <h2 className="heading-5 text-charcoal font-semibold">
              Personal Data Categories & Records
            </h2>
            <p className="body-5 text-charcoal-muted mt-1 max-w-2xl">
              Inspect input pipelines, upload local CSV tables, or manually log daily physiological and habit records. All entries are preserved in your browser's LocalStorage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCsvModalOpen(true)}
              className="btn-secondary button-sm"
              title="Upload CSV data"
            >
              <UploadSimple className="w-4 h-4" />
              <span>Import CSV</span>
            </button>

            <button
              onClick={() => exportData('csv')}
              className="btn-secondary button-sm"
              title="Download your records as CSV"
            >
              <DownloadSimple className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={openAddModal}
              className="btn-primary button-sm"
            >
              <Plus className="w-4 h-4" weight="bold" />
              <span>Log Today</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Data Categories Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="title-2 text-charcoal font-semibold">Tracked Pipelines & Status</h3>
          <span className="caption-3 text-charcoal-muted">
            Live hardware integrations marked as planned
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DATA_CATEGORIES.map((cat) => (
            <DataCategoryCard
              key={cat.id}
              category={cat}
              onSelect={setSelectedCategory}
            />
          ))}
        </div>
      </div>

      {/* 2. Interactive Records Table */}
      <RecordsTable
        records={records}
        onEdit={(rec) => setEditingRecord(rec)}
        onDelete={deleteRecord}
      />

      {/* Category Details Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="caption-3 px-2 py-0.5 rounded-full bg-sage-100 text-botanical-800 font-semibold border border-sage-200">
                  {selectedCategory.status}
                </span>
                <h3 className="title-1 text-charcoal font-semibold mt-2">
                  {selectedCategory.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-sage-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="body-6 text-charcoal-muted">
              {selectedCategory.description}
            </p>

            <div className="p-3 rounded-xl bg-sage-50/60 border border-border space-y-2 caption-2 text-charcoal">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Sync Architecture:</span>
                <span className="font-semibold">Local Browser Storage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Available records:</span>
                <span className="font-semibold">{records.length} days logged</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Last simulated refresh:</span>
                <span className="font-semibold">{selectedCategory.lastUpdated}</span>
              </div>
            </div>

            <p className="caption-5 text-charcoal-muted leading-relaxed">
              * Note: DayLens prototype does not initiate external network connections or simulated live watch battery drainage. All data reflects your local demo database.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className="w-full btn-secondary button-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      <CsvImportModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
      />

      {/* Edit Record Modal */}
      {editingRecord && (
        <RecordModal
          isOpen={!!editingRecord}
          initialData={editingRecord}
          onClose={() => setEditingRecord(null)}
        />
      )}
    </div>
  );
}
