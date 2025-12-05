// /controllers/evidenceController.js

export const getAllEvidences = async (req, res) => {
  try {
    const Evidence = req.app.locals.models.Evidence;
    const { type, search, status } = req.query;

    const filter = {};
    if (type && type !== "all") filter.type = type;
    if (status && status !== "all")
      filter.status = { $regex: status, $options: "i" };

    if (search)
      filter.$or = [
        { fileName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];

    const evidences = await Evidence.find(filter).sort({ lastUpdated: -1 });
    res.json(evidences);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch evidences" });
  }
};

export const getLiveEvidences = async (req, res) => {
  try {
    const Evidence = req.app.locals.models.Evidence;
    const live = await Evidence.find({ type: "live" }).sort({ lastUpdated: -1 });
    res.json(live);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch live evidences" });
  }
};

export const getUploadedEvidences = async (req, res) => {
  try {
    const Evidence = req.app.locals.models.Evidence;
    const uploaded = await Evidence.find({ type: "uploaded" }).sort({
      lastUpdated: -1,
    });
    res.json(uploaded);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch uploaded evidences" });
  }
};

export const getEvidenceById = async (req, res) => {
  try {
    const Evidence = req.app.locals.models.Evidence;
    const ev = await Evidence.findOne({ id: req.params.id });
    if (!ev) return res.status(404).json({ success: false, error: "Not found" });

    res.json({ success: true, data: ev });
  } catch (e) {
    res.status(500).json({ success: false, error: "Failed to fetch evidence" });
  }
};

export const createEvidence = async (req, res) => {
  try {
    const Evidence = req.app.locals.models.Evidence;
    const data = {
      id: `EVID-${Date.now().toString().slice(-6)}`,
      ...req.body,
      lastUpdated: new Date(),
    };

    const newEv = new Evidence(data);
    const saved = await newEv.save();

    res.status(201).json({ success: true, data: saved });
  } catch (e) {
    res.status(500).json({ success: false, error: "Failed to create evidence" });
  }
};

export const updateEvidence = async (req, res) => {
  try {
    const Evidence = req.app.locals.models.Evidence;

    const updated = await Evidence.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, lastUpdated: new Date() },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, error: "Evidence not found" });

    res.json({ success: true, data: updated });
  } catch (e) {
    res.status(500).json({ success: false, error: "Failed to update evidence" });
  }
};

export const deleteEvidence = async (req, res) => {
  try {
    const Evidence = req.app.locals.models.Evidence;

    const del = await Evidence.findOneAndDelete({ id: req.params.id });
    if (!del)
      return res.status(404).json({ success: false, error: "Evidence not found" });

    res.json({ success: true, message: "Evidence deleted" });
  } catch (e) {
    res.status(500).json({ success: false, error: "Failed to delete evidence" });
  }
};

export const getEvidenceStats = async (req, res) => {
  try {
    const Evidence = req.app.locals.models.Evidence;

    const totalEvidences = await Evidence.countDocuments();
    const liveEvidences = await Evidence.countDocuments({ type: "live" });
    const uploadedEvidences = await Evidence.countDocuments({ type: "uploaded" });
    const activeStreams = await Evidence.countDocuments({
      type: "live",
      status: "Active Stream",
    });
    const evidencesWithEvents = await Evidence.countDocuments({
      events: { $gt: 0 },
    });

    res.json({
      success: true,
      stats: {
        totalEvidences,
        liveEvidences,
        uploadedEvidences,
        activeStreams,
        evidencesWithEvents,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, error: "Failed to fetch stats" });
  }
};
