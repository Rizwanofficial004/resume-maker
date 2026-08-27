import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  improveText,
  generateSummary,
  suggestBullets,
  generateCoverLetter,
  suggestKeywords,
  spellCheck,
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many AI requests, please slow down' },
});

router.use(protect, aiLimiter);

router.post('/improve', improveText);
router.post('/summary', generateSummary);
router.post('/bullets', suggestBullets);
router.post('/cover-letter', generateCoverLetter);
router.post('/keywords', suggestKeywords);
router.post('/spell-check', spellCheck);

export default router;
