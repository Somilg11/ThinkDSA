import { Request, Response } from 'express'
const { GoogleGenerativeAI } = require("@google/generative-ai");


export const generateQuestions = async (req: Request, res: Response) => {
  const { prompt, geminiKey } = req.body;

  if (!prompt || !geminiKey) {
    return res.status(400).json({ message: 'Missing prompt or key' });
  }

  try {
    const ai = new GoogleGenerativeAI(geminiKey);
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Or 'gemini-pro'

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.json({ feedback: text });
  } catch (e: any) {
    console.error("Gemini API Error:", e.message);
    return res.status(500).json({ message: e.message });
  }
};