// // server.js
// const express = require("express");
// const cors = require("cors");
// const fileUpload = require("express-fileupload");
// const mongoose = require("mongoose");
// const WebSocket = require("ws");
// const path = require("path");
// const fs = require("fs");
// const { spawn } = require("child_process");




// const Folder = require("./models/FolderEmbedded");


// const app = express();

// app.use(cors());

// // ⭐ fileUpload MUST COME FIRST ⭐
// app.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: path.join(__dirname, "tmp")
// }));

// // then JSON parser
// app.use(express.json());

// // then URL encoded parser
// app.use(express.urlencoded({ extended: true }));


// // Ensure folder exists
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// // -------------------------------
// // MongoDB
// // -------------------------------
// mongoose.connect("mongodb://localhost:27017/nsg_ai", {
// }).then(() => console.log("✅ MongoDB Connected"))
//   .catch(err => console.log("❌ DB Error:", err));

// // -------------------------------
// // WebSocket Server
// // -------------------------------
// const wss = new WebSocket.Server({ port: 8080 });

// function broadcast(data) {
//   wss.clients.forEach(client => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(data));
//     }
//   });
// }

// console.log("🌐 WebSocket running at ws://localhost:8080");




// // app.post("/api/upload-video", (req, res) => {
// //   console.log("🔥 POST request received at /api/upload-video");
// //   console.log("📥 req.body:", req.body);
// //   console.log("📁 req.files:", req.files);

// //   res.json({ message: "OK" });
// // });


// // -------------------------------
// // API: Upload Video & Trigger Python
// // -------------------------------
// // app.post("/api/upload-video", async (req, res) => {
// //   try {
// //     if (!req.files || !req.files.video) {
// //       return res.status(400).json({ error: "No video file uploaded" });
// //     }

// //     const folderId = req.body.folderId;
// //     const folder = await Folder.findById(folderId);

// //     if (!folder) return res.status(404).json({ error: "Folder not found" });

// //     const videoFile = req.files.video;

// //     const savedPath = path.join(uploadDir, Date.now() + "-" + videoFile.name);
// //     await videoFile.mv(savedPath);

// //     console.log("📁 Video saved:", savedPath);

// //     // Add empty video entry in folder
// //     const newVideo = {
// //       originalName: videoFile.name,
// //       videoUrl: savedPath,
// //       detectedFrames: [],
// //       timeline: []
// //     };

// //     folder.videos.push(newVideo);
// //     const savedFolder = await folder.save();
// //     const videoId = savedFolder.videos[savedFolder.videos.length - 1]._id;

// //     // Trigger Python script
// //     console.log("🐍 Starting Python...");
    
// //     const py = spawn("python", [
// //       path.join(__dirname, "python/analyze_video.py"),
// //       savedPath,
// //       folderId,
// //       videoId.toString()
// //     ]);

// //     // Handle Python output stream
// //     py.stdout.on("data", (data) => {
// //       console.log("🐍 PYTHON:", data.toString());
// //     });

// //     py.stderr.on("data", (data) => {
// //       console.log("🐍 PYTHON ERROR:", data.toString());
// //     });

// //     py.on("close", () => {
// //       console.log("🐍 Python processing finished");
// //     });

// //     res.json({
// //       message: "Video uploaded & analysis started",
// //       folderId,
// //       videoId
// //     });

// //   } catch (err) {
// //     console.log("❌ Upload Error:", err);
// //     res.status(500).json({ error: "Upload failed" });
// //   }
// // });





// app.post("/api/upload-video", async (req, res) => {
//   try {
//     console.log("🔥 /api/upload-video HIT");

//     // Validate file
//     if (!req.files || !req.files.video) {
//       console.log("❌ No file received");
//       return res.status(400).json({ error: "No video uploaded" });
//     }

//     const videoFile = req.files.video;

//     // Save file
//     const savedPath = path.join(uploadDir, Date.now() + "-" + videoFile.name);

//     await videoFile.mv(savedPath);
//     console.log("📁 Video saved:", savedPath);

//     // Trigger Python script
//     console.log("🐍 Triggering Python...");

//     const pythonPath = path.join(__dirname, "python", "analyze_video.py");

//     const py = spawn("python", [
//       pythonPath,
//       savedPath  // pass video file path to python
//     ]);

//     py.stdout.on("data", (data) => {
//       console.log("🐍 PYTHON:", data.toString());
//     });

//     py.stderr.on("data", (data) => {
//       console.log("❌ PYTHON ERROR:", data.toString());
//     });

//     py.on("close", (code) => {
//       console.log("🐍 Python finished with code:", code);
//     });

//     res.json({
//       message: "Upload successful, Python started",
//       videoPath: savedPath
//     });

//   } catch (err) {
//     console.error("❌ Server Error:", err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// });






// // -------------------------------
// // API: Python sends detected frame
// // -------------------------------


// // app.post("/api/push-frame", async (req, res) => {
// //   try {
// //     console.log("📩 Frame received from Python:", req.body);

// //     const { folderId, videoId, timestamp, duration, imageUrl, shortSummary } = req.body;

// //     if (!folderId || !videoId) {
// //       return res.status(400).json({ error: "folderId and videoId are required" });
// //     }

// //     const folder = await Folder.findById(folderId);
// //     if (!folder) return res.status(404).json({ error: "Folder not found" });

// //     const video = folder.videos.id(videoId);
// //     if (!video) return res.status(404).json({ error: "Video not found" });

// //     const newFrame = { timestamp, duration, imageUrl, shortSummary };
// //     video.detectedFrames.push(newFrame);

// //     await folder.save();

// //     broadcast({
// //       type: "NEW_FRAME",
// //       folderId,
// //       videoId,
// //       frame: newFrame
// //     });

// //     res.json({ message: "Frame saved successfully", frame: newFrame });

