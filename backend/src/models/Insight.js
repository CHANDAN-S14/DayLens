import mongoose from 'mongoose';

const InsightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['correlation', 'trend', 'anomaly', 'recommendation'],
      default: 'correlation'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    metric: {
      type: String,
      default: ''
    },
    correlationValue: {
      type: Number,
      default: null
    },
    strength: {
      type: String,
      default: 'Moderate'
    },
    direction: {
      type: String,
      default: 'positive'
    },
    actionableAdvice: {
      type: String,
      default: ''
    },
    dateGenerated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Insight', InsightSchema);
