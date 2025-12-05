// /models/Evidence.js
import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  fileName: { type: String, required: true },
  uploadedAt: { type: String, required: true },
  duration: { type: String, required: true },
  events: { type: Number, required: true },
  location: { type: String, required: true },
  status: { type: String, required: true },
  type: { type: String, enum: ['live', 'uploaded'], default: 'live' },
  streamUrl: { type: String },
  cameraId: { type: String },
  isActive: { type: Boolean, default: true },
  lastUpdated: { type: Date, default: Date.now }
}, { versionKey: false });

// Indexes (none in original for evidences, but keep pattern if needed)
evidenceSchema.index({ lastUpdated: -1 });

// Export schema for reuse
export { evidenceSchema };

// Factory to create model bound to a specific mongoose connection
export default function createEvidenceModel(connection) {
  // If model already exists on given connection, return it (prevents overwrite errors)
  try {
    return connection.model('Evidence');
  } catch (e) {
    return connection.model('Evidence', evidenceSchema, 'evidences');
  }
}
