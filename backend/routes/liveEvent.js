// routes/liveEvent.js
const express = require("express");
const router = express.Router();

/**
 * LIVE EVENT ENDPOINT
 * Python sends live frame/video metadata here.
 * Backend broadcasts it to all connected frontends using Socket.IO.
 */
router.post("/live-frame", (req, res) => {
  try {
    const io = req.app.get("io");      // socket.io instance
    const payload = req.body;          // data sent by python

    console.log("📡 LIVE EVENT RECEIVED:", payload.shortSummary || "unknown");

    // Broadcast to all connected frontend clients
    io.emit("liveEvent", payload);

    return res.json({ success: true, forwarded: true });
  } catch (err) {
    console.error("❌ LIVE EVENT ERROR:", err);
    return res.status(500).json({ success: false, error: "Failed to push live event" });
  }
});

module.exports = router;
