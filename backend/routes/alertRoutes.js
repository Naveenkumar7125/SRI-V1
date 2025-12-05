// /routes/alertRoutes.js

import express from "express";
import {
  getAllAlerts,
  getLatestAlerts,
  getAlertById,
  createAlert,
  deleteAlert,
  resetAlerts,
} from "../controllers/alertController.js";

const router = express.Router();

// GET all alerts (supports filtering, pagination)
router.get("/", getAllAlerts);

// GET latest 2 alerts
router.get("/latest", getLatestAlerts);

// GET alert by ID
router.get("/:id", getAlertById);

// CREATE alert
router.post("/", createAlert);

// DELETE alert
router.delete("/:id", deleteAlert);

// RESET all alerts
router.post("/reset/all", resetAlerts);

export default router;
