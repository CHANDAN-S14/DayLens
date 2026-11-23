import User from '../models/User.js';
import Consent from '../models/Consent.js';
import DailyRecord from '../models/DailyRecord.js';
import Experiment from '../models/Experiment.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Pre-packaged 30-day starter records for onboarding or demo account
const STARTER_RECORDS = [
  { date: "2026-10-25", sleepHours: 7.2, screenTimeHours: 4.8, steps: 7850, exerciseDuration: 25, mood: 7, focus: 6.8, notes: "Regular Sunday walk. Read a book in the afternoon." },
  { date: "2026-10-26", sleepHours: 6.4, screenTimeHours: 6.5, steps: 5400, exerciseDuration: 0, mood: 5, focus: 5.2, notes: "Late night deadline catch-up. Eye strain in the afternoon." },
  { date: "2026-10-27", sleepHours: 6.8, screenTimeHours: 5.9, steps: 6200, exerciseDuration: 15, mood: 6, focus: 6.0, notes: "Slightly tired in the morning, improved after short stretch." },
  { date: "2026-10-28", sleepHours: 7.6, screenTimeHours: 4.1, steps: 8900, exerciseDuration: 30, mood: 8, focus: 7.8, notes: "Went to bed earlier. Deep focus session before lunch." },
  { date: "2026-10-29", sleepHours: 7.8, screenTimeHours: 3.9, steps: 9400, exerciseDuration: 40, mood: 8, focus: 8.4, notes: "Good energy throughout the workday. Evening walk in park." },
  { date: "2026-10-30", sleepHours: 7.1, screenTimeHours: 4.6, steps: 8100, exerciseDuration: 20, mood: 7, focus: 7.2, notes: "Solid work output. Wrapped up week priorities on time." },
  { date: "2026-10-31", sleepHours: 8.2, screenTimeHours: 3.5, steps: 11200, exerciseDuration: 45, mood: 9, focus: 8.0, notes: "Weekend hike. Slept deeply without alarms." },
  { date: "2026-11-01", sleepHours: 7.9, screenTimeHours: 4.0, steps: 8600, exerciseDuration: 30, mood: 8, focus: 7.5, notes: "Relaxed Sunday. Meal prep and planning week ahead." },
  { date: "2026-11-02", sleepHours: 6.5, screenTimeHours: 6.2, steps: 5100, exerciseDuration: 0, mood: 5, focus: 5.5, notes: "Heavy meeting schedule. Felt restless around 3 PM." },
  { date: "2026-11-03", sleepHours: 7.0, screenTimeHours: 5.2, steps: 7400, exerciseDuration: 20, mood: 6, focus: 6.7, notes: "Stepped away from desk for lunch. Helped reset mental clarity." },
  { date: "2026-11-04", sleepHours: 7.5, screenTimeHours: 4.3, steps: 8800, exerciseDuration: 35, mood: 8, focus: 7.9, notes: "Consistent wake-up time. Work sprint completed before noon." },
  { date: "2026-11-05", sleepHours: 7.7, screenTimeHours: 4.0, steps: 9100, exerciseDuration: 30, mood: 8, focus: 8.1, notes: "Took active 5-minute microbreaks every 90 minutes." },
  { date: "2026-11-06", sleepHours: 7.2, screenTimeHours: 4.7, steps: 8300, exerciseDuration: 25, mood: 7, focus: 7.0, notes: "Friday wrap-up. Kept screen brightness dim in evening." },
  { date: "2026-11-07", sleepHours: 8.0, screenTimeHours: 3.8, steps: 10400, exerciseDuration: 40, mood: 9, focus: 7.8, notes: "Morning run with local club. Felt rested and clear." },
  { date: "2026-11-08", sleepHours: 7.4, screenTimeHours: 4.2, steps: 8200, exerciseDuration: 20, mood: 8, focus: 7.3, notes: "Early evening wind-down. Read fiction before sleep." },
  { date: "2026-11-09", sleepHours: 6.7, screenTimeHours: 5.8, steps: 6000, exerciseDuration: 10, mood: 6, focus: 6.1, notes: "Monday inbox backlog. Post-lunch slump noticed at 2 PM." },
  { date: "2026-11-10", sleepHours: 7.3, screenTimeHours: 4.5, steps: 8400, exerciseDuration: 25, mood: 7, focus: 7.4, notes: "Walked during 1:1 call. Mood visibly higher." },
  { date: "2026-11-11", sleepHours: 7.6, screenTimeHours: 4.1, steps: 8900, exerciseDuration: 30, mood: 8, focus: 7.9, notes: "Strong focus morning. Deep work on architecture design." },
  { date: "2026-11-12", sleepHours: 7.8, screenTimeHours: 3.7, steps: 9600, exerciseDuration: 40, mood: 8, focus: 8.5, notes: "Started 'Phone Away' experiment. Much easier to fall asleep." },
  { date: "2026-11-13", sleepHours: 7.9, screenTimeHours: 3.6, steps: 9200, exerciseDuration: 35, mood: 9, focus: 8.6, notes: "Experiment day 2. Woke up without grogginess." },
  { date: "2026-11-14", sleepHours: 8.1, screenTimeHours: 3.4, steps: 11000, exerciseDuration: 45, mood: 9, focus: 8.2, notes: "Weekend outdoor bike ride. Excellent physical stamina." },
  { date: "2026-11-15", sleepHours: 7.5, screenTimeHours: 4.0, steps: 8700, exerciseDuration: 30, mood: 8, focus: 7.6, notes: "Experiment day 4. Calm evening without blue light." },
  { date: "2026-11-16", sleepHours: 7.7, screenTimeHours: 3.8, steps: 9000, exerciseDuration: 30, mood: 8, focus: 8.3, notes: "Monday focus noticeably sharper than last week." },
  { date: "2026-11-17", sleepHours: 6.9, screenTimeHours: 5.4, steps: 6800, exerciseDuration: 15, mood: 6, focus: 6.5, notes: "Urgent bug fix kept me up slightly later than planned." },
  { date: "2026-11-18", sleepHours: 7.8, screenTimeHours: 3.8, steps: 9300, exerciseDuration: 35, mood: 8, focus: 8.4, notes: "Recovered sleep window. High afternoon energy." },
  { date: "2026-11-19", sleepHours: 7.9, screenTimeHours: 3.5, steps: 9500, exerciseDuration: 40, mood: 9, focus: 8.7, notes: "Experiment day 8. Very stable cognitive stamina." },
  { date: "2026-11-20", sleepHours: 7.5, screenTimeHours: 4.2, steps: 8500, exerciseDuration: 25, mood: 8, focus: 7.9, notes: "Friday code review day. Steady pace." },
  { date: "2026-11-21", sleepHours: 8.3, screenTimeHours: 3.2, steps: 11800, exerciseDuration: 50, mood: 9, focus: 8.5, notes: "Long morning hike. Deep restful afternoon." },
  { date: "2026-11-22", sleepHours: 7.8, screenTimeHours: 3.7, steps: 9100, exerciseDuration: 30, mood: 8, focus: 8.0, notes: "Prepared priorities for upcoming week. Felt organized." },
  { date: "2026-11-23", sleepHours: 8.0, screenTimeHours: 3.5, steps: 9400, exerciseDuration: 35, mood: 9, focus: 8.8, notes: "Peak focus day. Experiment protocol working smoothly." }
];

