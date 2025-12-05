// /routes/evidenceRoutes.js

import express from "express";
import {
  getAllEvidences,
  getLiveEvidences,
  getUploadedEvidences,
  getEvidenceById,
  createEvidence,
  updateEvidence,
  deleteEvidence,
  getEvidenceStats,
} from "../controllers/evidenceController.js";

const router = express.Router();

// GET evidences (with filters)
router.get("/", getAllEvidences);

// GET live evidences
router.get("/live", getLiveEvidences);

// GET uploaded evidences
router.get("/uploaded", getUploadedEvidences);

// GET evidence by ID
router.get("/:id", getEvidenceById);

// CREATE evidence
router.post("/", createEvidence);

// UPDATE evidence
router.put("/:id", updateEvidence);

// DELETE evidence
router.delete("/:id", deleteEvidence);

// STATS
router.get("/stats/summary", getEvidenceStats);

export default router;
