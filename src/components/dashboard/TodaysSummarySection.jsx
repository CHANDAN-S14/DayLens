import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Flame, 
  Lightning, 
  Moon, 
  Sparkle,
  TrendUp,
  CalendarCheck
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export default function TodaysSummarySection({ records = [], onOpenAddModal }) {
  const latestRecord = records[records.length - 1] || null;
  const recentRecords = records.slice(-4).reverse();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Today's Summary & Recommended Action */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-xs lg:col-span-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="title-2 text-charcoal font-semibold">Today's Rhythm</h3>
            <span className="caption-4 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              Active Routine
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-sage-50/50 border border-border">
              <span className="caption-2 text-charcoal-muted">Wake time regularity</span>
              <span className="caption-1 font-semibold text-charcoal">06:45 AM (Optimal)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-sage-50/50 border border-border">
              <span className="caption-2 text-charcoal-muted">Focus block completed</span>
              <span className="caption-1 font-semibold text-charcoal">2h 45m deep flow</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-sage-50/50 border border-border">
              <span className="caption-2 text-charcoal-muted">Daylight exposure</span>
              <span className="caption-1 font-semibold text-charcoal">35m outdoors</span>
            </div>
          </div>

          {/* Recommended Next Action */}
          <div className="mt-5 p-4 rounded-xl bg-botanical-50 border border-botanical-200">
            <div className="flex items-center gap-2 mb-1">
              <Sparkle weight="fill" className="w-4 h-4 text-botanical-800" />
              <span className="caption-3 font-semibold text-botanical-900">Recommended Next Action</span>
            </div>
            <p className="caption-2 text-botanical-800">
              Wind down screens 45 minutes prior to sleep tonight to preserve your restorative deep sleep window.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-border">
          <button
            onClick={onOpenAddModal}
            className="w-full btn-secondary button-sm"
          >
            <CalendarCheck className="w-4 h-4 text-botanical-800" />
            <span>Update Today's Metrics</span>
          </button>
        </div>
      </div>

      {/* 2. Recent Activity Log */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-xs lg:col-span-2 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="title-2 text-charcoal font-semibold">Recent Daily Entries</h3>
              <p className="caption-2 text-charcoal-muted">Recent entries stored in local browser state</p>
            </div>
            <Link
              to="/data"
              className="inline-flex items-center gap-1 caption-1 text-botanical-800 font-semibold hover:text-botanical-700"
            >
              <span>Manage all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-border">
            {recentRecords.map((rec) => (
              <div key={rec.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="caption-1 font-semibold text-charcoal">{rec.date}</span>
                    <span className="caption-4 px-1.5 py-0.2 rounded bg-sage-50 text-charcoal-muted border border-border">
                      {rec.sleepHours}h sleep
                    </span>
                    <span className="caption-4 px-1.5 py-0.2 rounded bg-sage-50 text-charcoal-muted border border-border">
                      {rec.screenTimeHours}h screen
                    </span>
                  </div>
                  <p className="caption-5 text-charcoal-muted truncate mt-0.5 max-w-md">
                    {rec.notes || "Standard daily tracking record"}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="caption-3 font-semibold text-charcoal">
                    Focus: <span className="text-botanical-800 font-bold">{rec.focus}</span>/10
                  </div>
                  <div className="caption-5 text-charcoal-muted">
                    {rec.steps?.toLocaleString()} steps
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Progress Banner */}
        <div className="mt-5 p-4 rounded-xl bg-sage-50/70 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-botanical-800 text-white flex items-center justify-center flex-shrink-0">
              <TrendUp className="w-4 h-4" weight="bold" />
            </div>
            <div>
              <p className="caption-1 font-semibold text-charcoal">Weekly Consistency Index: 92%</p>
              <p className="caption-5 text-charcoal-muted">You have recorded 7 of 7 days this week without missing logs.</p>
            </div>
          </div>
          <Link to="/experiments" className="caption-3 text-botanical-800 font-semibold hover:underline">
            View active experiments →
          </Link>
        </div>
      </div>
    </div>
  );
}
