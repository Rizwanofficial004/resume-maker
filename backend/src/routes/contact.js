import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../middleware/error.js';
import ContactMessage from '../models/ContactMessage.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many contact submissions, please try again later' },
});

router.post(
  '/',
  contactLimiter,
  asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400);
      throw new Error('Name, email, and message are required');
    }
    if (String(message).length > 5000) {
      res.status(400);
      throw new Error('Message is too long (max 5000 characters)');
    }

    await ContactMessage.create({
      name: String(name).trim().slice(0, 200),
      email: String(email).trim().toLowerCase().slice(0, 320),
      message: String(message).trim(),
    });

    res.json({ message: 'Your message has been received. We will get back to you within 24 hours.' });
  })
);

export default router;
