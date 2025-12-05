// /controllers/caseController.js
import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { generateCaseId } from "../utils/generateIds.js";

export const getCases = async (req, res) => {
  try {
    const Case = req.app.locals.models.Case;
    const { search, status, threatLevel, caseType } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { id: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { team: { $regex: search, $options: "i" } },
      ];
    }
    if (status && status !== "All") filter.status = status;
    if (threatLevel && threatLevel !== "All") filter.threatLevel = threatLevel;
    if (caseType && caseType !== "All") filter.caseType = caseType;

    const list = await Case.find(filter).sort({ createdOn: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cases" });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const Case = req.app.locals.models.Case;
    const c = await Case.findOne({ id: req.params.id });

    if (!c) return res.status(404).json({ error: "Case not found" });
    res.json(c);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch case" });
  }
};

export const createCase = async (req, res) => {
  try {
    const Case = req.app.locals.models.Case;
    let caseData = {};

    if (req.body.data) caseData = JSON.parse(req.body.data);
    else caseData = { ...req.body };

    ["incidentTime", "firstDetectionTime", "firstResponseTime"].forEach((field) => {
      if (caseData[field]) caseData[field] = new Date(caseData[field]);
    });

    const files = req.files || [];
    const caseId = generateCaseId();

    const evidenceItems = [];
    let faceSnapshotUrl = null;
    let primaryVideoUrl = null;

    for (const file of files) {
      const upload = await uploadToCloudinary(file, "cases");

      if (file.fieldname === "faceSnapshot") faceSnapshotUrl = upload.secure_url;
      else if (file.fieldname === "primaryVideoClip") primaryVideoUrl = upload.secure_url;
      else {
        evidenceItems.push({
          id: `E${Math.floor(100 + Math.random() * 900)}`,
          type: file.mimetype.startsWith("image/")
            ? "image"
            : file.mimetype.startsWith("video/")
            ? "video"
            : file.mimetype.includes("log")
            ? "log"
            : "document",
          name: file.originalname,
          thumb: upload.secure_url,
          cloudinaryPublicId: upload.public_id,
        });
      }
    }

    const payload = {
      id: caseId,
      ...caseData,
      evidence: evidenceItems,
      evidenceCount: evidenceItems.length,
      createdOn: new Date(),
      lastUpdated: new Date(),
    };

    if (caseData.caseType === "Face Recognition" && faceSnapshotUrl) {
      payload.faceRecognition = {
        ...caseData.faceRecognition,
        faceSnapshot: faceSnapshotUrl,
      };
    }

    if (primaryVideoUrl) {
      payload.videoAnalytics = {
        ...caseData.videoAnalytics,
        primaryVideoClip: primaryVideoUrl,
      };
    }

    const newCase = new Case(payload);
    const saved = await newCase.save();

    res.status(201).json({ success: true, case: saved });
  } catch (e) {
    res.status(500).json({ error: "Failed to create case" });
  }
};

export const updateCase = async (req, res) => {
  try {
    const Case = req.app.locals.models.Case;

    const updated = await Case.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, lastUpdated: new Date() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Case not found" });
    res.json({ success: true, case: updated });
  } catch (e) {
    res.status(500).json({ error: "Failed to update case" });
  }
};

export const addCaseEvidence = async (req, res) => {
  try {
    const Case = req.app.locals.models.Case;
    const files = req.files || [];

    const c = await Case.findOne({ id: req.params.id });
    if (!c) return res.status(404).json({ error: "Case not found" });

    for (const file of files) {
      const upload = await uploadToCloudinary(file, "cases");

      c.evidence.push({
        id: `E${Math.floor(100 + Math.random() * 900)}`,
        type: file.mimetype.startsWith("image/")
          ? "image"
          : file.mimetype.startsWith("video/")
          ? "video"
          : file.mimetype.includes("log")
          ? "log"
          : "document",
        name: file.originalname,
        thumb: upload.secure_url,
        cloudinaryPublicId: upload.public_id,
      });
    }

    c.evidenceCount = c.evidence.length;
    c.lastUpdated = new Date();

    const saved = await c.save();
    res.json({ success: true, case: saved });
  } catch (err) {
    res.status(500).json({ error: "Failed to add evidence" });
  }
};

export const deleteCase = async (req, res) => {
  try {
    const Case = req.app.locals.models.Case;

    const c = await Case.findOne({ id: req.params.id });
    if (!c) return res.status(404).json({ error: "Case not found" });

    // Delete cloudinary files
    for (const ev of c.evidence) {
      if (ev.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(ev.cloudinaryPublicId, {
          resource_type: "auto",
        });
      }
    }

    await Case.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: "Case deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete case" });
  }
};

export const getCaseStats = async (req, res) => {
  try {
    const Case = req.app.locals.models.Case;

    const totalCases = await Case.countDocuments();
    const criticalCases = await Case.countDocuments({
      threatLevel: { $in: ["Critical", "High"] },
    });
    const activeCases = await Case.countDocuments({
      status: { $in: ["Ongoing", "Under Investigation"] },
    });
    const casesWithFIR = await Case.countDocuments({
      "fir.number": { $exists: true, $ne: null },
    });

    res.json({
      success: true,
      stats: {
        totalCases,
        criticalCases,
        activeCases,
        casesWithFIR,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

export const quickUpdateCase = async (req, res) => {
  try {
    const Case = req.app.locals.models.Case;
    const { status, priority } = req.body;

    const updateData = { lastUpdated: new Date() };
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;

    const updated = await Case.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Case not found" });

    res.json({ success: true, case: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to quick-update case" });
  }
};
