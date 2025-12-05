// /models/subschemas/videoAnalytics.js
import mongoose from 'mongoose';

export const videoAnalyticsSchema = new mongoose.Schema({
  sourceCamera: String,
  systemAlertId: String,
  clipDuration: Number,
  videoSegmentTimeRange: String,
  primaryVideoClip: String
}, { versionKey: false });
