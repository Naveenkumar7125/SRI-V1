// /models/LiveAlert.js
import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  image_url: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'fighting_detected', 
      'person_missing', 
      'intrusion', 
      'suspicious_activity', 
      'vehicle_alert',
      'criminal_detected',
      'object_left_behind',
      'fire_detected',
      'crowd_gathering'
    ],
    required: true 
  },
  cam_id: { type: String, required: true },
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  
  // New fields for AlertOverlay
  severity: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM' 
  },
  title: { type: String },
  name: { type: String, default: 'Unknown' },
  time: { type: String },
  clothing: { type: String, default: 'Not Available' },
  status: { 
    type: String, 
    enum: ['New', 'Searching', 'Under Investigation', 'Resolved', 'Closed'],
    default: 'New' 
  },
  assignedTo: { type: String, default: 'Unassigned' },
  recommendations: [{ type: String }],
  createdAgo: { type: String },
  
  // Optional additional data
  confidence_score: { type: Number, min: 0, max: 100 },
  description: { type: String },
  zone: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { 
  versionKey: false,
  timestamps: true
});

// Indexes (from original)
alertSchema.index({ status: 1 });
alertSchema.index({ severity: 1 });
alertSchema.index({ timestamp: -1 });
alertSchema.index({ createdAt: -1 });

// Export schema for reuse
export { alertSchema };

// Factory to create model bound to SRI mongoose connection
export default function createLiveAlertModel(connection) {
  try {
    return connection.model('LiveAlert');
  } catch (e) {
    return connection.model('LiveAlert', alertSchema, 'live_alerts');
  }
}