// //   } catch (err) {
// //     console.error("❌ Frame Save Error:", err);
// //     res.status(500).json({ error: "Failed to save detected frame" });
// //   }
// // });


// // app.post("/api/create-folder", async (req, res) => {
// //   try {
// //     const folder = await Folder.create({
// //       name: "Session - " + new Date().toISOString(),
// //       description: "Auto-created session folder",
// //       videos: []
// //     });

// //     return res.json({
// //       message: "Folder created",
// //       folderId: folder._id
// //     });

// //   } catch (err) {
// //     res.status(500).json({ error: "Failed to create folder" });
// //   }
// // });


// // app.post("/api/add-video-to-folder", async (req, res) => {
// //   try {
// //     const { folderId, videoName, videoUrl } = req.body;

// //     const folder = await Folder.findById(folderId);
// //     if (!folder) return res.status(404).json({ error: "Folder not found" });

// //     const newVideo = folder.videos.create({
// //       originalName: videoName,
// //       videoUrl,
// //       detectedFrames: [],
// //       timeline: [],
// //       shortSummary: "",
// //       finalSummary: ""
// //     });

// //     folder.videos.push(newVideo);
// //     await folder.save();

// //     res.json({
// //       message: "Video added",
// //       videoId: newVideo._id
// //     });

// //   } catch (err) {
// //     res.status(500).json({ error: "Failed to add video" });
// //   }
// // });




// // app.post("/api/push-frame", async (req, res) => {
// //   try {
// //     console.log("📩 Frame received from Python:", req.body);

// //     let { folderId, videoId, timestamp, duration, imageUrl, shortSummary } = req.body;

// //     // -------------------------------------------------------
// //     // 1️⃣ AUTO-CREATE FOLDER IF NOT EXISTS
// //     // -------------------------------------------------------
// //     if (!folderId) {
// //       console.log("📁 No folderId received → Creating new auto folder...");

// //       const autoFolder = await Folder.create({
// //         name: "Auto Folder - " + new Date().toLocaleString(),
// //         description: "Automatically created for this video upload",
// //         videos: [],
// //       });

// //       folderId = autoFolder._id;
// //     }

// //     // Get folder (either newly created or existing)
// //     const folder = await Folder.findById(folderId);
// //     if (!folder) return res.status(404).json({ error: "Folder not found" });

// //     // -------------------------------------------------------
// //     // 2️⃣ AUTO-CREATE VIDEO ENTRY IF NOT EXISTS
// //     // -------------------------------------------------------
// //     if (!videoId) {
// //       console.log("🎥 No videoId received → Creating new video entry...");

// //       const newVid = folder.videos.create({
// //         originalName: "video.mp4",
// //         videoUrl: "N/A",           // optional; later update when actual video is uploaded
// //         duration: "",
// //         shortSummary: "",
// //         finalSummary: "",
// //         timeline: [],
// //         detectedFrames: []
// //       });

// //       folder.videos.push(newVid);
// //       videoId = newVid._id;
// //       await folder.save();
// //     }

// //     const video = folder.videos.id(videoId);
// //     if (!video) return res.status(404).json({ error: "Video not found" });

// //     // -------------------------------------------------------
// //     // 3️⃣ INSERT FRAME DATA
// //     // -------------------------------------------------------
// //     const newFrame = {
// //       timestamp,
// //       duration,
// //       imageUrl,
// //       shortSummary,
// //     };

// //     video.detectedFrames.push(newFrame);
// //     await folder.save();

// //     // -------------------------------------------------------
// //     // 4️⃣ WEBSOCKET BROADCAST
// //     // -------------------------------------------------------
// //     broadcast({
// //       type: "NEW_FRAME",
// //       folderId,
// //       videoId,
// //       frame: newFrame,
// //     });

// //     // -------------------------------------------------------
// //     // 5️⃣ RESPONSE TO PYTHON
// //     // -------------------------------------------------------
// //     res.json({
// //       message: "Frame saved successfully",
// //       folderId,
// //       videoId,
// //       frame: newFrame,
// //     });

// //   } catch (err) {
// //     console.error("❌ Frame Save Error:", err);
// //     res.status(500).json({ error: "Failed to save detected frame" });
// //   }
// // });







// app.get("/api/folders", async (req, res) => {
//   try {
//     const folders = await Folder.find()
//       .select("name videos")   // return folder name + videos
//       .lean();

//     res.json({ folders });
//   } catch (err) {
//     console.error("❌ Fetch folders error:", err);
//     res.status(500).json({ error: "Failed to fetch folders" });
//   }
// });

// const http = require('http')

// const { Server } = require("socket.io");

// // ------ WEBSOCKET MUST BE ABOVE ALL ROUTES ------
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" }
// });


// io.on("connection", (socket) => {
//   console.log("Frontend connected:", socket.id);
// });



// app.post("/api/analysis-complete", async (req, res) => {
//   try {
//     const videoData = req.body;

//     console.log("🎥 Final analysis received from Python:");
//     console.log(JSON.stringify(videoData, null, 2)); // Pretty print JSON

//     // Broadcast to all connected frontend clients
//     io.emit("videoAnalysisComplete", videoData);

//     console.log("📢 Sent to frontend via WebSocket");

//     return res.status(200).json({
//       message: "Video analysis received & broadcasted",
//     });

//   } catch (error) {
//     console.error("❌ Error in /analysis-complete:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// });






// app.post("/api/push-frame", async (req, res) => {
//   try {
//     console.log("📩 Frame received:", req.body);

//     let { mode, folderId, videoId, timestamp, duration, imageUrl, shortSummary } = req.body;

//     let folder;

//     // -------------------------------------------------------
//     // CASE 1: mode === "init" → Create Folder & Video once
//     // -------------------------------------------------------
//     if (mode === "init") {
//       console.log("🆕 INIT MODE → Creating Folder + Video");

