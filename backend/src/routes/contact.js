import { Router } from 'express';
import { asyncHandler } from '../middleware/error.js';
import { callOpenRouter } from '../utils/openrouter.js';

const router = Router();

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400);
      throw new Error('Name, email, and message are required');
    }
    res.json({ message: 'Your message has been received. We will get back to you within 24 hours.' });
  })
);

router.post(
  '/spell-check',
  asyncHandler(async (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.json({ corrections: [] });
    }
    try {
      const messages = [
        { role: 'system', content: 'You are a spell checker. Given text, return a JSON array of corrections. Each correction has: original, corrected, position. If no errors, return an empty array. Only return the JSON array, no other text.' },
        { role: 'user', content: `Check spelling in this text and return corrections as JSON array:\n\n"${text}"` },
      ];
      const raw = await callOpenRouter(messages, { max_tokens: 600, temperature: 0.1 });
      let corrections = [];
      try {
        const cleaned = raw.replace(/```json|```/g, '').trim();
        corrections = JSON.parse(cleaned);
      } catch { corrections = []; }
      res.json({ corrections: Array.isArray(corrections) ? corrections : [] });
    } catch {
      res.json({ corrections: [] });
    }
  })
);

export default router;
