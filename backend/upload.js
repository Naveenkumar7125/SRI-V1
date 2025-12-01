// const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const { spawn } = require("child_process");

// const router = express.Router();

// // Temporary storage
// const upload = multer({ dest: "temp/" });

// // Auto folder generator for single video uploads
// function getNextFolderName(basePath = "uploads") {
//   if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);

//   const items = fs.readdirSync(basePath);
//   const folderNumbers = items
//     .filter((name) => name.startsWith("folder"))
//     .map((name) => Number(name.replace("folder", "")))
//     .filter((num) => !isNaN(num));

//   const nextNumber =
//     folderNumbers.length === 0 ? 1 : Math.max(...folderNumbers) + 1;

//   return `folder${nextNumber}`;
// }

// // ------------------------------------------------------------
// // MERGED UPLOAD ROUTE
// // ------------------------------------------------------------
// router.post("/upload", upload.array("files"), (req, res) => {
//   try {
//     const { folderName } = req.body;
//     let targetDir = "";

//     // ----------------------------------------------
//     // CASE 1 → FOLDER UPLOAD (from frontend)
//     // ----------------------------------------------
//     if (folderName && folderName.trim() !== "") {
//       targetDir = `uploads/${folderName}/`;
//     }
//     // ----------------------------------------------
//     // CASE 2 → SINGLE FILE / MULTIPLE FILE UPLOAD
//     // ----------------------------------------------
//     else {
//       const newFolder = getNextFolderName();
//       targetDir = `uploads/${newFolder}/`;
//     }

//     // Ensure target directory exists
//     fs.mkdirSync(targetDir, { recursive: true });

//     // Save all uploaded files
//     req.files.forEach((file) => {
//       const dest = targetDir + file.originalname;
//       fs.renameSync(file.path, dest);
//     });

//     // Extract folder name for Python analysis
//     const finalFolderName =
//       folderName && folderName.trim() !== ""
//         ? folderName
//         : targetDir.split("/")[1];

//     // Run Python script
//     const py = spawn("python", ["analyze_folder.py", finalFolderName]);

//     py.stdout.on("data", (d) =>
//       console.log("PYTHON:", d.toString().trim())
//     );
//     py.stderr.on("data", (d) =>
//       console.log("PYTHON ERROR:", d.toString().trim())
//     );

//     return res.json({
//       success: true,
//       storedAt: targetDir,
//       processedFolder: finalFolderName,
//       message: "Files stored successfully. Python analysis started.",
//     });
//   } catch (err) {
//     console.error("UPLOAD ERROR:", err);
//     return res.status(500).json({ error: "Upload failed." });
//   }
// });

// module.exports = router;



const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const router = express.Router();

// Ensure temp and uploads exist
const TEMP_DIR = path.join(__dirname, "..", "temp");
const UPLOADS_ROOT = path.join(__dirname, "uploads");
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_ROOT)) fs.mkdirSync(UPLOADS_ROOT, { recursive: true });

// Multer using disk storage into temp dir
const upload = multer({ dest: TEMP_DIR });

// Auto folder generator for single file uploads
function getNextFolderName(basePath = UPLOADS_ROOT) {
  if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);

  const items = fs.readdirSync(basePath);
  const folderNumbers = items
    .filter((name) => name.startsWith("folder"))
    .map((name) => Number(name.replace("folder", "")))
    .filter((num) => !isNaN(num));

  const nextNumber =
    folderNumbers.length === 0 ? 1 : Math.max(...folderNumbers) + 1;

  return `folder${nextNumber}`;
}

// Utility to move (rename) or copy file if rename fails
function moveFileSafe(src, dest) {
  try {
    fs.renameSync(src, dest);
  } catch (e) {
    // fallback to copy + unlink (safer on some platforms)
    fs.copyFileSync(src, dest);
    fs.unlinkSync(src);
  }
}

// Upload endpoint
router.post("/upload", upload.array("files"), (req, res) => {
  try {
    console.log("---- UPLOAD REQUEST RECEIVED ----");
    console.log("req.body:", req.body);
    console.log("req.files (count):", (req.files || []).length);
    (req.files || []).forEach((f, i) =>
      console.log(`file[${i}] originalname=${f.originalname} path=${f.path}`)
    );

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No files received in req.files. Check frontend sending real File objects.",
      });
    }

    // Determine target directory
    const folderNameFromClient =
      req.body && req.body.folderName && req.body.folderName.trim() !== ""
        ? req.body.folderName.trim()
        : null;

    let targetFolderName;
    if (folderNameFromClient) {
      // sanitize folder name (no ../)
      const safeName = path.basename(folderNameFromClient);
      targetFolderName = safeName;
    } else {
      targetFolderName = getNextFolderName();
    }

    const targetDir = path.join(UPLOADS_ROOT, targetFolderName);
    fs.mkdirSync(targetDir, { recursive: true });

    const savedFiles = [];

    // Move each file from temp -> uploads/<targetFolder>/
    req.files.forEach((file) => {
      // If frontend provided relativePath for folder uploads, prefer using that to create subfolders
      // optional: client may send fileRelativePaths[] matching files order
      const originalName = file.originalname;
      const destPath = path.join(targetDir, originalName);
      moveFileSafe(file.path, destPath);
      savedFiles.push(path.relative(process.cwd(), destPath));
    });

    // Start Python analysis (pass folder name only)
    const py = spawn("python", [
      path.join(__dirname, "..", "backend", "analyze_folder.py"),
      targetFolderName,
    ], { cwd: process.cwd() });

    py.stdout.on("data", (d) =>
      console.log("PYTHON:", d.toString().trim())
    );
    py.stderr.on("data", (d) =>
      console.log("PYTHON ERROR:", d.toString().trim())
    );

    return res.json({
      success: true,
      storedAt: `uploads/${targetFolderName}/`,
      processedFolder: targetFolderName,
      filesSaved: savedFiles,
      message: "Files stored successfully. Python analysis started.",
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ error: "Upload failed.", details: err.message });
  }
});

module.exports = router;
