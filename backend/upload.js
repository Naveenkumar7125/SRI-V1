const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const router = express.Router();

// Temp + uploads dirs (relative to backend/)
const BACKEND_DIR = __dirname;
const TEMP_DIR = path.join(BACKEND_DIR, "temp");
const UPLOADS_ROOT = path.join(BACKEND_DIR, "uploads");

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_ROOT)) fs.mkdirSync(UPLOADS_ROOT, { recursive: true });

// Multer: store temp files in TEMP_DIR
const upload = multer({ dest: TEMP_DIR });

// In-memory store for analysis statuses (per folderId)
// In production, store this in MongoDB
const analysisStore = {};

// Auto folder generator for single file uploads
function getNextFolderName(basePath = UPLOADS_ROOT) {
  if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);
  const items = fs.readdirSync(basePath);
  const folderNumbers = items
    .filter((name) => name.startsWith("folder"))
    .map((name) => Number(name.replace("folder", "")))
    .filter((num) => !isNaN(num));
  const nextNumber = folderNumbers.length === 0 ? 1 : Math.max(...folderNumbers) + 1;
  return `folder${nextNumber}`;
}

// Utility: move file (rename or copy+delete)
function moveFileSafe(src, dest) {
  try {
    fs.renameSync(src, dest);
  } catch (e) {
    fs.copyFileSync(src, dest);
    fs.unlinkSync(src);
  }
}

