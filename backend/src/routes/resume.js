import { Router } from 'express';
import {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  duplicateResume,
  deleteResume,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.route('/').get(getResumes).post(createResume);
router.post('/:id/duplicate', duplicateResume);
router.route('/:id').get(getResumeById).put(updateResume).delete(deleteResume);

export default router;
