import Consent from '../models/Consent.js';
import User from '../models/User.js';
import DailyRecord from '../models/DailyRecord.js';
import Experiment from '../models/Experiment.js';
import Chat from '../models/Chat.js';
import Insight from '../models/Insight.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateTakeoutJson } from '../services/exportService.js';

export const getConsent = asyncHandler(async (req, res) => {
  let consent = await Consent.findOne({ user: req.user._id });
  if (!consent) {
    consent = await Consent.create({ user: req.user._id });
  }
  return ApiResponse.success(res, consent);
});

export const updateConsent = asyncHandler(async (req, res) => {
  const { localStorageOnly, telemetryEnabled, anonymizedInsights, exportRetention } = req.body;

  let consent = await Consent.findOneAndUpdate(
    { user: req.user._id },
    {
      localStorageOnly: !!localStorageOnly,
      telemetryEnabled: !!telemetryEnabled,
      anonymizedInsights: !!anonymizedInsights,
      exportRetention: exportRetention !== undefined ? !!exportRetention : true
    },
    { new: true, upsert: true }
  );

  return ApiResponse.success(res, consent, 'Privacy preferences updated successfully');
});

export const exportAllData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [records, experiments, chats, consent] = await Promise.all([
    DailyRecord.find({ user: userId }).sort({ date: 1 }),
    Experiment.find({ user: userId }).sort({ createdAt: -1 }),
    Chat.find({ user: userId }).sort({ createdAt: 1 }),
    Consent.findOne({ user: userId })
  ]);

  const takeout = generateTakeoutJson({
    user: req.user,
    records,
    experiments,
    chats,
    consent
  });

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=daylens-takeout-${req.user._id}-${new Date().toISOString().slice(0, 10)}.json`);
  return res.status(200).send(takeout);
});

export const deleteAllData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Complete user data purge (GDPR Article 17 right to erasure compliance)
  await Promise.all([
    DailyRecord.deleteMany({ user: userId }),
    Experiment.deleteMany({ user: userId }),
    Chat.deleteMany({ user: userId }),
    Insight.deleteMany({ user: userId }),
    Consent.deleteMany({ user: userId }),
    User.findByIdAndDelete(userId)
  ]);

  return ApiResponse.success(res, null, 'All personal intelligence records and account have been permanently erased.');
});