//       folder = await Folder.create({
//         name: "Auto Folder - " + new Date().toLocaleString(),
//         description: "Auto-created",
//         videos: []
//       });

//       const newVid = folder.videos.create({
//         originalName: "video.mp4",
//         videoUrl: "N/A",
//         duration: "",
//         finalSummary: "",
//         detectedFrames: []
//       });

//       folder.videos.push(newVid);
//       await folder.save();

//       return res.json({
//         message: "Initialization successful",
//         folderId: folder._id,
//         videoId: newVid._id
//       });
//     }

//     // -------------------------------------------------------
//     // CASE 2: mode === "frame" → Add frame into same video
//     // -------------------------------------------------------
//     folder = await Folder.findById(folderId);
//     if (!folder) return res.status(404).json({ error: "Folder not found" });

//     const video = folder.videos.id(videoId);
//     if (!video) return res.status(404).json({ error: "Video not found" });

//     // Insert frame
//     const newFrame = {
//       timestamp,
//       duration,
//       imageUrl,
//       shortSummary,
//     };

//     video.detectedFrames.push(newFrame);
//     await folder.save();

//     broadcast({
//       type: "NEW_FRAME",
//       folderId,
//       videoId,
//       frame: newFrame
//     });

//     res.json({
//       message: "Frame saved",
//       frame: newFrame
//     });

//   } catch (err) {
//     console.error("❌ Frame Save Error:", err);
//     res.status(500).json({ error: "Failed to save frame" });
//   }
// });





// // app.post("/api/push-frame", async (req, res) => {
// //   try {
// //     const { folderId, videoId, timestamp, duration, imageUrl, shortSummary } = req.body;

// //     if (!folderId || !videoId) {
// //       return res.status(400).json({ error: "folderId and videoId are required" });
// //     }

// //     const folder = await Folder.findById(folderId);
// //     if (!folder) return res.status(404).json({ error: "Folder not found" });

// //     const video = folder.videos.id(videoId);
// //     if (!video) return res.status(404).json({ error: "Video not found" });

// //     const newFrame = { timestamp, duration, imageUrl, shortSummary };
// //     video.detectedFrames.push(newFrame);

// //     await folder.save();

// //     broadcast({
// //       type: "NEW_FRAME",
// //       folderId,
// //       videoId,
// //       frame: newFrame,
// //     });

// //     res.json({ message: "Frame saved successfully", frame: newFrame });

// //   } catch (err) {
// //     res.status(500).json({ error: "Failed to save frame" });
// //   }
// // });






// // -------------------------------
// app.listen(5000, () => {
//   console.log("🚀 Backend running on http://localhost:5000");
// });



// const express = require("express");
// const cors = require("cors");
// const uploadRoute = require("./upload");

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api", uploadRoute);

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });



// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const path = require("path");

// const uploadRoute = require("./upload"); // path to the file above

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// const server = http.createServer(app);

// // Initialize socket.io
// const io = require("socket.io")(server, {
//   cors: { origin: "*" }
// });

// app.set("io", io);
// io.on("connection", (socket) => {
//   console.log("🔥 Frontend connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("❌ Frontend disconnected:", socket.id);
//   });
// });

// app.use("/api", uploadRoute);
// const liveEventRoute = require("./routes/liveEvent");
// app.use("/api", liveEventRoute);

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on ${PORT}`));








































































// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const path = require("path");
// const folderRoutes = require("./routes/folderRoutes");
// const mongoose = require("mongoose");
// const chatRoute = require("./routes/chatRoute.js");



// const uploadRoute = require("./upload");
// const liveEventRoute = require("./routes/liveEvent");

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Create HTTP server
// const server = http.createServer(app);

// // Initialize Socket.io
// const io = require("socket.io")(server, {
//   cors: { origin: "*" }
// });

// // Attach io to express app
// app.set("io", io);

// io.on("connection", (socket) => {
//   console.log("🔥 Frontend connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("❌ Frontend disconnected:", socket.id);
//   });
// });


// // Routes
// app.use("/api", uploadRoute);
// app.use("/api", liveEventRoute);
// app.use("/api/folders", folderRoutes);



// app.use("/api/chat", chatRoute);


// // DB connect
// mongoose.connect("mongodb://localhost:27017/sri_v1")
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.log("DB error:", err));
  


// // START THE SERVER CORRECTLY!
// const PORT = 5000;
// server.listen(PORT, () => {
//   console.log(`🚀 Backend running at http://localhost:${PORT}`);
//   console.log("🟢 Socket.IO Server Ready");
// });







require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const streamifier = require('streamifier');
const { v2: cloudinary } = require('cloudinary');
const socketIo = require('socket.io');

// -------------------- Basic app + server --------------------
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = socketIo(server, { cors: { origin: '*' } });
app.set('io', io);

io.on('connection', (socket) => {
  console.log('🔥 Frontend connected:', socket.id);
  socket.on('disconnect', () => console.log('❌ Frontend disconnected:', socket.id));
});

// -------------------- Cloudinary --------------------
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'ddg5ao8e7';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '282649857566918';
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || 'jpQvjZaCPHhf29KZE2-UM0NTm4U';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

// -------------------- Upload folders (filesystem helper) --------------------
const BASE_DIR = __dirname;
const TEMP_DIR = path.join(BASE_DIR, 'temp');
const UPLOADS_ROOT = path.join(BASE_DIR, 'uploads');

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_ROOT)) fs.mkdirSync(UPLOADS_ROOT, { recursive: true });

// -------------------- Mongoose connections --------------------
// Default / fallback URIs - safe defaults can be overridden via env
const MONGODB_URI_SRI = process.env.MONGODB_URI_SRI ||
  'mongodb+srv://naveenkumart906_db_user:JrY0q4QoPtIhGRfz@nk.wpf1cvv.mongodb.net/SRI?retryWrites=true&w=majority&appName=NK';
