const mongoose = require("mongoose");

// -------------------------------------------------------
// FRAME SCHEMA
// -------------------------------------------------------
const frameSchema = new mongoose.Schema({
  timestamp: String,
  duration: String,
  description: String,
  imageUrl: String,
  shortSummary: String,

  weapon: {
    detected: { type: Boolean, default: false },
    weapon_type: { type: String, default: null },
    confidence: { type: Number, default: 0 }
  },

  face: {
    person_id: { type: String, default: null },
    confidence: { type: Number, default: 0 },
    image_url: { type: String, default: null },
    location: { type: String, default: null }
  },

  anomaly: {
    anomaly_type: { type: String, default: null },
    severity_score: { type: Number, default: 0 },
    description: { type: String, default: null }
  }

}, { _id: true });


// -------------------------------------------------------
// VIDEO SCHEMA
// -------------------------------------------------------
const videoSchema = new mongoose.Schema({
  originalName: String,
  videoUrl: String,
  duration: String,

  shortSummary: String,
  finalSummary: String,

  threatLevel: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low"
  },

  confidence: { type: Number, default: 0 },

  timeline: [
    {
      time: String,
      event: String
    }
  ],

  detectedFrames: [frameSchema],

  overallStats: {
    totalWeapons: { type: Number, default: 0 },
    totalAnomalies: { type: Number, default: 0 },
    totalFaces: { type: Number, default: 0 },
    totalUnknownFaces: { type: Number, default: 0 },
    highestSeverity: { type: Number, default: 0 }
  },

  weaponStats: {
    gun: { type: Number, default: 0 },
    knife: { type: Number, default: 0 },
    stick: { type: Number, default: 0 }
  },

  anomalyStats: {
    fight: { type: Number, default: 0 },
    run: { type: Number, default: 0 },
    entry_breach: { type: Number, default: 0 }
  }

}, { _id: true, timestamps: true });


// -------------------------------------------------------
// FOLDER SCHEMA
// -------------------------------------------------------
const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdBy: String,

  videos: [videoSchema]

}, { timestamps: true });


// Export for require()
module.exports = mongoose.model("Folder", folderSchema);
