// server.js
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const WebSocket = require("ws");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");




const Folder = require("./models/FolderEmbedded");


const app = express();

app.use(cors());

// ⭐ fileUpload MUST COME FIRST ⭐
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, "tmp")
}));

// then JSON parser
app.use(express.json());

// then URL encoded parser
app.use(express.urlencoded({ extended: true }));


// Ensure folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// -------------------------------
// MongoDB
// -------------------------------
mongoose.connect("mongodb://localhost:27017/nsg_ai", {
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// -------------------------------
// WebSocket Server
// -------------------------------
const wss = new WebSocket.Server({ port: 8080 });

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

console.log("🌐 WebSocket running at ws://localhost:8080");




// app.post("/api/upload-video", (req, res) => {
//   console.log("🔥 POST request received at /api/upload-video");
//   console.log("📥 req.body:", req.body);
//   console.log("📁 req.files:", req.files);

//   res.json({ message: "OK" });
// });


// -------------------------------
// API: Upload Video & Trigger Python
// -------------------------------
// app.post("/api/upload-video", async (req, res) => {
//   try {
//     if (!req.files || !req.files.video) {
//       return res.status(400).json({ error: "No video file uploaded" });
//     }

//     const folderId = req.body.folderId;
//     const folder = await Folder.findById(folderId);

//     if (!folder) return res.status(404).json({ error: "Folder not found" });

//     const videoFile = req.files.video;

//     const savedPath = path.join(uploadDir, Date.now() + "-" + videoFile.name);
//     await videoFile.mv(savedPath);

//     console.log("📁 Video saved:", savedPath);

//     // Add empty video entry in folder
//     const newVideo = {
//       originalName: videoFile.name,
//       videoUrl: savedPath,
//       detectedFrames: [],
//       timeline: []
//     };

//     folder.videos.push(newVideo);
//     const savedFolder = await folder.save();
//     const videoId = savedFolder.videos[savedFolder.videos.length - 1]._id;

//     // Trigger Python script
//     console.log("🐍 Starting Python...");
    
//     const py = spawn("python", [
//       path.join(__dirname, "python/analyze_video.py"),
//       savedPath,
//       folderId,
//       videoId.toString()
//     ]);

//     // Handle Python output stream
//     py.stdout.on("data", (data) => {
//       console.log("🐍 PYTHON:", data.toString());
//     });

//     py.stderr.on("data", (data) => {
//       console.log("🐍 PYTHON ERROR:", data.toString());
//     });

//     py.on("close", () => {
//       console.log("🐍 Python processing finished");
//     });

//     res.json({
//       message: "Video uploaded & analysis started",
//       folderId,
//       videoId
//     });

//   } catch (err) {
//     console.log("❌ Upload Error:", err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// });





app.post("/api/upload-video", async (req, res) => {
  try {
    console.log("🔥 /api/upload-video HIT");

    // Validate file
    if (!req.files || !req.files.video) {
      console.log("❌ No file received");
      return res.status(400).json({ error: "No video uploaded" });
    }

    const videoFile = req.files.video;

    // Save file
    const savedPath = path.join(uploadDir, Date.now() + "-" + videoFile.name);

    await videoFile.mv(savedPath);
    console.log("📁 Video saved:", savedPath);

    // Trigger Python script
    console.log("🐍 Triggering Python...");

    const pythonPath = path.join(__dirname, "python", "analyze_video.py");

    const py = spawn("python", [
      pythonPath,
      savedPath  // pass video file path to python
    ]);

    py.stdout.on("data", (data) => {
      console.log("🐍 PYTHON:", data.toString());
    });

    py.stderr.on("data", (data) => {
      console.log("❌ PYTHON ERROR:", data.toString());
    });

    py.on("close", (code) => {
      console.log("🐍 Python finished with code:", code);
    });

    res.json({
      message: "Upload successful, Python started",
      videoPath: savedPath
    });

  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});






// -------------------------------
// API: Python sends detected frame
// -------------------------------


// app.post("/api/push-frame", async (req, res) => {
//   try {
//     console.log("📩 Frame received from Python:", req.body);

//     const { folderId, videoId, timestamp, duration, imageUrl, shortSummary } = req.body;

//     if (!folderId || !videoId) {
//       return res.status(400).json({ error: "folderId and videoId are required" });
//     }

//     const folder = await Folder.findById(folderId);
//     if (!folder) return res.status(404).json({ error: "Folder not found" });

//     const video = folder.videos.id(videoId);
//     if (!video) return res.status(404).json({ error: "Video not found" });

//     const newFrame = { timestamp, duration, imageUrl, shortSummary };
//     video.detectedFrames.push(newFrame);

//     await folder.save();

//     broadcast({
//       type: "NEW_FRAME",
//       folderId,
//       videoId,
//       frame: newFrame
//     });

//     res.json({ message: "Frame saved successfully", frame: newFrame });

//   } catch (err) {
//     console.error("❌ Frame Save Error:", err);
//     res.status(500).json({ error: "Failed to save detected frame" });
//   }
// });


// app.post("/api/create-folder", async (req, res) => {
//   try {
//     const folder = await Folder.create({
//       name: "Session - " + new Date().toISOString(),
//       description: "Auto-created session folder",
//       videos: []
//     });

//     return res.json({
//       message: "Folder created",
//       folderId: folder._id
//     });

//   } catch (err) {
//     res.status(500).json({ error: "Failed to create folder" });
//   }
// });


// app.post("/api/add-video-to-folder", async (req, res) => {
//   try {
//     const { folderId, videoName, videoUrl } = req.body;

//     const folder = await Folder.findById(folderId);
//     if (!folder) return res.status(404).json({ error: "Folder not found" });

//     const newVideo = folder.videos.create({
//       originalName: videoName,
//       videoUrl,
//       detectedFrames: [],
//       timeline: [],
//       shortSummary: "",
//       finalSummary: ""
//     });

//     folder.videos.push(newVideo);
//     await folder.save();

//     res.json({
//       message: "Video added",
//       videoId: newVideo._id
//     });

//   } catch (err) {
//     res.status(500).json({ error: "Failed to add video" });
//   }
// });




// app.post("/api/push-frame", async (req, res) => {
//   try {
//     console.log("📩 Frame received from Python:", req.body);

//     let { folderId, videoId, timestamp, duration, imageUrl, shortSummary } = req.body;

//     // -------------------------------------------------------
//     // 1️⃣ AUTO-CREATE FOLDER IF NOT EXISTS
//     // -------------------------------------------------------
//     if (!folderId) {
//       console.log("📁 No folderId received → Creating new auto folder...");

//       const autoFolder = await Folder.create({
//         name: "Auto Folder - " + new Date().toLocaleString(),
//         description: "Automatically created for this video upload",
//         videos: [],
//       });

//       folderId = autoFolder._id;
//     }

//     // Get folder (either newly created or existing)
//     const folder = await Folder.findById(folderId);
//     if (!folder) return res.status(404).json({ error: "Folder not found" });

//     // -------------------------------------------------------
//     // 2️⃣ AUTO-CREATE VIDEO ENTRY IF NOT EXISTS
//     // -------------------------------------------------------
//     if (!videoId) {
//       console.log("🎥 No videoId received → Creating new video entry...");

//       const newVid = folder.videos.create({
//         originalName: "video.mp4",
//         videoUrl: "N/A",           // optional; later update when actual video is uploaded
//         duration: "",
//         shortSummary: "",
//         finalSummary: "",
//         timeline: [],
//         detectedFrames: []
//       });

//       folder.videos.push(newVid);
//       videoId = newVid._id;
//       await folder.save();
//     }

//     const video = folder.videos.id(videoId);
//     if (!video) return res.status(404).json({ error: "Video not found" });

//     // -------------------------------------------------------
//     // 3️⃣ INSERT FRAME DATA
//     // -------------------------------------------------------
//     const newFrame = {
//       timestamp,
//       duration,
//       imageUrl,
//       shortSummary,
//     };

//     video.detectedFrames.push(newFrame);
//     await folder.save();

//     // -------------------------------------------------------
//     // 4️⃣ WEBSOCKET BROADCAST
//     // -------------------------------------------------------
//     broadcast({
//       type: "NEW_FRAME",
//       folderId,
//       videoId,
//       frame: newFrame,
//     });

//     // -------------------------------------------------------
//     // 5️⃣ RESPONSE TO PYTHON
//     // -------------------------------------------------------
//     res.json({
//       message: "Frame saved successfully",
//       folderId,
//       videoId,
//       frame: newFrame,
//     });

//   } catch (err) {
//     console.error("❌ Frame Save Error:", err);
//     res.status(500).json({ error: "Failed to save detected frame" });
//   }
// });







app.get("/api/folders", async (req, res) => {
  try {
    const folders = await Folder.find()
      .select("name videos")   // return folder name + videos
      .lean();

    res.json({ folders });
  } catch (err) {
    console.error("❌ Fetch folders error:", err);
    res.status(500).json({ error: "Failed to fetch folders" });
  }
});






app.post("/api/push-frame", async (req, res) => {
  try {
    console.log("📩 Frame received:", req.body);

    let { mode, folderId, videoId, timestamp, duration, imageUrl, shortSummary } = req.body;

    let folder;

    // -------------------------------------------------------
    // CASE 1: mode === "init" → Create Folder & Video once
    // -------------------------------------------------------
    if (mode === "init") {
      console.log("🆕 INIT MODE → Creating Folder + Video");

      folder = await Folder.create({
        name: "Auto Folder - " + new Date().toLocaleString(),
        description: "Auto-created",
        videos: []
      });

      const newVid = folder.videos.create({
        originalName: "video.mp4",
        videoUrl: "N/A",
        duration: "",
        finalSummary: "",
        detectedFrames: []
      });

      folder.videos.push(newVid);
      await folder.save();

      return res.json({
        message: "Initialization successful",
        folderId: folder._id,
        videoId: newVid._id
      });
    }

    // -------------------------------------------------------
    // CASE 2: mode === "frame" → Add frame into same video
    // -------------------------------------------------------
    folder = await Folder.findById(folderId);
    if (!folder) return res.status(404).json({ error: "Folder not found" });

    const video = folder.videos.id(videoId);
    if (!video) return res.status(404).json({ error: "Video not found" });

    // Insert frame
    const newFrame = {
      timestamp,
      duration,
      imageUrl,
      shortSummary,
    };

    video.detectedFrames.push(newFrame);
    await folder.save();

    broadcast({
      type: "NEW_FRAME",
      folderId,
      videoId,
      frame: newFrame
    });

    res.json({
      message: "Frame saved",
      frame: newFrame
    });

  } catch (err) {
    console.error("❌ Frame Save Error:", err);
    res.status(500).json({ error: "Failed to save frame" });
  }
});





// app.post("/api/push-frame", async (req, res) => {
//   try {
//     const { folderId, videoId, timestamp, duration, imageUrl, shortSummary } = req.body;

//     if (!folderId || !videoId) {
//       return res.status(400).json({ error: "folderId and videoId are required" });
//     }

//     const folder = await Folder.findById(folderId);
//     if (!folder) return res.status(404).json({ error: "Folder not found" });

//     const video = folder.videos.id(videoId);
//     if (!video) return res.status(404).json({ error: "Video not found" });

//     const newFrame = { timestamp, duration, imageUrl, shortSummary };
//     video.detectedFrames.push(newFrame);

//     await folder.save();

//     broadcast({
//       type: "NEW_FRAME",
//       folderId,
//       videoId,
//       frame: newFrame,
//     });

//     res.json({ message: "Frame saved successfully", frame: newFrame });

//   } catch (err) {
//     res.status(500).json({ error: "Failed to save frame" });
//   }
// });






// -------------------------------
app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});
