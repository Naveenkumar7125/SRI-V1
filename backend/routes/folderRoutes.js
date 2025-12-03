const express = require("express");
const Folder = require("../models/Folder");

const router = express.Router();

// CREATE FULL FOLDER
router.post("/create", async (req, res) => {
  try {
    const folder = new Folder(req.body);
    await folder.save();

    res.status(201).json({
      message: "Folder created successfully",
      folder
    });

  } catch (error) {
    res.status(500).json({ message: "Error creating folder", error: error.message });
  }
});

// ADD A VIDEO TO A FOLDER
router.post("/:folderId/add-video", async (req, res) => {
  try {
    const { folderId } = req.params;

    const folder = await Folder.findById(folderId);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    folder.videos.push(req.body);
    await folder.save();

    res.status(201).json({
      message: "Video added successfully",
      folder
    });

  } catch (error) {
    res.status(500).json({ message: "Error adding video", error: error.message });
  }
});

// ADD A FRAME TO A VIDEO
router.post("/:folderId/videos/:videoId/add-frame", async (req, res) => {
  try {
    const { folderId, videoId } = req.params;

    const folder = await Folder.findById(folderId);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    const video = folder.videos.id(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.detectedFrames.push(req.body);
    await folder.save();

    res.status(201).json({
      message: "Frame added successfully",
      folder
    });

  } catch (error) {
    res.status(500).json({ message: "Error adding frame", error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const folders = await Folder.find().select("-__v");
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
