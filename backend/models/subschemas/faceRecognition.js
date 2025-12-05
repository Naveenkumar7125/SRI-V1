// /models/subschemas/faceRecognition.js
import mongoose from 'mongoose';

export const faceRecognitionSchema = new mongoose.Schema({
  watchlistName: String,
  matchConfidence: Number,
  watchlistCategory: String,
  cameraAngleZone: String,
  faceSnapshot: String
}, { versionKey: false });
