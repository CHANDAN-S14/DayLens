import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { calculatePearson, calculateMean } from '../../utils/analytics';
import { ChartLineUp, Info } from '@phosphor-icons/react';

const METRIC_OPTIONS = [
  { id: 'sleepHours', label: 'Sleep Duration (hrs)', domain: [4, 10], unit: 'hrs' },
  { id: 'focus', label: 'Daytime Focus (1-10)', domain: [1, 10], unit: '/10' },
  { id: 'screenTimeHours', label: 'Screen Time (hrs)', domain: [1, 10], unit: 'hrs' },
  { id: 'steps', label: 'Daily Steps', domain: [2000, 15000], unit: 'steps' },
  { id: 'mood', label: 'Mood Rating (1-10)', domain: [1, 10], unit: '/10' },
  { id: 'exerciseDuration', label: 'Exercise Duration (min)', domain: [0, 90], unit: 'min' }
];

export default function ScatterExplorer({ records = [] }) {
  const [xKey, setXKey] = useState('sleepHours');
  const [yKey, setYKey] = useState('focus');

  const xOption = METRIC_OPTIONS.find(o => o.id === xKey) || METRIC_OPTIONS[0];
  const yOption = METRIC_OPTIONS.find(o => o.id === yKey) || METRIC_OPTIONS[1];

  const scatterData = records.map(r => ({
    x: Number(r[xKey]) || 0,
    y: Number(r[yKey]) || 0,
    date: r.date,
    notes: r.notes
  }));

  const xVals = scatterData.map(d => d.x);
  const yVals = scatterData.map(d => d.y);
  const rValue = calculatePearson(xVals, yVals);

  const meanX = calculateMean(xVals);
  const meanY = calculateMean(yVals);

  const CustomScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pt = payload[0].payload;
      return (
        <div className="bg-white border border-border p-3 rounded-xl shadow-md caption-3">
          <p className="caption-2 font-medium text-charcoal-muted mb-1">{pt.date}</p>
          <div className="space-y-0.5 text-charcoal">
            <p><span className="text-charcoal-muted">{xOption.label}:</span> <span className="font-semibold">{pt.x}</span></p>
            <p><span className="text-charcoal-muted">{yOption.label}:</span> <span className="font-semibold">{pt.y}</span></p>
          </div>
          {pt.notes && <p className="caption-5 text-charcoal-muted mt-1 max-w-xs truncate italic">"{pt.notes}"</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-botanical-800 text-white">
              <ChartLineUp className="w-4 h-4" />
            </div>
            <h3 className="title-2 text-charcoal font-semibold">Bivariate Pattern Explorer</h3>
          </div>
          <p className="caption-2 text-charcoal-muted mt-0.5">
            Cross-examine any two biometric or behavioral variables from your database
          </p>
        </div>

        {/* Metric Pair Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="caption-4 text-charcoal-muted">X Axis:</span>
            <select
              value={xKey}
              onChange={(e) => setXKey(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-border bg-white text-charcoal caption-2 focus:ring-2 focus:ring-botanical-600 focus:outline-none"
            >
              {METRIC_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id} disabled={opt.id === yKey}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="caption-4 text-charcoal-muted">Y Axis:</span>
            <select
              value={yKey}
              onChange={(e) => setYKey(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-border bg-white text-charcoal caption-2 focus:ring-2 focus:ring-botanical-600 focus:outline-none"
            >
              {METRIC_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id} disabled={opt.id === xKey}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistical Coefficient Banner */}
      <div className="mt-4 p-3.5 rounded-xl bg-sage-50/60 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="caption-2 text-charcoal font-medium">Computed Correlation:</span>
          <span className={`caption-1 font-bold px-2 py-0.5 rounded ${
            Math.abs(rValue) >= 0.5 
              ? 'bg-botanical-100 text-botanical-900 border border-botanical-200' 
              : 'bg-white text-charcoal border border-border'
          }`}>
            r = {rValue > 0 ? `+${rValue}` : rValue}
          </span>
          <span className="caption-4 text-charcoal-muted">
            ({Math.abs(rValue) >= 0.6 ? 'Strong relationship' : Math.abs(rValue) >= 0.35 ? 'Moderate relationship' : 'Weak or neutral tendency'})
          </span>
        </div>

        <div className="caption-4 text-charcoal-muted">
          Sample: {scatterData.length} records • Means: X̄={meanX.toFixed(1)}, Ȳ={meanY.toFixed(1)}
        </div>
      </div>

      {/* Scatter Chart Canvas */}
      <div className="h-72 mt-5">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EAECEE" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name={xOption.label} 
              domain={xOption.domain} 
              unit={` ${xOption.unit}`}
              tick={{ fill: '#62676D', fontSize: 12 }}
              axisLine={{ stroke: '#E4E7EC' }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name={yOption.label} 
              domain={yOption.domain} 
              unit={` ${yOption.unit}`}
              tick={{ fill: '#62676D', fontSize: 12 }}
              axisLine={{ stroke: '#E4E7EC' }}
            />
            <Tooltip content={<CustomScatterTooltip />} />
            <Scatter 
              name="Daily Entry" 
              data={scatterData} 
              fill="#1B4332" 
              shape="circle" 
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 mt-2 border-t border-border flex items-start gap-2 caption-5 text-charcoal-muted">
        <Info className="w-4 h-4 text-botanical-700 flex-shrink-0 mt-0.5" />
        <span>
          Each dot represents one logged 24-hour cycle. Scatter plots allow visual inspection of clusters and outliers without assuming linearity.
        </span>
      </div>
    </div>
  );
}
