import mongoose from 'mongoose';

const ExperimentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Please provide an experiment title'],
      trim: true,
      maxlength: 200
    },
    objective: {
      type: String,
      required: [true, 'Please provide an experiment objective'],
      trim: true
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1,
      max: 90,
      default: 14
    },
    currentDay: {
      type: Number,
      default: 1,
      min: 1
    },
    baseline: {
      type: String,
      trim: true,
      default: ''
    },
    target: {
      type: String,
      trim: true,
      default: ''
    },
    startDate: {
      type: String,
      required: [true, 'Please provide a start date (YYYY-MM-DD)'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format']
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'completed'],
      default: 'active',
      index: true
    },
    completedDays: {
      type: [String],
      default: []
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

export default mongoose.model('Experiment', ExperimentSchema);