const STARTER_EXPERIMENTS = [
  {
    title: "Phone away 45 minutes before sleep",
    objective: "Examine if reducing evening blue light and notification arousal improves next-day morning focus scores.",
    durationDays: 14,
    currentDay: 11,
    baseline: "6.2 avg focus, 6.7h sleep",
    target: "7.8+ focus, 7.5h+ sleep",
    startDate: "2026-11-12",
    status: "active",
    completedDays: ["2026-11-12", "2026-11-13", "2026-11-14", "2026-11-15", "2026-11-16", "2026-11-18", "2026-11-19", "2026-11-20", "2026-11-21", "2026-11-22"],
    notes: "Place phone on charger in the hallway before reading. Use traditional alarm clock."
  },
  {
    title: "Post-lunch 15-minute nature walk",
    objective: "Determine whether mild postprandial movement dampens the typical 2:00 PM - 3:30 PM focus drop.",
    durationDays: 14,
    currentDay: 8,
    baseline: "5.8 afternoon focus rating",
    target: "7.2+ afternoon focus rating",
    startDate: "2026-11-15",
    status: "active",
    completedDays: ["2026-11-15", "2026-11-16", "2026-11-18", "2026-11-19", "2026-11-21", "2026-11-22", "2026-11-23"],
    notes: "Step outside right after lunch. No podcast or phone checking during the walk."
  }
];

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, seedDemoData = true } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return ApiResponse.error(res, 'An account with this email already exists', 409);
  }

  const user = await User.create({
    name,
    email,
    password
  });

  // Create default privacy consent
  await Consent.create({
    user: user._id,
    localStorageOnly: false,
    telemetryEnabled: false,
    anonymizedInsights: false,
    exportRetention: true
  });

  // Seed sample records if requested
  if (seedDemoData) {
    const recordDocs = STARTER_RECORDS.map(r => ({ ...r, user: user._id }));
    await DailyRecord.insertMany(recordDocs);

    const expDocs = STARTER_EXPERIMENTS.map(e => ({ ...e, user: user._id }));
    await Experiment.insertMany(expDocs);
  }

  const token = user.generateAuthToken();

  return ApiResponse.created(res, {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      targetSleep: user.targetSleep,
      targetSteps: user.targetSteps,
      targetScreenLimit: user.targetScreenLimit,
      units: user.units,
      timeFormat: user.timeFormat,
      theme: user.theme
    }
  }, 'User registered successfully');
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return ApiResponse.error(res, 'Invalid email or password credentials', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return ApiResponse.error(res, 'Invalid email or password credentials', 401);
  }

  const token = user.generateAuthToken();

  return ApiResponse.success(res, {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      targetSleep: user.targetSleep,
      targetSteps: user.targetSteps,
      targetScreenLimit: user.targetScreenLimit,
      units: user.units,
      timeFormat: user.timeFormat,
      theme: user.theme
    }
  }, 'Logged in successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;
  const consent = await Consent.findOne({ user: user._id });

  return ApiResponse.success(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      targetSleep: user.targetSleep,
      targetSteps: user.targetSteps,
      targetScreenLimit: user.targetScreenLimit,
      units: user.units,
      timeFormat: user.timeFormat,
      theme: user.theme
    },
    privacyConsent: consent || {
      localStorageOnly: false,
      telemetryEnabled: false,
      anonymizedInsights: false,
      exportRetention: true
    }
  });
});