const MONGODB_URI_NSG = process.env.MONGODB_URI_NSG ||
  'mongodb+srv://naveenkumart906_db_user:JrY0q4QoPtIhGRfz@nk.wpf1cvv.mongodb.net/NSG?retryWrites=true&w=majority&appName=NK';

// Create two connections using createConnection
const sriConn = mongoose.createConnection(MONGODB_URI_SRI, {
  serverSelectionTimeoutMS: 5000,
  family: 4
});
sriConn.on('connected', () => console.log('✅ Connected to MongoDB SRI database'));
sriConn.on('error', (err) => console.error('❌ SRI connection error:', err));
sriConn.on('disconnected', () => console.warn('⚠️ SRI connection disconnected'));

const nsgConn = mongoose.createConnection(MONGODB_URI_NSG, {
  serverSelectionTimeoutMS: 5000,
  family: 4
});
nsgConn.on('connected', () => console.log('✅ Connected to MongoDB NSG database'));
nsgConn.on('error', (err) => console.error('❌ NSG connection error:', err));
nsgConn.on('disconnected', () => console.warn('⚠️ NSG connection disconnected'));

// -------------------- Schemas --------------------
// Evidence (SRI)
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

// Case (NSG)
const firSchema = new mongoose.Schema({
  number: { type: String },
  filedBy: { type: String },
  date: { type: String },
  witness: { type: String },
  note: { type: String }
}, { versionKey: false });

const videoAnalyticsSchema = new mongoose.Schema({
  sourceCamera: String,
  systemAlertId: String,
  clipDuration: Number,
  videoSegmentTimeRange: String,
  primaryVideoClip: String
}, { versionKey: false });

const faceRecognitionSchema = new mongoose.Schema({
  watchlistName: String,
  matchConfidence: Number,
  watchlistCategory: String,
  cameraAngleZone: String,
  faceSnapshot: String
}, { versionKey: false });

const caseEvidenceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  thumb: { type: String },
  cloudinaryPublicId: { type: String },
  uploadedAt: { type: Date, default: Date.now }
}, { versionKey: false });

const otherCaseDetailsSchema = new mongoose.Schema({
  natureOfIncident: String,
  operationalNotes: String
}, { versionKey: false });

const caseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  caseType: { 
    type: String, 
    enum: ['Face Recognition', 'Intrusion Detection', 'Object Detection', 'Vehicle Analytics', 'Other'],
    default: 'Other'
  },
  threatLevel: { 
    type: String, 
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    default: 'Moderate'
  },
  priority: { type: String, enum: ['Routine', 'Elevated', 'Critical'], default: 'Routine' },
  status: { type: String, enum: ['New', 'Under Investigation', 'Ongoing', 'Completed', 'FIR Filed - Legal Action Started'], default: 'Under Investigation' },
  team: { type: String, required: true },
  nsgHub: { type: String, required: true },
  operationCategory: { type: String, enum: ['Counter-Terror', 'VIP Security', 'Critical Infrastructure', 'Airport Security', 'Urban Counter-Insurgency'], default: 'Counter-Terror' },
  location: { type: String, required: true },
  zoneClassification: { type: String, enum: ['Red', 'Amber', 'Green'], default: 'Amber' },
  incidentTime: { type: Date, required: true },
  firstDetectionTime: { type: Date },
  firstResponseTime: { type: Date },
  expectedClosureWindow: { type: String },
  groundCommander: { type: String },
  controlRoomContact: { type: String },
  engagementPhase: { type: String, enum: ['Pre-incident Intel', 'Live Incident', 'Post-incident Review'], default: 'Live Incident' },
  escalationLevel: { type: String, enum: ['Local Command', 'State Coordination', 'MHA / Central Stakeholder'], default: 'Local Command' },
  linkedOperationId: { type: String },
  assignedOfficer: { type: String, default: 'Unassigned NSG Operative' },
  videoAnalytics: videoAnalyticsSchema,
  faceRecognition: faceRecognitionSchema,
  otherCaseDetails: otherCaseDetailsSchema,
  evidence: [caseEvidenceSchema],
  evidenceCount: { type: Number, default: 0 },
  fir: firSchema,
  evidenceSummary: String,
  roeNotes: String,
  immediateDirectives: String,
  createdOn: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
}, { versionKey: false });

caseSchema.index({ status: 1 });
caseSchema.index({ threatLevel: 1 });
caseSchema.index({ team: 1 });
caseSchema.index({ createdOn: -1 });

// Live alert schema (SRI)
const alertSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  image_url: { type: String, required: true },
  category: { type: String, required: true },
  cam_id: { type: String, required: true },
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  title: { type: String },
  name: { type: String, default: 'Unknown' },
  time: { type: String },
  clothing: { type: String, default: 'Not Available' },
  status: { type: String, enum: ['New', 'Searching', 'Under Investigation', 'Resolved', 'Closed'], default: 'New' },
  assignedTo: { type: String, default: 'Unassigned' },
  recommendations: [{ type: String }],
  createdAgo: { type: String },
  confidence_score: { type: Number, min: 0, max: 100 },
  description: { type: String },
  zone: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false, timestamps: true });

alertSchema.index({ status: 1 });
alertSchema.index({ severity: 1 });
alertSchema.index({ timestamp: -1 });
alertSchema.index({ createdAt: -1 });

// -------------------- Models --------------------
const Evidence = sriConn.model('Evidence', evidenceSchema, 'evidences');
const LiveAlert = sriConn.model('LiveAlert', alertSchema, 'live_alerts');
const Case = nsgConn.model('Case', caseSchema, 'cases');

