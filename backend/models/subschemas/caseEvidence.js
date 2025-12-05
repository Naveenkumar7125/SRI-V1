// /models/subschemas/caseEvidence.js
import mongoose from 'mongoose';

export const caseEvidenceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  thumb: { type: String },
  cloudinaryPublicId: { type: String },
  uploadedAt: { type: Date, default: Date.now }
}, { versionKey: false });
