import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { Moon, Monitor, Brain, Footprints } from '@phosphor-icons/react';

export default function OverviewCharts({ records = [] }) {
  const [activeTab, setActiveTab] = useState('sleep');

  // Format records for Recharts
  const chartData = records.slice(-14).map(r => ({
    date: r.date.slice(5), // "MM-DD"
    fullDate: r.date,
    sleep: r.sleepHours,
    screen: r.screenTimeHours,
    focus: r.focus,
    steps: r.steps,
    exercise: r.exerciseDuration,
    mood: r.mood
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-border p-3 rounded-xl shadow-md caption-3">
          <p className="caption-2 text-charcoal-muted font-medium mb-1.5">{data.fullDate}</p>
          {payload.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 py-0.5">
              <span className="text-charcoal-muted capitalize">{item.name}:</span>
              <span className="font-semibold text-charcoal">
                {item.value} {item.unit || ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-xs">
      {/* Header and Chart Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <h3 className="title-2 text-charcoal font-semibold">14-Day Biometric & Habit Trends</h3>
          <p className="caption-2 text-charcoal-muted mt-0.5">
            Compare daily routines with recorded focus and restorative recovery
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-sage-50 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab('sleep')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg caption-3 font-semibold transition-all duration-300 ease-skill-base ${
              activeTab === 'sleep'
                ? 'bg-white text-botanical-800 shadow-xs border border-border'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Sleep</span>
          </button>

          <button
            onClick={() => setActiveTab('focus')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg caption-3 font-semibold transition-all duration-300 ease-skill-base ${
              activeTab === 'focus'
                ? 'bg-white text-botanical-800 shadow-xs border border-border'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Focus</span>
          </button>

          <button
            onClick={() => setActiveTab('screen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg caption-3 font-semibold transition-all duration-300 ease-skill-base ${
              activeTab === 'screen'
                ? 'bg-white text-botanical-800 shadow-xs border border-border'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Screen</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg caption-3 font-semibold transition-all duration-300 ease-skill-base ${
              activeTab === 'activity'
                ? 'bg-white text-botanical-800 shadow-xs border border-border'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>Steps</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 mt-6">
        {activeTab === 'sleep' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B4332" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1B4332" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAECEE" />
              <XAxis dataKey="date" tick={{ fill: '#62676D', fontSize: 12 }} axisLine={{ stroke: '#E4E7EC' }} />
              <YAxis domain={[4, 10]} tick={{ fill: '#62676D', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={8.0} stroke="#749682" strokeDasharray="4 4" label={{ value: 'Target: 8.0h', fill: '#468963', fontSize: 11, position: 'insideTopRight' }} />
              <Area type="monotone" dataKey="sleep" name="Sleep Duration" unit="hours" stroke="#1B4332" strokeWidth={2.5} fillOpacity={1} fill="url(#sleepGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'focus' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2F6E4C" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2F6E4C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAECEE" />
              <XAxis dataKey="date" tick={{ fill: '#62676D', fontSize: 12 }} axisLine={{ stroke: '#E4E7EC' }} />
              <YAxis domain={[1, 10]} tick={{ fill: '#62676D', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={8.0} stroke="#749682" strokeDasharray="4 4" label={{ value: 'Target: 8.0/10', fill: '#468963', fontSize: 11, position: 'insideTopRight' }} />
              <Area type="monotone" dataKey="focus" name="Clarity & Focus" unit="/10" stroke="#2F6E4C" strokeWidth={2.5} fillOpacity={1} fill="url(#focusGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'screen' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAECEE" />
              <XAxis dataKey="date" tick={{ fill: '#62676D', fontSize: 12 }} axisLine={{ stroke: '#E4E7EC' }} />
              <YAxis domain={[0, 9]} tick={{ fill: '#62676D', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={4.5} stroke="#94B0A0" strokeDasharray="4 4" label={{ value: 'Daily Cap: 4.5h', fill: '#5C7A68', fontSize: 11, position: 'insideTopRight' }} />
              <Bar dataKey="screen" name="Screen Time" unit="hours" fill="#749682" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'activity' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAECEE" />
              <XAxis dataKey="date" tick={{ fill: '#62676D', fontSize: 12 }} axisLine={{ stroke: '#E4E7EC' }} />
              <YAxis tick={{ fill: '#62676D', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={9000} stroke="#2F6E4C" strokeDasharray="4 4" label={{ value: 'Goal: 9k Steps', fill: '#23553B', fontSize: 11, position: 'insideTopRight' }} />
              <Bar dataKey="steps" name="Daily Steps" unit="steps" fill="#468963" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