// -------------------- Multer setup --------------------
const memStorage = multer.memoryStorage();
const upload = multer({
  storage: memStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const mimetype = file.mimetype || '';
    const allowed = (
      mimetype.startsWith('image/') ||
      mimetype.startsWith('video/') ||
      mimetype === 'application/pdf' ||
      mimetype === 'text/plain' ||
      mimetype === 'text/log' ||
      mimetype === 'text/x-log' ||
      mimetype === 'application/octet-stream'
    );
    if (allowed) cb(null, true);
    else cb(new Error('Invalid file type.'), false);
  }
});

// -------------------- Utilities --------------------
const uploadToCloudinary = (file, folder = 'cases') => {
  return new Promise((resolve, reject) => {
    let resourceType = 'auto';
    if (file.mimetype && file.mimetype.startsWith('image/')) resourceType = 'image';
    else if (file.mimetype && file.mimetype.startsWith('video/')) resourceType = 'video';
    else resourceType = 'raw';

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType, quality: 'auto', fetch_format: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

const generateCaseId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `CASE-${timestamp}${random}`;
};

const generateAlertId = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(100 + Math.random() * 900);
  return `ALERT-${timestamp}${random}`;
};

const generateAlertTitle = (category) => {
  const titleMap = {
    'fighting_detected': 'Violence Detected Alert',
    'person_missing': 'Missing Person Alert',
    'intrusion': 'Security Breach Alert',
    'suspicious_activity': 'Suspicious Activity Alert',
    'vehicle_alert': 'Unauthorized Vehicle Alert',
    'criminal_detected': 'Criminal Recognition Alert',
    'object_left_behind': 'Suspicious Object Alert',
    'fire_detected': 'Fire Detection Alert',
    'crowd_gathering': 'Crowd Gathering Alert'
  };
  return titleMap[category] || 'Security Alert';
};

const determineSeverity = (category) => {
  const severityMap = {
    'fighting_detected': 'CRITICAL',
    'fire_detected': 'CRITICAL',
    'criminal_detected': 'HIGH',
    'intrusion': 'HIGH',
    'person_missing': 'HIGH',
    'suspicious_activity': 'MEDIUM',
    'object_left_behind': 'MEDIUM',
    'crowd_gathering': 'MEDIUM',
    'vehicle_alert': 'LOW'
  };
  return severityMap[category] || 'MEDIUM';
};

const generateRecommendations = (category, location, cam_id) => {
  const baseRecommendations = [
    `Dispatch security team to ${location}`,
    `Check live feed from camera ${cam_id}`,
    'Review archived footage for related activity'
  ];
  
  const categorySpecific = {
    'fighting_detected': ['Deploy intervention team immediately', 'Secure perimeter around incident area'],
    'person_missing': ['Initiate search protocol', 'Check all exit points'],
    'criminal_detected': ['Alert all units with suspect description', 'Lock down adjacent zones'],
    'fire_detected': ['Activate fire suppression system', 'Evacuate affected area'],
    'intrusion': ['Secure all access points', 'Initiate lockdown procedure']
  };
  
  return [...(categorySpecific[category] || []), ...baseRecommendations];
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

// -------------------- Simple filesystem upload endpoint (optional) --------------------
function getNextFolderName(basePath = UPLOADS_ROOT) {
  if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);
  const items = fs.readdirSync(basePath);
  const folderNumbers = items
    .filter((name) => name.startsWith('folder'))
    .map((name) => Number(name.replace('folder', '')))
    .filter((n) => !isNaN(n));
  const next = folderNumbers.length === 0 ? 1 : Math.max(...folderNumbers) + 1;
  return `folder${next}`;
}

function moveFileSafe(src, dest) {
  try { fs.renameSync(src, dest); }
  catch (e) { fs.copyFileSync(src, dest); fs.unlinkSync(src); }
}

app.post('/api/upload', multer({ dest: TEMP_DIR }).array('files'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    const folderNameFromClient =
      req.body.folderName && req.body.folderName.trim() !== '' ? req.body.folderName.trim() : null;

    const targetFolderName = folderNameFromClient ? path.basename(folderNameFromClient) : getNextFolderName();
    const targetDir = path.join(UPLOADS_ROOT, targetFolderName);
    fs.mkdirSync(targetDir, { recursive: true });

    const savedFiles = [];
    req.files.forEach((file) => {
      const dest = path.join(targetDir, file.originalname);
      moveFileSafe(file.path, dest);
      savedFiles.push(dest);
    });

    // Spawn python analysis script (non-blocking)
    const py = spawn('python', [path.join(BASE_DIR, 'analyze_folder.py'), targetFolderName], { cwd: BASE_DIR });

    py.stdout.on('data', (d) => console.log('PYTHON:', d.toString().trim()));
    py.stderr.on('data', (d) => console.log('PYTHON ERROR:', d.toString().trim()));
    py.on('close', (code) => console.log('Python analysis finished with code', code));

    res.json({
      success: true,
      storedAt: `uploads/${targetFolderName}/`,
      processedFolder: targetFolderName,
      filesSaved: savedFiles,
      message: 'Files stored. Python analysis started.'
    });
  } catch (err) {
    console.error('UPLOAD ERROR:', err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

// -------------------- Evidence routes (SRI DB) --------------------
app.get('/api/evidences', async (req, res) => {
  try {
    const { type, search, status } = req.query;
    const filter = {};
    if (type && type !== 'all') filter.type = type;
    if (status && status !== 'all') filter.status = { $regex: status, $options: 'i' };
    if (search) filter.$or = [
      { fileName: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
      { status: { $regex: search, $options: 'i' } }
    ];

    const evidences = await Evidence.find(filter).sort({ lastUpdated: -1 });
    res.json(evidences);
  } catch (error) {
    console.error('Error fetching evidences:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch evidences' });
  }
});

app.get('/api/evidences/live', async (req, res) => {
  try {
    const liveEvidences = await Evidence.find({ type: 'live' }).sort({ lastUpdated: -1 });
    res.json(liveEvidences);
  } catch (error) {
    console.error('Error fetching live evidences:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch live evidences' });
  }
});

app.get('/api/evidences/uploaded', async (req, res) => {
  try {
    const uploadedEvidences = await Evidence.find({ type: 'uploaded' }).sort({ lastUpdated: -1 });
    res.json(uploadedEvidences);
  } catch (error) {
    console.error('Error fetching uploaded evidences:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch uploaded evidences' });
  }
});

app.get('/api/evidences/:id', async (req, res) => {
  try {
    const evidence = await Evidence.findOne({ id: req.params.id });
    if (!evidence) return res.status(404).json({ success: false, error: 'Evidence not found' });
    res.json({ success: true, data: evidence });
  } catch (error) {
    console.error('Error fetching evidence:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch evidence' });
  }
});

app.post('/api/evidences', async (req, res) => {
  try {
    const evidenceData = { id: `EVID-${Date.now().toString().slice(-6)}`, ...req.body, lastUpdated: new Date() };
    const newEvidence = new Evidence(evidenceData);
    const saved = await newEvidence.save();
    res.status(201).json({ success: true, message: 'Evidence created successfully', data: saved });
  } catch (error) {
    console.error('Error creating evidence:', error);
    res.status(500).json({ success: false, error: 'Failed to create evidence: ' + error.message });
  }
});

app.put('/api/evidences/:id', async (req, res) => {
  try {
    const updated = await Evidence.findOneAndUpdate({ id: req.params.id }, { ...req.body, lastUpdated: new Date() }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, error: 'Evidence not found' });
    res.json({ success: true, message: 'Evidence updated', data: updated });
  } catch (error) {
    console.error('Error updating evidence:', error);
    res.status(500).json({ success: false, error: 'Failed to update evidence: ' + error.message });
  }
});