export const demoLogin = asyncHandler(async (req, res) => {
  const demoEmail = 'alex.morgan@daylens.ai';
  let user = await User.findOne({ email: demoEmail });

  if (!user) {
    user = await User.create({
      name: 'Alex Morgan',
      email: demoEmail,
      password: 'DayLensDemoPassword2026!',
      role: 'Knowledge Worker & Track 3 Participant',
      isDemoUser: true
    });

    await Consent.create({
      user: user._id,
      localStorageOnly: false,
      telemetryEnabled: false,
      anonymizedInsights: false,
      exportRetention: true
    });

    const recordDocs = STARTER_RECORDS.map(r => ({ ...r, user: user._id }));
    await DailyRecord.insertMany(recordDocs);

    const expDocs = STARTER_EXPERIMENTS.map(e => ({ ...e, user: user._id }));
    await Experiment.insertMany(expDocs);
  }

  const token = user.generateAuthToken();

  return ApiResponse.success(res, {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      targetSleep: user.targetSleep,
      targetSteps: user.targetSteps,
      targetScreenLimit: user.targetScreenLimit,
      units: user.units,
      timeFormat: user.timeFormat,
      theme: user.theme
    }
  }, 'Demo user authenticated');
});

export const logout = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, null, 'Logged out successfully');
});
