const express = require("express");
const Folder = require("../models/Folder");

const router = express.Router();

/**
 * GET /api/history
 * Fetch all analyzed folders (metadata only, no deep videos/frames payload if large, or limit to essential metadata)
 */
router.get("/", async (req, res) => {
  try {
    const folders = await Folder.find().sort({ createdAt: -1 }).lean();
    res.json({ folders });
  } catch (err) {
    console.error("❌ History fetch error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

/**
 * GET /api/history/:id
 * Fetch complete detail for a specific historical analysis run
 */
router.get("/:id", async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id).lean();
    if (!folder) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json({ folder });
  } catch (err) {
    console.error("❌ History detail error:", err);
    res.status(500).json({ error: "Failed to fetch record details" });
  }
});

module.exports = router;