app.delete('/api/evidences/:id', async (req, res) => {
  try {
    const ev = await Evidence.findOneAndDelete({ id: req.params.id });
    if (!ev) return res.status(404).json({ success: false, error: 'Evidence not found' });
    res.json({ success: true, message: 'Evidence deleted successfully' });
  } catch (error) {
    console.error('Error deleting evidence:', error);
    res.status(500).json({ success: false, error: 'Failed to delete evidence: ' + error.message });
  }
});

app.get('/api/evidences-stats', async (req, res) => {
  try {
    const totalEvidences = await Evidence.countDocuments();
    const liveEvidences = await Evidence.countDocuments({ type: 'live' });
    const uploadedEvidences = await Evidence.countDocuments({ type: 'uploaded' });
    const activeStreams = await Evidence.countDocuments({ type: 'live', status: 'Active Stream' });
    const evidencesWithEvents = await Evidence.countDocuments({ events: { $gt: 0 } });

    res.json({ success: true, stats: { totalEvidences, liveEvidences, uploadedEvidences, activeStreams, evidencesWithEvents } });
  } catch (error) {
    console.error('Error fetching evidence statistics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
});

// -------------------- Case routes (NSG DB) --------------------
app.get('/api/cases', async (req, res) => {
  try {
    const { search, status, threatLevel, caseType } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { id: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { team: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') filter.status = status;
    if (threatLevel && threatLevel !== 'All') filter.threatLevel = threatLevel;
    if (caseType && caseType !== 'All') filter.caseType = caseType;

    const cases = await Case.find(filter).sort({ createdOn: -1 });
    res.json(cases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch cases' });
  }
});

app.get('/api/cases/:id', async (req, res) => {
  try {
    const caseData = await Case.findOne({ id: req.params.id });
    if (!caseData) return res.status(404).json({ success: false, error: 'Case not found' });
    res.json(caseData);
  } catch (error) {
    console.error('Error fetching case:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch case' });
  }
});

// Create case (supports file uploads)
app.post('/api/cases', upload.any(), async (req, res) => {
  try {
    let caseData = {};
    if (req.body.data) {
      caseData = JSON.parse(req.body.data);
    } else {
      caseData = { ...req.body };
      if (caseData.incidentTime) caseData.incidentTime = new Date(caseData.incidentTime);
      if (caseData.firstDetectionTime) caseData.firstDetectionTime = new Date(caseData.firstDetectionTime);
      if (caseData.firstResponseTime) caseData.firstResponseTime = new Date(caseData.firstResponseTime);
    }

    const files = req.files || [];
    const caseId = generateCaseId();

    const evidenceItems = [];
    let faceSnapshotUrl = null;
    let primaryVideoUrl = null;

    for (const file of files) {
      try {
        const uploadResult = await uploadToCloudinary(file, 'cases');

        if (file.fieldname === 'faceSnapshot') {
          faceSnapshotUrl = uploadResult.secure_url;
        } else if (file.fieldname === 'primaryVideoClip') {
          primaryVideoUrl = uploadResult.secure_url;
        } else {
          evidenceItems.push({
            id: `E${Math.floor(100 + Math.random() * 900)}`,
            type: file.mimetype && file.mimetype.startsWith('image/') ? 'image' :
                  file.mimetype && file.mimetype.startsWith('video/') ? 'video' :
                  file.mimetype && file.mimetype.includes('log') ? 'log' : 'document',
            name: file.originalname,
            thumb: uploadResult.secure_url,
            cloudinaryPublicId: uploadResult.public_id
          });
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error for file', file.originalname, uploadError);
      }
    }

    const casePayload = {
      id: caseId,
      ...caseData,
      evidence: evidenceItems,
      evidenceCount: evidenceItems.length,
      createdOn: new Date(),
      lastUpdated: new Date()
    };

    if (caseData.caseType === 'Face Recognition' && faceSnapshotUrl) {
      casePayload.faceRecognition = { ...caseData.faceRecognition, faceSnapshot: faceSnapshotUrl };
    }
    if (primaryVideoUrl) {
      casePayload.videoAnalytics = { ...caseData.videoAnalytics, primaryVideoClip: primaryVideoUrl };
    }

    const newCase = new Case(casePayload);
    const savedCase = await newCase.save();

    res.status(201).json({ success: true, message: 'Case created successfully', case: savedCase });
  } catch (error) {
    console.error('Error creating case:', error);
    res.status(500).json({ success: false, error: 'Failed to create case: ' + error.message });
  }
});

app.put('/api/cases/:id', async (req, res) => {
  try {
    const updatedCase = await Case.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );
    if (!updatedCase) return res.status(404).json({ success: false, error: 'Case not found' });
    res.json({ success: true, message: 'Case updated successfully', case: updatedCase });
  } catch (error) {
    console.error('Error updating case:', error);
    res.status(500).json({ success: false, error: 'Failed to update case: ' + error.message });
  }
});

app.post('/api/cases/:id/evidence', upload.any(), async (req, res) => {
  try {
    const files = req.files || [];
    const caseData = await Case.findOne({ id: req.params.id });
    if (!caseData) return res.status(404).json({ success: false, error: 'Case not found' });

    for (const file of files) {
      try {
        const uploadResult = await uploadToCloudinary(file, 'cases');
        caseData.evidence.push({
          id: `E${Math.floor(100 + Math.random() * 900)}`,
          type: file.mimetype && file.mimetype.startsWith('image/') ? 'image' :
                file.mimetype && file.mimetype.startsWith('video/') ? 'video' :
                file.mimetype && file.mimetype.includes('log') ? 'log' : 'document',
          name: file.originalname,
          thumb: uploadResult.secure_url,
          cloudinaryPublicId: uploadResult.public_id
        });
      } catch (uploadError) {
        console.error('Cloudinary upload error while adding evidence:', uploadError);
      }
    }

    caseData.evidenceCount = caseData.evidence.length;
    caseData.lastUpdated = new Date();
    const updatedCase = await caseData.save();

    res.json({ success: true, message: 'Evidence added successfully', case: updatedCase });
  } catch (error) {
    console.error('Error adding evidence to case:', error);
    res.status(500).json({ success: false, error: 'Failed to add evidence: ' + error.message });
  }
});

app.delete('/api/cases/:id', async (req, res) => {
  try {
    const caseData = await Case.findOne({ id: req.params.id });
    if (!caseData) return res.status(404).json({ success: false, error: 'Case not found' });

    for (const evidence of caseData.evidence) {
      if (evidence.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(evidence.cloudinaryPublicId, { resource_type: 'auto' });
        } catch (cloudErr) {
          console.error('Error deleting Cloudinary asset:', cloudErr);
        }
      }
    }

    await Case.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Case deleted successfully' });
  } catch (error) {
    console.error('Error deleting case:', error);
    res.status(500).json({ success: false, error: 'Failed to delete case: ' + error.message });
  }
});

app.get('/api/cases-stats', async (req, res) => {
  try {
    const totalCases = await Case.countDocuments();
    const criticalCases = await Case.countDocuments({ threatLevel: { $in: ['Critical', 'High'] } });
    const activeCases = await Case.countDocuments({ status: { $in: ['Ongoing', 'Under Investigation'] } });
    const casesWithFIR = await Case.countDocuments({ 'fir.number': { $exists: true, $ne: null } });

    res.json({ success: true, stats: { totalCases, criticalCases, activeCases, casesWithFIR } });
  } catch (error) {
    console.error('Error fetching cases stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
});

app.patch('/api/cases/:id/quick-update', async (req, res) => {
  try {
    const { status, priority } = req.body;
    const updateData = { lastUpdated: new Date() };
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;

    const updatedCase = await Case.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
    if (!updatedCase) return res.status(404).json({ success: false, error: 'Case not found' });

    res.json({ success: true, message: 'Case updated successfully', case: updatedCase });
  } catch (error) {
    console.error('Error in quick update:', error);
    res.status(500).json({ success: false, error: 'Failed to update case' });
  }
});

// -------------------- Live alerts (SRI DB) --------------------
app.get('/api/live_alerts', async (req, res) => {
  try {
    const { category, cam_id, status, zone, limit = 100, page = 1 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (cam_id) filter.cam_id = cam_id;
    if (status) filter.status = status;
    if (zone) filter.zone = zone;

    const lim = Math.min(parseInt(limit, 10) || 100, 1000);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * lim;

    const alerts = await LiveAlert.find(filter).sort({ timestamp: -1 }).skip(skip).limit(lim);
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching live alerts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch live alerts: ' + (error.message || error) });
  }
});

app.get('/api/live_alerts/latest', async (req, res) => {
  try {
    const alerts = await LiveAlert.find().sort({ createdAt: -1 }).limit(2);
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching latest alerts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch latest alerts' });
  }
});

app.get('/api/live_alerts/:id', async (req, res) => {
  try {
    const alert = await LiveAlert.findOne({ id: req.params.id });
    if (!alert) return res.status(404).json({ success: false, error: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    console.error('Error fetching alert:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch alert' });
  }
});

app.post('/api/live_alerts', async (req, res) => {
  try {
    const data = req.body || {};
    const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
    const alertId = data.id || generateAlertId();

    const newAlert = {
      id: alertId,
      image_url: data.image_url || 'https://via.placeholder.com/400x500?text=No+Image',
      category: data.category || 'suspicious_activity',
      cam_id: data.cam_id || 'UNKNOWN',
      location: data.location || 'Unknown Location',
      timestamp,
      title: data.title || generateAlertTitle(data.category),
      severity: data.severity || determineSeverity(data.category),
      name: data.name || 'Unknown',
      time: data.time || formatTime(timestamp),
      clothing: data.clothing || 'Not Available',
      status: data.status || 'New',
      assignedTo: data.assignedTo || 'Unassigned',
      recommendations: data.recommendations || generateRecommendations(data.category, data.location || 'Unknown Location', data.cam_id || 'UNKNOWN'),
      createdAgo: data.createdAgo || 'Just now',
      confidence_score: typeof data.confidence_score === 'number' ? data.confidence_score : 85,
      description: data.description || '',
      zone: data.zone || '',
      createdAt: timestamp
    };

    const alertDoc = new LiveAlert(newAlert);
    const saved = await alertDoc.save();

    // emit via socket
    try { app.get('io').emit('liveEvent', saved); } catch (e) { /* ignore */ }

    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating live alert:', error);
    if (error && error.code === 11000) {
      return res.status(409).json({ success: false, error: 'Alert with this id already exists' });
    }
    res.status(500).json({ success: false, error: 'Failed to create live alert: ' + (error.message || error) });
  }
});

app.post('/api/live_alerts/add', async (req, res) => {
  try {
    const data = req.body || {};
    const timestamp = new Date();
    if (!data.id) data.id = generateAlertId();

    const alertData = {
      id: data.id,
      image_url: data.image_url || 'https://via.placeholder.com/400x500?text=No+Image',
      category: data.category || 'suspicious_activity',
      cam_id: data.cam_id || 'UNKNOWN',
      location: data.location || 'Unknown Location',
      timestamp: data.timestamp ? new Date(data.timestamp) : timestamp,
      title: data.title || generateAlertTitle(data.category),
      severity: data.severity || determineSeverity(data.category),
      name: data.name || 'Unknown',
      time: data.time || formatTime(timestamp),
      clothing: data.clothing || 'Not Available',
      status: data.status || 'New',
      assignedTo: data.assignedTo || 'Unassigned',
      recommendations: data.recommendations || generateRecommendations(data.category, data.location || 'Unknown Location', data.cam_id || 'UNKNOWN'),
      createdAgo: data.createdAgo || 'Just now',
      confidence_score: typeof data.confidence_score === 'number' ? data.confidence_score : 85,
      description: data.description || '',
      zone: data.zone || '',
      createdAt: timestamp
    };

    const alert = new LiveAlert(alertData);
    await alert.save();

    try { app.get('io').emit('liveEvent', alert); } catch (e) {}

    res.json({ message: 'Alert added successfully', alert });
  } catch (error) {
    console.error('Error adding alert:', error);
    res.status(500).json({ error: 'Failed to create alert', details: error.message });
  }
});

app.delete('/api/live_alerts/:id', async (req, res) => {
  try {
    const deleted = await LiveAlert.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ success: false, error: 'Alert not found' });
    res.json({ success: true, message: 'Alert deleted successfully', deleted });
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ success: false, error: 'Failed to delete alert: ' + (error.message || error) });
  }
});

app.post('/api/live_alerts/reset', async (req, res) => {
  try {
    await LiveAlert.deleteMany({});
    res.json({ success: true, message: 'All alerts have been deleted' });
  } catch (error) {
    console.error('Error resetting live alerts:', error);
    res.status(500).json({ success: false, error: error.message || error });
  }
});

// -------------------- Root & Health --------------------
app.get('/api/health', (req, res) => {
  const sriState = sriConn.readyState === 1 ? 'Connected' : sriConn.readyState === 2 ? 'Connecting' : 'Disconnected';
  const nsgState = nsgConn.readyState === 1 ? 'Connected' : nsgConn.readyState === 2 ? 'Connecting' : 'Disconnected';

  res.json({
    status: 'OK',
    databases: { SRI: sriState, NSG: nsgState },
    cloudinary: cloudinary.config().cloud_name ? 'Configured' : 'Not configured',
    timestamp: new Date().toISOString(),
    endpoints: {
      evidences: '/api/evidences',
      cases: '/api/cases',
      liveAlerts: '/api/live_alerts',
      evidencesStats: '/api/evidences-stats',
      casesStats: '/api/cases-stats'
    }
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'SRI / NSG Evidence, Cases & Live Alerts API is running.',
    endpoints: {
      health: '/api/health',
      evidences: '/api/evidences',
      evidencesStats: '/api/evidences-stats',
      cases: '/api/cases',
      casesStats: '/api/cases-stats',
      caseQuickUpdate: '/api/cases/:id/quick-update (PATCH)',
      addCaseEvidence: '/api/cases/:id/evidence (POST)',
      liveAlerts: '/api/live_alerts',
      latestAlerts: '/api/live_alerts/latest',
      addAlert: '/api/live_alerts/add (POST)',
      resetAlerts: '/api/live_alerts/reset (POST)'
    },
    timestamp: new Date().toISOString()
  });
});

// Debug - list collections (SRI + NSG)
app.get('/api/debug/connections', async (req, res) => {
  try {
    const sriCollections = await sriConn.db.listCollections().toArray();
    const nsgCollections = await nsgConn.db.listCollections().toArray();
    res.json({
      success: true,
      SRI_collections: sriCollections.map(c => c.name),
      NSG_collections: nsgCollections.map(c => c.name)
    });
  } catch (err) {
    console.error('Debug error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------- Error handling --------------------
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, error: 'File too large. Maximum size is 20MB.' });
    }
  }
  console.error('Server error:', error && error.message ? error.message : error);
  res.status(500).json({ success: false, error: error && error.message ? error.message : 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// -------------------- Start server --------------------
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Evidence API (SRI DB): http://localhost:${PORT}/api/evidences`);
  console.log(`📁 Cases API (NSG DB): http://localhost:${PORT}/api/cases`);
  console.log(`📁 Live Alerts API (SRI DB): http://localhost:${PORT}/api/live_alerts`);
  console.log(`📁 Latest Alerts: http://localhost:${PORT}/api/live_alerts/latest`);
});

// Export app for testing or external usage
module.exports = app;

