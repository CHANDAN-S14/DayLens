import mongoose from 'mongoose';

const ConsentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    localStorageOnly: {
      type: Boolean,
      default: false
    },
    telemetryEnabled: {
      type: Boolean,
      default: false
    },
    anonymizedInsights: {
      type: Boolean,
      default: false
    },
    exportRetention: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Consent', ConsentSchema);
