import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Moon, 
  Monitor, 
  Footprints, 
  Heart, 
  Brain, 
  Plus, 
  Sparkle, 
  Info,
  CalendarCheck,
  ShieldCheck,
  ArrowRight
} from '@phosphor-icons/react';
import MetricCard from '../components/dashboard/MetricCard';
import OverviewCharts from '../components/dashboard/OverviewCharts';
import PersonalInsightsSection from '../components/dashboard/PersonalInsightsSection';
import TodaysSummarySection from '../components/dashboard/TodaysSummarySection';
import TaglineReveal from '../components/common/TaglineReveal';
import DemoBadge from '../components/common/DemoBadge';
import { getMetricAggregates } from '../utils/analytics';

export default function Overview() {
  const { records, profile, experiments } = useApp();
  const { openAddModal } = useOutletContext();

  const aggregates = getMetricAggregates(records);
  const latestRecord = records[records.length - 1] || {};

  const activeExperimentsCount = experiments.filter(e => e.status === 'active').length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Top Section Greeting & Actions */}
      <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="caption-3 px-2 py-0.5 rounded-full bg-botanical-100 text-botanical-800 font-semibold border border-botanical-200">
                Track 3: Know Thyself
              </span>
              <DemoBadge />
            </div>

            <h2 className="heading-4 text-charcoal font-semibold tracking-tight">
              Good morning, {profile.name.split(" ")[0]}
            </h2>

            <p className="body-5 text-charcoal-muted max-w-2xl leading-relaxed">
              Your focus stability has been higher over the last 3 days following consistent 7.8h+ sleep. You have {activeExperimentsCount} active habit experiment running in your lab.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={openAddModal}
              className="btn-primary button-md"
            >
              <Plus className="w-4 h-4" weight="bold" />
              <span>Add Daily Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main 5 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Sleep Duration"
          value={latestRecord.sleepHours ? `${latestRecord.sleepHours}` : `${aggregates.avgSleep}`}
          unit="hours"
          comparisonLabel="+0.4h vs baseline"
          comparisonType="positive"
          icon={Moon}
          subtitle="Target: 8.0h optimal"
        />

        <MetricCard
          title="Daily Screen Time"
          value={latestRecord.screenTimeHours ? `${latestRecord.screenTimeHours}` : `${aggregates.avgScreen}`}
          unit="hours"
          comparisonLabel="-0.8h reduction"
          comparisonType="positive"
          icon={Monitor}
          subtitle="Limit: 4.5h target"
        />

        <MetricCard
          title="Physical Movement"
          value={latestRecord.steps ? latestRecord.steps.toLocaleString() : aggregates.avgSteps.toLocaleString()}
          unit="steps"
          comparisonLabel="+12% daily goal"
          comparisonType="positive"
          icon={Footprints}
          subtitle="Goal: 9,000 steps"
        />

        <MetricCard
          title="Daily Mood Tone"
          value={latestRecord.mood ? `${latestRecord.mood}/10` : `${aggregates.avgMood}/10`}
          comparisonLabel="Resilient"
          comparisonType="positive"
          icon={Heart}
          subtitle="Self-reported tone"
        />

        <MetricCard
          title="Cognitive Focus"
          value={latestRecord.focus ? `${latestRecord.focus}/10` : `${aggregates.avgFocus}/10`}
          comparisonLabel="Deep flow"
          comparisonType="positive"
          icon={Brain}
          subtitle="Sustained clarity"
        />
      </div>

      {/* 3. Recharts Visualizations */}
      <OverviewCharts records={records} />

      {/* 4. Your Personal Insights (Observed Patterns) */}
      <PersonalInsightsSection records={records} />

      {/* 5. Today's Summary & Recent Activity */}
      <TodaysSummarySection records={records} onOpenAddModal={openAddModal} />

      {/* 6. SKILL.md B11: Mandatory Tagline Reveal Section */}
      <div className="pt-4 pb-2">
        <TaglineReveal
          text="Your life, understood through your daily patterns. Discover what fuels your focus, calm, and restorative sleep."
        />
      </div>
    </div>
  );
}
