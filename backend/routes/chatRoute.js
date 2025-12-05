// routes/chatRoute.js
const express = require("express");
const Folder = require("../models/Folder.js");
const model = require("../config/gemini.js");

const router = express.Router();


/*
|--------------------------------------------------------------------------
| POST /api/chat/ask
| User Question → Fetch Full Folder Data → Send to Gemini → Return Answer
|--------------------------------------------------------------------------
*/
router.post("/ask", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // 1️⃣ Fetch all folders (which include videos + frames + stats)
    const folders = await Folder.find({}).lean();

    // 2️⃣ Build AI prompt using the FULL dataset
    const prompt = `
You are an AI Surveillance & Video Analytics Assistant.
You must answer ONLY using the dataset provided below.

=========================
📁 FOLDER DATA (Videos, Frames, Stats)
=========================
${JSON.stringify(folders, null, 2)}
=========================

USER QUESTION:
"${query}"

STRICT RESPONSE RULES:
- Use ONLY the above dataset for answers.
- DO NOT hallucinate or guess.
- If information is missing, reply: "This information is not available in the processed data."
- Provide timeline-based explanations when relevant.
- If user asks about weapons, anomalies, faces, or threat levels, refer to the exact fields inside the dataset.
`;

    // 3️⃣ Send prompt to Gemini
    const response = await model.generateContent(prompt);
    const aiAnswer = response.response.text();

    // 4️⃣ Send back AI reply to frontend
    res.json({ answer: aiAnswer });

  } catch (error) {
    console.error("❌ Gemini AI Error:", error);
    res.status(500).json({ error: "AI processing failed" });
  }
});


module.exports = router;
