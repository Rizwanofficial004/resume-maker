import { Router } from 'express';
import {
  getCoverLetters,
  getCoverLetterById,
  createCoverLetter,
  updateCoverLetter,
  deleteCoverLetter,
} from '../controllers/coverLetterController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.route('/').get(getCoverLetters).post(createCoverLetter);
router.route('/:id').get(getCoverLetterById).put(updateCoverLetter).delete(deleteCoverLetter);

export default router;
