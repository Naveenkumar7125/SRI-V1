// models/FolderEmbedded.js
const mongoose = require("mongoose");

const frameSchema = new mongoose.Schema({
  timestamp: String,
  duration: String,
  description: String,
  imageUrl: String,
  shortSummary: String,
}, { _id: true });

const videoSchema = new mongoose.Schema({
  originalName: String,
  videoUrl: String,
  duration: String,
  shortSummary: String,
  finalSummary: String,
  threatLevel: { type: String, enum: ["low", "medium", "high"], default: "low" },
  confidence: Number,
  timeline: [{ time: String, event: String }],
  detectedFrames: [frameSchema],
}, { _id: true });

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdBy: String,
  videos: [videoSchema]
}, { timestamps: true });

module.exports = mongoose.model("Folder", folderSchema);




const mongoose = require("mongoose");

// ---------------------
// Frame Schema
// ---------------------
const frameSchema = new mongoose.Schema({
  timestamp: String,
  duration: String,
  imageUrl: String,
  shortSummary: String
}, { _id: true });

// ---------------------
// Video Schema
// ---------------------
const videoSchema = new mongoose.Schema({
  originalName: String,
  videoUrl: String,
  duration: String,
  finalSummary: String,
  threatLevel: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low"
  },
  confidence: Number,
  timeline: [{ time: String, event: String }],
  detectedFrames: [frameSchema]
}, { _id: true });

// ---------------------
// Folder Schema
// ---------------------
const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdBy: String,
  videos: [videoSchema]
}, { timestamps: true });

module.exports = mongoose.model("Folder", folderSchema);
