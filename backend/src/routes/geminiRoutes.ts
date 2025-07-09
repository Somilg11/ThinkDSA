import express from 'express';
import { generateQuestions } from '../controllers/geminiController';

const router = express.Router();
// POST /api/gemini/questions
router.post('/questions', generateQuestions);

export default router;
