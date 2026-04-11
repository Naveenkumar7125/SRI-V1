// routes/chatRoute.js
const express = require("express");
const model = require("../config/gemini.js");
const uploadRoute = require("../upload.js"); // Get the in-memory store

const router = express.express ? express.Router() : require('express').Router();

router.post("/ask", async (req, res) => {
  try {
    const { query, folderId } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const store = uploadRoute.analysisStore || {};
    const folderData = folderId && store[folderId] ? store[folderId] : store;

    // Build AI prompt using the analysis dataset
    const prompt = `
You are an AI Surveillance & Video Analytics Assistant.
You must answer ONLY using the dataset provided below.

=========================
📁 ANALYSIS DATA (Videos, Frames, Stats)
=========================
${JSON.stringify(folderData, null, 2)}
=========================

USER QUESTION:
"${query}"

STRICT RESPONSE RULES:
- Use ONLY the above dataset for answers.
- DO NOT hallucinate or guess.
- If information is missing, reply: "This information is not available in the processed data."
- Provide timeline-based explanations when relevant.
`;

    const response = await model.generateContent(prompt);
    let aiAnswer = "";
    // Wait, the API structure might be slightly different in google/generative-ai
    if (response && response.response && typeof response.response.text === 'function') {
        aiAnswer = response.response.text();
    } else {
        aiAnswer = response.text || "No response text available";
    }

    res.json({ answer: aiAnswer });

  } catch (error) {
    console.error("❌ AI Error:", error);
    res.status(500).json({ error: "AI processing failed" });
  }
});


module.exports = router;
