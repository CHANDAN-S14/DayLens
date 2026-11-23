import React, { useState } from 'react';
import { PencilSimple, Trash, MagnifyingGlass, Funnel, Calendar, CaretLeft, CaretRight, WarningCircle } from '@phosphor-icons/react';

export default function RecordsTable({ records = [], onEdit, onDelete }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const itemsPerPage = 8;

  // Filter records based on search
  const filtered = records.filter(r => {
    const q = searchQuery.toLowerCase();
    return r.date.toLowerCase().includes(q) || (r.notes && r.notes.toLowerCase().includes(q));
  }).reverse(); // Most recent first

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecords = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="bg-white border border-border rounded-2xl shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="title-2 text-charcoal font-semibold">Logged Daily Records</h3>
          <p className="caption-2 text-charcoal-muted">
            {records.length} records currently stored in your browser LocalStorage
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <MagnifyingGlass className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dates or notes..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-white text-charcoal caption-2 focus:outline-none focus:ring-2 focus:ring-botanical-600"
          />
        </div>
      </div>

      {/* Delete confirmation banner if active */}
      {deleteConfirmId && (
        <div className="p-4 bg-rose-50 border-b border-rose-200 flex items-center justify-between gap-3 text-rose-900 animate-fade-in">
          <div className="flex items-center gap-2">
            <WarningCircle className="w-5 h-5 text-rose-700 flex-shrink-0" />
            <span className="caption-1 font-semibold">
              Delete entry for {records.find(r => r.id === deleteConfirmId)?.date}?
            </span>
            <span className="caption-4 text-rose-700 hidden sm:inline">This will recalculate all pattern metrics.</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="py-1 px-2.5 rounded-md text-charcoal bg-white border border-border caption-4 font-semibold hover:bg-sage-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteConfirmId)}
              className="py-1 px-2.5 rounded-md text-white bg-rose-700 caption-4 font-semibold hover:bg-rose-800"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sage-50/60 border-b border-border caption-3 text-charcoal-muted">
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Sleep</th>
              <th className="py-3 px-4 font-semibold">Screen Time</th>
              <th className="py-3 px-4 font-semibold">Movement</th>
              <th className="py-3 px-4 font-semibold">Mood</th>
              <th className="py-3 px-4 font-semibold">Focus</th>
              <th className="py-3 px-4 font-semibold">Reflection</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentRecords.length > 0 ? (
              currentRecords.map((r) => (
                <tr key={r.id} className="hover:bg-sage-50/40 transition-colors">
                  <td className="py-3 px-4 caption-1 font-semibold text-charcoal whitespace-nowrap">
                    {r.date}
                  </td>
                  <td className="py-3 px-4 caption-2 text-charcoal whitespace-nowrap">
                    <span className="font-semibold">{r.sleepHours}</span> hrs
                  </td>
                  <td className="py-3 px-4 caption-2 text-charcoal whitespace-nowrap">
                    <span className="font-semibold">{r.screenTimeHours}</span> hrs
                  </td>
                  <td className="py-3 px-4 caption-2 text-charcoal whitespace-nowrap">
                    <span>{r.steps?.toLocaleString()}</span> steps
                    {r.exerciseDuration > 0 && (
                      <span className="text-charcoal-muted block caption-5">{r.exerciseDuration}m active</span>
                    )}
                  </td>
                  <td className="py-3 px-4 caption-2 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-sage-50 border border-border text-charcoal font-semibold caption-4">
                      {r.mood}/10
                    </span>
                  </td>
                  <td className="py-3 px-4 caption-2 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-botanical-50 border border-botanical-200 text-botanical-900 font-semibold caption-4">
                      {r.focus}/10
                    </span>
                  </td>
                  <td className="py-3 px-4 caption-2 text-charcoal-muted max-w-xs truncate" title={r.notes}>
                    {r.notes || "—"}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(r)}
                        className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-sage-100 transition-colors"
                        title="Edit entry"
                        aria-label="Edit entry"
                      >
                        <PencilSimple className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(r.id)}
                        className="p-1.5 rounded-lg text-charcoal-muted hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Delete entry"
                        aria-label="Delete entry"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-8 text-center text-charcoal-muted caption-2">
                  No matching daily records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between caption-3 text-charcoal-muted bg-white">
          <span>
            Page {currentPage} of {totalPages} ({filtered.length} total)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-lg border border-border ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-sage-50 text-charcoal'}`}
            >
              <CaretLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-lg border border-border ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-sage-50 text-charcoal'}`}
            >
              <CaretRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
