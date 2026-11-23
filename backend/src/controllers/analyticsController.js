import DailyRecord from '../models/DailyRecord.js';
import Insight from '../models/Insight.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  computeAggregates,
  calculatePearson,
  interpretCorrelation,
  discoverPatterns,
  detectAnomalies,
  calculateMean
} from '../services/analyticsService.js';

export const getOverview = asyncHandler(async (req, res) => {
  const records = await DailyRecord.find({ user: req.user._id }).sort({ date: 1 });

  if (records.length === 0) {
    return ApiResponse.success(res, {
      count: 0,
      aggregates: { avgSleep: 0, avgScreen: 0, avgSteps: 0, avgExercise: 0, avgMood: 0, avgFocus: 0 },
      recent7: { avgSleep: 0, avgScreen: 0, avgSteps: 0, avgExercise: 0, avgMood: 0, avgFocus: 0 },
      hasData: false
    });
  }

  const aggregates = computeAggregates(records);
  const recent7 = computeAggregates(records.slice(-7));

  return ApiResponse.success(res, {
    count: records.length,
    aggregates,
    recent7,
    latestRecord: records[records.length - 1],
    hasData: true
  });
});

export const getCorrelations = asyncHandler(async (req, res) => {
  const records = await DailyRecord.find({ user: req.user._id }).sort({ date: 1 });

  if (records.length < 3) {
    return ApiResponse.success(res, {
      matrix: {},
      patterns: [],
      message: 'Need at least 3 daily records to compute statistical correlations.'
    });
  }

  const sleep = records.map(r => r.sleepHours);
  const screen = records.map(r => r.screenTimeHours);
  const steps = records.map(r => r.steps);
  const exercise = records.map(r => r.exerciseDuration);
  const mood = records.map(r => r.mood);
  const focus = records.map(r => r.focus);

  const pairs = [
    { key: 'sleep_focus', x: sleep, y: focus, nameX: 'Sleep Duration', nameY: 'Focus Score' },
    { key: 'screen_focus', x: screen, y: focus, nameX: 'Screen Time', nameY: 'Focus Score' },
    { key: 'steps_mood', x: steps, y: mood, nameX: 'Steps', nameY: 'Mood Rating' },
    { key: 'exercise_sleep', x: exercise, y: sleep, nameX: 'Exercise Duration', nameY: 'Sleep Duration' },
    { key: 'sleep_mood', x: sleep, y: mood, nameX: 'Sleep Duration', nameY: 'Mood Rating' },
    { key: 'screen_sleep', x: screen, y: sleep, nameX: 'Screen Time', nameY: 'Sleep Duration' }
  ];

  const matrix = {};
  pairs.forEach(p => {
    const r = calculatePearson(p.x, p.y);
    const interp = interpretCorrelation(r);
    matrix[p.key] = {
      nameX: p.nameX,
      nameY: p.nameY,
      r,
      strength: interp.strength,
      direction: interp.direction,
      summary: interp.summary
    };
  });

  const patterns = discoverPatterns(records);

  return ApiResponse.success(res, { matrix, patterns });
});

export const getTrends = asyncHandler(async (req, res) => {
  const records = await DailyRecord.find({ user: req.user._id }).sort({ date: 1 });

  // Weekly moving averages
  const trends = records.map((rec, index) => {
    const windowStart = Math.max(0, index - 6);
    const windowSlice = records.slice(windowStart, index + 1);

    return {
      date: rec.date,
      sleep: rec.sleepHours,
      screenTime: rec.screenTimeHours,
      steps: rec.steps,
      focus: rec.focus,
      mood: rec.mood,
      sleep7dAvg: Number(calculateMean(windowSlice.map(r => r.sleepHours)).toFixed(2)),
      screen7dAvg: Number(calculateMean(windowSlice.map(r => r.screenTimeHours)).toFixed(2)),
      focus7dAvg: Number(calculateMean(windowSlice.map(r => r.focus)).toFixed(2))
    };
  });

  return ApiResponse.success(res, trends);
});

export const getAnomalies = asyncHandler(async (req, res) => {
  const records = await DailyRecord.find({ user: req.user._id }).sort({ date: 1 });
  const anomalies = detectAnomalies(records);
  return ApiResponse.success(res, anomalies);
});

export const getInsights = asyncHandler(async (req, res) => {
  const records = await DailyRecord.find({ user: req.user._id }).sort({ date: 1 });
  const patterns = discoverPatterns(records);
  const anomalies = detectAnomalies(records);

  const generatedInsights = patterns.map(p => ({
    type: 'correlation',
    title: p.title,
    description: p.explanation,
    metric: p.metric,
    correlationValue: p.r,
    strength: p.strength,
    direction: p.direction,
    actionableAdvice: p.r > 0 
      ? `Prioritize maintaining positive baseline in ${p.title.split(' ')[0]}.` 
      : `Consider dialing back high levels on stressful days.`
  }));

  // Store in MongoDB Insight collection if any
  return ApiResponse.success(res, {
    insights: generatedInsights,
    anomalyCount: anomalies.length,
    recentAnomalies: anomalies.slice(0, 3)
  });
});
