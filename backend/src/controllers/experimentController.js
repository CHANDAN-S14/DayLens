import Experiment from '../models/Experiment.js';
import DailyRecord from '../models/DailyRecord.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { calculateMean } from '../services/analyticsService.js';

export const getExperiments = asyncHandler(async (req, res) => {
  const experiments = await Experiment.find({ user: req.user._id }).sort({ createdAt: -1 });
  return ApiResponse.success(res, experiments);
});

export const getExperimentById = asyncHandler(async (req, res) => {
  const experiment = await Experiment.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!experiment) {
    return ApiResponse.error(res, 'Experiment not found', 404);
  }

  return ApiResponse.success(res, experiment);
});

export const createExperiment = asyncHandler(async (req, res) => {
  const { title, objective, durationDays = 14, baseline, target, startDate, notes } = req.body;

  const experiment = await Experiment.create({
    user: req.user._id,
    title,
    objective,
    durationDays: Number(durationDays),
    currentDay: 1,
    baseline: baseline || '',
    target: target || '',
    startDate: startDate || new Date().toISOString().slice(0, 10),
    status: 'active',
    completedDays: [],
    notes: notes || ''
  });

  return ApiResponse.created(res, experiment, 'Experiment created successfully');
});

export const updateExperiment = asyncHandler(async (req, res) => {
  const experiment = await Experiment.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!experiment) {
    return ApiResponse.error(res, 'Experiment not found', 404);
  }

  return ApiResponse.success(res, experiment, 'Experiment updated successfully');
});

export const deleteExperiment = asyncHandler(async (req, res) => {
  const experiment = await Experiment.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!experiment) {
    return ApiResponse.error(res, 'Experiment not found', 404);
  }

  return ApiResponse.success(res, null, 'Experiment deleted successfully');
});

export const toggleDay = asyncHandler(async (req, res) => {
  const { date } = req.body;
  if (!date) {
    return ApiResponse.error(res, 'Date string (YYYY-MM-DD) is required to toggle day', 400);
  }

  const experiment = await Experiment.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!experiment) {
    return ApiResponse.error(res, 'Experiment not found', 404);
  }

  const completed = experiment.completedDays || [];
  const exists = completed.includes(date);

  const updatedCompletedDays = exists
    ? completed.filter(d => d !== date)
    : [...completed, date];

  experiment.completedDays = updatedCompletedDays;
  experiment.currentDay = Math.min(
    experiment.durationDays,
    Math.max(experiment.currentDay, updatedCompletedDays.length)
  );

  await experiment.save();

  return ApiResponse.success(res, experiment, `Toggled check-in for ${date}`);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['active', 'paused', 'completed'].includes(status)) {
    return ApiResponse.error(res, 'Status must be active, paused, or completed', 400);
  }

  const experiment = await Experiment.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { status },
    { new: true }
  );

  if (!experiment) {
    return ApiResponse.error(res, 'Experiment not found', 404);
  }

  return ApiResponse.success(res, experiment, `Status changed to ${status}`);
});

export const getComparison = asyncHandler(async (req, res) => {
  const experiment = await Experiment.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!experiment) {
    return ApiResponse.error(res, 'Experiment not found', 404);
  }

  const allRecords = await DailyRecord.find({ user: req.user._id }).sort({ date: 1 });

  // Separate records before experiment start date vs during/completed days
  const preRecords = allRecords.filter(r => r.date < experiment.startDate);
  const activeRecords = allRecords.filter(r => 
    r.date >= experiment.startDate && (experiment.completedDays.includes(r.date) || experiment.status === 'completed')
  );

  const preStats = {
    count: preRecords.length,
    avgSleep: Number(calculateMean(preRecords.map(r => r.sleepHours)).toFixed(1)),
    avgScreen: Number(calculateMean(preRecords.map(r => r.screenTimeHours)).toFixed(1)),
    avgSteps: Math.round(calculateMean(preRecords.map(r => r.steps))),
    avgMood: Number(calculateMean(preRecords.map(r => r.mood)).toFixed(1)),
    avgFocus: Number(calculateMean(preRecords.map(r => r.focus)).toFixed(1))
  };

  const activeStats = {
    count: activeRecords.length,
    avgSleep: Number(calculateMean(activeRecords.map(r => r.sleepHours)).toFixed(1)),
    avgScreen: Number(calculateMean(activeRecords.map(r => r.screenTimeHours)).toFixed(1)),
    avgSteps: Math.round(calculateMean(activeRecords.map(r => r.steps))),
    avgMood: Number(calculateMean(activeRecords.map(r => r.mood)).toFixed(1)),
    avgFocus: Number(calculateMean(activeRecords.map(r => r.focus)).toFixed(1))
  };

  const delta = {
    sleepDiff: Number((activeStats.avgSleep - preStats.avgSleep).toFixed(1)),
    screenDiff: Number((activeStats.avgScreen - preStats.avgScreen).toFixed(1)),
    stepsDiff: activeStats.avgSteps - preStats.avgSteps,
    moodDiff: Number((activeStats.avgMood - preStats.avgMood).toFixed(1)),
    focusDiff: Number((activeStats.avgFocus - preStats.avgFocus).toFixed(1))
  };

  return ApiResponse.success(res, {
    experiment,
    baseline: preStats,
    duringExperiment: activeStats,
    delta,
    evaluatedDays: activeRecords.length
  });
});
