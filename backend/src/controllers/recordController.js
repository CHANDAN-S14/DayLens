import DailyRecord from '../models/DailyRecord.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateCsvRecords } from '../services/exportService.js';

export const getRecords = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { range, startDate, endDate, limit } = req.query;

  const query = { user: userId };

  if (startDate && endDate) {
    query.date = { $gte: startDate, $lte: endDate };
  } else if (startDate) {
    query.date = { $gte: startDate };
  } else if (endDate) {
    query.date = { $lte: endDate };
  }

  let recordQuery = DailyRecord.find(query).sort({ date: 1 });

  let records = await recordQuery;

  if (range === '7d') {
    records = records.slice(-7);
  } else if (range === '30d') {
    records = records.slice(-30);
  } else if (limit) {
    records = records.slice(-parseInt(limit, 10));
  }

  return ApiResponse.success(res, records, 'Records retrieved successfully');
});

export const getRecordById = asyncHandler(async (req, res) => {
  const record = await DailyRecord.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!record) {
    return ApiResponse.error(res, 'Record not found', 404);
  }

  return ApiResponse.success(res, record);
});

export const createOrUpdateRecord = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { date, sleepHours, screenTimeHours, steps, exerciseDuration, mood, focus, notes } = req.body;

  const record = await DailyRecord.findOneAndUpdate(
    { user: userId, date },
    {
      user: userId,
      date,
      sleepHours: Number(sleepHours) || 0,
      screenTimeHours: Number(screenTimeHours) || 0,
      steps: Number(steps) || 0,
      exerciseDuration: Number(exerciseDuration) || 0,
      mood: Number(mood) || 7,
      focus: Number(focus) || 7,
      notes: notes || ''
    },
    { new: true, upsert: true, runValidators: true }
  );

  return ApiResponse.success(res, record, 'Daily record saved successfully');
});

export const updateRecord = asyncHandler(async (req, res) => {
  const record = await DailyRecord.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!record) {
    return ApiResponse.error(res, 'Record not found', 404);
  }

  return ApiResponse.success(res, record, 'Record updated successfully');
});

export const deleteRecord = asyncHandler(async (req, res) => {
  const record = await DailyRecord.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!record) {
    return ApiResponse.error(res, 'Record not found', 404);
  }

  return ApiResponse.success(res, null, 'Record deleted successfully');
});

export const importCsv = asyncHandler(async (req, res) => {
  let csvText = '';

  if (req.file) {
    csvText = req.file.buffer.toString('utf-8');
  } else if (req.body.csvText) {
    csvText = req.body.csvText;
  } else {
    return ApiResponse.error(res, 'Please provide csvText or upload a CSV file', 400);
  }

  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) {
    return ApiResponse.error(res, 'CSV is empty or missing headers', 400);
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  const dateIdx = headers.indexOf('date');
  const sleepIdx = headers.indexOf('sleephours') !== -1 ? headers.indexOf('sleephours') : headers.indexOf('sleep');
  const screenIdx = headers.indexOf('screentimehours') !== -1 ? headers.indexOf('screentimehours') : headers.indexOf('screen');
  const stepsIdx = headers.indexOf('steps');
  const exerciseIdx = headers.indexOf('exerciseduration') !== -1 ? headers.indexOf('exerciseduration') : headers.indexOf('exercise');
  const moodIdx = headers.indexOf('mood');
  const focusIdx = headers.indexOf('focus');
  const notesIdx = headers.indexOf('notes');

  if (dateIdx === -1) {
    return ApiResponse.error(res, "CSV must contain a 'date' column in YYYY-MM-DD format", 400);
  }

  const operations = [];
  let parseErrors = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    const dateVal = cols[dateIdx];
    if (!dateVal || isNaN(Date.parse(dateVal))) {
      parseErrors++;
      continue;
    }

    const doc = {
      user: req.user._id,
      date: dateVal,
      sleepHours: sleepIdx !== -1 && cols[sleepIdx] ? parseFloat(cols[sleepIdx]) || 7.0 : 7.0,
      screenTimeHours: screenIdx !== -1 && cols[screenIdx] ? parseFloat(cols[screenIdx]) || 4.0 : 4.0,
      steps: stepsIdx !== -1 && cols[stepsIdx] ? parseInt(cols[stepsIdx], 10) || 7500 : 7500,
      exerciseDuration: exerciseIdx !== -1 && cols[exerciseIdx] ? parseInt(cols[exerciseIdx], 10) || 20 : 20,
      mood: moodIdx !== -1 && cols[moodIdx] ? parseFloat(cols[moodIdx]) || 7 : 7,
      focus: focusIdx !== -1 && cols[focusIdx] ? parseFloat(cols[focusIdx]) || 7 : 7,
      notes: notesIdx !== -1 && cols[notesIdx] ? cols[notesIdx] : 'Imported from CSV'
    };

    operations.push({
      updateOne: {
        filter: { user: req.user._id, date: dateVal },
        update: { $set: doc },
        upsert: true
      }
    });
  }

  if (operations.length === 0) {
    return ApiResponse.error(res, 'No valid daily records parsed from CSV', 400);
  }

  const result = await DailyRecord.bulkWrite(operations);

  return ApiResponse.success(res, {
    totalParsed: operations.length,
    upsertedCount: result.upsertedCount,
    modifiedCount: result.modifiedCount,
    parseErrors
  }, `Successfully imported ${operations.length} records`);
});

export const exportRecords = asyncHandler(async (req, res) => {
  const { format = 'json' } = req.query;
  const records = await DailyRecord.find({ user: req.user._id }).sort({ date: 1 });

  if (format === 'csv') {
    const csvData = generateCsvRecords(records);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=daylens-records-${new Date().toISOString().slice(0, 10)}.csv`);
    return res.status(200).send(csvData);
  }

  return ApiResponse.success(res, records, 'Records exported successfully');
});
