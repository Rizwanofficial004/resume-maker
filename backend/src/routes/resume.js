import { Router } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  duplicateResume,
  deleteResume,
  importResume,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const name = (file.originalname || '').toLowerCase();
    const okMime = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/octet-stream',
    ].includes(file.mimetype);
    const okExt = name.endsWith('.pdf') || name.endsWith('.docx') || name.endsWith('.doc');
    if (okMime || okExt) return cb(null, true);
    cb(new Error('Only PDF and DOCX files are allowed'));
  },
});

const importLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many import requests, please slow down' },
});

router.use(protect);

router.route('/').get(getResumes).post(createResume);
router.post('/import', importLimiter, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      err.statusCode = err.code === 'LIMIT_FILE_SIZE' ? 400 : 400;
      err.message =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'File is too large (max 5MB).'
          : err.message || 'Upload failed';
      return next(err);
    }
    next();
  });
}, importResume);
router.post('/:id/duplicate', duplicateResume);
router.route('/:id').get(getResumeById).put(updateResume).delete(deleteResume);

export default router;
