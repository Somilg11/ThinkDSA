// Gemini API routes for validation and feedback
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// POST /api/validate-gemini-key
// Expects: { geminiKey: string }
router.post("/validate-gemini-key", async (req, res) => {
  const { geminiKey } = req.body;
  if (!geminiKey) {
    return res.status(400).json({ message: "Gemini API key is required." });
  }

  try {
    // Simple validation endpoint that just checks if the key is valid
    const geminiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models?key=" +
      geminiKey;

    const geminiRes = await fetch(geminiUrl);
    if (!geminiRes.ok) {
      const errorData = await geminiRes.json();
      return res.status(400).json({
        valid: false,
        message: errorData.error?.message || "Invalid API key",
      });
    }

    return res.json({ valid: true });
  } catch (err) {
    return res.status(500).json({
      valid: false,
      message: "Failed to validate API key",
    });
  }
});

// POST /api/gemini-feedback
// Expects: { pseudocode: string, geminiKey: string }
router.post("/gemini-feedback", async (req, res) => {
  const { pseudocode, geminiKey } = req.body;
  if (!pseudocode || !geminiKey) {
    return res
      .status(400)
      .json({ message: "Pseudocode and Gemini API key are required." });
  }
  try {
    // Gemini API endpoint (replace with the actual endpoint if different)
    const geminiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
      geminiKey;
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: pseudocode }] }],
      }),
    });
    const geminiData = await geminiRes.json();
    if (!geminiRes.ok) {
      return res
        .status(500)
        .json({ message: geminiData.error?.message || "Gemini API error" });
    }
    // Extract feedback from Gemini response
    const feedback =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No feedback received.";
    res.json({ feedback });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get feedback from Gemini API." });
  }
});

// POST /api/generate-questions
// Expects: { topicTitle: string, geminiKey: string }

router.post("/generate-questions", async (req, res) => {
  const { topicTitle, geminiKey } = req.body;

  if (!topicTitle || !geminiKey) {
    return res.status(400).json({ message: "Missing topic or Gemini API key." });
  }

  try {
    const geminiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
      geminiKey;

    const prompt = `Generate 5 unique coding questions on the topic "${topicTitle}".
Each should include:
- title
- difficulty (Easy, Medium, Hard)
- description (2-3 lines max)
Return result as a JSON array of objects.`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await geminiRes.json();
    if (!geminiRes.ok) {
      return res.status(500).json({ message: data.error?.message || "Failed to generate questions." });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let questions;
    try {
      questions = JSON.parse(text);
    } catch {
      return res.status(500).json({ message: "Gemini returned invalid JSON." });
    }

    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: "Gemini generation error." });
  }
});


export default router;