// ------------------- POST /api/upload -------------------
router.post("/upload", upload.array("files"), (req, res) => {
  try {
    console.log("---- UPLOAD REQUEST RECEIVED ----");
    console.log("req.body:", req.body);
    console.log("req.files count:", (req.files || []).length);
    (req.files || []).forEach((f, i) =>
      console.log(`  file[${i}] originalname=${f.originalname} path=${f.path}`)
    );

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No files received. Make sure you are sending real File objects with key 'files'.",
      });
    }

    // Determine folder name
    const folderNameFromClient =
      req.body && req.body.folderName && req.body.folderName.trim() !== ""
        ? req.body.folderName.trim()
        : null;

    let targetFolderName;
    if (folderNameFromClient) {
      targetFolderName = path.basename(folderNameFromClient); // sanitize
    } else {
      targetFolderName = getNextFolderName();
    }

    const targetDir = path.join(UPLOADS_ROOT, targetFolderName);
    fs.mkdirSync(targetDir, { recursive: true });

    const savedFiles = [];

    // Move each file from temp → uploads/<folder>/
    req.files.forEach((file) => {
      const originalName = file.originalname;
      const destPath = path.join(targetDir, originalName);
      moveFileSafe(file.path, destPath);
      savedFiles.push(originalName);
    });

    // Initialize analysis status in memory
    const folderId = targetFolderName;
    analysisStore[folderId] = {
      folderId,
      folderName: folderNameFromClient || targetFolderName,
      status: "analyzing",
      videos: savedFiles.map((name) => ({ name, status: "queued" })),
      keyFrames: [],
      events: [],
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    // Get Python path from env or defaults
    const pythonPath =
      process.env.PYTHON_PATH ||
      "C:/Users/HP/AppData/Local/Programs/Python/Python39/python.exe";

    // analyze_folder.py lives in backend/
    const scriptPath = path.join(BACKEND_DIR, "analyze_folder.py");

    console.log(`Spawning Python: ${pythonPath} ${scriptPath} ${targetFolderName}`);

    if (fs.existsSync(scriptPath)) {
      const io = req.app.get("io");

      const py = spawn(pythonPath, [scriptPath, targetFolderName], {
        cwd: BACKEND_DIR,
      });

      py.stdout.on("data", (d) => {
        const line = d.toString().trim();
        console.log("PYTHON:", line);

        // Try to parse structured progress updates from Python
        try {
          const parsed = JSON.parse(line);
          if (parsed.type === "frame" && io) {
            // Store in memory
            if (analysisStore[folderId]) {
              analysisStore[folderId].keyFrames.push(parsed);
              analysisStore[folderId].events.push({
                timestamp: parsed.timestamp,
                summary: parsed.shortSummary,
                imageUrl: parsed.imageUrl,
              });
              analysisStore[folderId].progress = parsed.progress || 0;
            }

            // Broadcast to frontend via Socket.IO room
            if (io) {
              io.to(`folder_${folderId}`).emit("live_frame", parsed);
              io.to(`folder_${folderId}`).emit("analysis_progress", {
                folderId,
                progress: parsed.progress || 0,
                videoName: parsed.videoName || targetFolderName,
              });
            }
          } else if (parsed.type === "complete" && io) {
            if (analysisStore[folderId]) {
              analysisStore[folderId].status = "completed";
              analysisStore[folderId].progress = 100;
            }
            io.to(`folder_${folderId}`).emit("analysis_complete", {
              folderId,
              totalFrames: (analysisStore[folderId]?.keyFrames || []).length,
              message: "Analysis completed!",
            });
          }
        } catch (_) {
          // Not JSON — just a plain log line, ignore
        }
      });

      py.stderr.on("data", (d) => {
        console.log("PYTHON ERROR:", d.toString().trim());
      });

      py.on("close", (code) => {
        console.log(`Python analysis finished with code ${code}`);
        if (analysisStore[folderId] && analysisStore[folderId].status !== "completed") {
          analysisStore[folderId].status = code === 0 ? "completed" : "error";
          analysisStore[folderId].progress = 100;
          if (io) {
            io.to(`folder_${folderId}`).emit("analysis_complete", {
              folderId,
              totalFrames: (analysisStore[folderId]?.keyFrames || []).length,
              message: code === 0 ? "Analysis completed!" : "Analysis finished with errors.",
            });
          }
        }
      });
    } else {
      console.log(`WARN: analyze_folder.py not found at ${scriptPath}. Skipping Python analysis.`);
    }

    return res.json({
      success: true,
      // Frontend uses folderId + folderName
      folderId: targetFolderName,
      folderName: folderNameFromClient || targetFolderName,
      // Extra info
      storedAt: `uploads/${targetFolderName}/`,
      processedFolder: targetFolderName,
      filesSaved: savedFiles,
      videos: savedFiles.map((name) => ({ name })),
      status: "analyzing",
      createdAt: new Date().toISOString(),
      message: "Files stored successfully. Python analysis started.",
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ success: false, error: "Upload failed.", details: err.message });
  }
});

// ------------------- GET /api/analysis-status/:folderId -------------------
// Frontend polls this for analysis status
router.get("/analysis-status/:folderId", (req, res) => {
  const { folderId } = req.params;
  const data = analysisStore[folderId];

  if (!data) {
    // Check if folder actually exists on disk
    const folderPath = path.join(UPLOADS_ROOT, folderId);
    if (fs.existsSync(folderPath)) {
      return res.json({
        folderId,
        folderName: folderId,
        status: "completed",
        videos: [],
        keyFrames: [],
        events: [],
        progress: 100,
        createdAt: new Date().toISOString(),
      });
    }
    return res.status(404).json({ success: false, error: "Analysis not found for this folderId" });
  }

  return res.json({ success: true, ...data });
});

// ------------------- GET /api/get-events/:folderId -------------------
// Frontend fetches existing events/frames for a folder
router.get("/get-events/:folderId", (req, res) => {
  const { folderId } = req.params;
  const data = analysisStore[folderId];

  if (!data) {
    return res.json({ events: [], keyFrames: [] });
  }

  return res.json({
    success: true,
    folderId,
    events: data.events || [],
    keyFrames: data.keyFrames || [],
  });
});

// Export the in-memory store so server.js can access it if needed
router.analysisStore = analysisStore;

module.exports = router;
