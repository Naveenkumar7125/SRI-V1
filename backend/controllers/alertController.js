// /controllers/alertController.js
import {
  generateAlertTitle,
  determineSeverity,
  generateRecommendations,
  formatTime,
  generateAlertId,
} from "../utils/alertHelpers.js";

export const getAllAlerts = async (req, res) => {
  try {
    const LiveAlert = req.app.locals.models.LiveAlert;

    const { category, cam_id, status, zone, limit = 100, page = 1 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (cam_id) filter.cam_id = cam_id;
    if (status) filter.status = status;
    if (zone) filter.zone = zone;

    const lim = Math.min(parseInt(limit, 10) || 100, 1000);
    const skip = (Math.max(parseInt(page, 10), 1) - 1) * lim;

    const alerts = await LiveAlert.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(lim);

    res.json(alerts);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch live alerts" });
  }
};

export const getLatestAlerts = async (req, res) => {
  try {
    const LiveAlert = req.app.locals.models.LiveAlert;

    const alerts = await LiveAlert.find()
      .sort({ createdAt: -1 })
      .limit(2);

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch latest alerts" });
  }
};

export const getAlertById = async (req, res) => {
  try {
    const LiveAlert = req.app.locals.models.LiveAlert;

    const alert = await LiveAlert.findOne({ id: req.params.id });
    if (!alert) return res.status(404).json({ error: "Alert not found" });

    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch alert" });
  }
};

export const createAlert = async (req, res) => {
  try {
    const LiveAlert = req.app.locals.models.LiveAlert;

    const data = req.body || {};
    const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
    const alertId = data.id || generateAlertId();

    const alertObj = {
      id: alertId,
      image_url: data.image_url || "https://via.placeholder.com/400x500?text=No+Image",
      category: data.category || "suspicious_activity",
      cam_id: data.cam_id || "UNKNOWN",
      location: data.location || "Unknown Location",
      timestamp,
      title: data.title || generateAlertTitle(data.category),
      severity: data.severity || determineSeverity(data.category),
      name: data.name || "Unknown",
      time: data.time || formatTime(timestamp),
      clothing: data.clothing || "Not Available",
      status: data.status || "New",
      assignedTo: data.assignedTo || "Unassigned",
      recommendations:
        data.recommendations ||
        generateRecommendations(data.category, data.location || "Unknown", data.cam_id || "UNKNOWN"),
      createdAgo: data.createdAgo || "Just now",
      confidence_score: typeof data.confidence_score === "number" ? data.confidence_score : 85,
      description: data.description || "",
      zone: data.zone || "",
      createdAt: timestamp,
    };

    const doc = new LiveAlert(alertObj);
    const saved = await doc.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to create alert" });
  }
};

export const deleteAlert = async (req, res) => {
  try {
    const LiveAlert = req.app.locals.models.LiveAlert;

    const deleted = await LiveAlert.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: "Alert not found" });

    res.json({ success: true, message: "Alert deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete alert" });
  }
};

export const resetAlerts = async (req, res) => {
  try {
    const LiveAlert = req.app.locals.models.LiveAlert;

    await LiveAlert.deleteMany({});

    res.json({ success: true, message: "All alerts deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset alerts" });
  }
};
