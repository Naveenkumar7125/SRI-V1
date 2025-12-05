// /routes/caseRoutes.js

import express from "express";
import multer from "multer";
import {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  addCaseEvidence,
  deleteCase,
  getCaseStats,
  quickUpdateCase,
} from "../controllers/caseController.js";

// Multer for multi-file upload
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// GET cases
router.get("/", getCases);

// GET case by ID
router.get("/:id", getCaseById);

// CREATE case (supports multiple file uploads)
router.post("/", upload.any(), createCase);

// UPDATE case
router.put("/:id", updateCase);

// QUICK UPDATE (status, priority)
router.patch("/:id/quick-update", quickUpdateCase);

// ADD evidence to existing case
router.post("/:id/evidence", upload.any(), addCaseEvidence);

// DELETE case
router.delete("/:id", deleteCase);

// CASE STATISTICS
router.get("/stats/summary", getCaseStats);

export default router;
