import mongoose from 'mongoose';

const DailyRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: String,
      required: [true, 'Please provide a date in YYYY-MM-DD format'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
      index: true
    },
    sleepHours: {
      type: Number,
      required: true,
      min: [0, 'Sleep hours cannot be negative'],
      max: [24, 'Sleep hours cannot exceed 24'],
      default: 7.0
    },
    screenTimeHours: {
      type: Number,
      required: true,
      min: [0, 'Screen time cannot be negative'],
      max: [24, 'Screen time cannot exceed 24'],
      default: 4.0
    },
    steps: {
      type: Number,
      required: true,
      min: [0, 'Steps cannot be negative'],
      default: 0
    },
    exerciseDuration: {
      type: Number,
      required: true,
      min: [0, 'Exercise duration cannot be negative'],
      default: 0
    },
    mood: {
      type: Number,
      required: true,
      min: [1, 'Mood score must be at least 1'],
      max: [10, 'Mood score cannot exceed 10'],
      default: 7
    },
    focus: {
      type: Number,
      required: true,
      min: [1, 'Focus score must be at least 1'],
      max: [10, 'Focus score cannot exceed 10'],
      default: 7
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Ensure a user can only have one record per date
DailyRecordSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyRecord', DailyRecordSchema);
