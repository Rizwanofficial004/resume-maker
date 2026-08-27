import CoverLetter from '../models/CoverLetter.js';
import { asyncHandler } from '../middleware/error.js';

const ALLOWED_FIELDS = [
  'title',
  'recipientName',
  'companyName',
  'jobTitle',
  'senderName',
  'senderEmail',
  'senderPhone',
  'date',
  'body',
  'closing',
];

function pickAllowed(source = {}) {
  const out = {};
  for (const key of ALLOWED_FIELDS) {
    if (source[key] !== undefined) out[key] = source[key];
  }
  return out;
}

export const getCoverLetters = asyncHandler(async (req, res) => {
  const letters = await CoverLetter.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(letters);
});

export const getCoverLetterById = asyncHandler(async (req, res) => {
  const letter = await CoverLetter.findOne({ _id: req.params.id, user: req.user._id });
  if (!letter) {
    res.status(404);
    throw new Error('Cover letter not found');
  }
  res.json(letter);
});

export const createCoverLetter = asyncHandler(async (req, res) => {
  const { title, data } = req.body;
  const fields = pickAllowed({ ...(data || {}), ...(title !== undefined ? { title } : {}) });
  const letter = await CoverLetter.create({
    user: req.user._id,
    ...fields,
    title: fields.title || 'Untitled Cover Letter',
  });
  res.status(201).json(letter);
});

export const updateCoverLetter = asyncHandler(async (req, res) => {
  const letter = await CoverLetter.findOne({ _id: req.params.id, user: req.user._id });
  if (!letter) {
    res.status(404);
    throw new Error('Cover letter not found');
  }
  const { title, data } = req.body;
  const fields = pickAllowed({ ...(data || {}), ...(title !== undefined ? { title } : {}) });
  Object.assign(letter, fields);
  const updated = await letter.save();
  res.json(updated);
});

export const deleteCoverLetter = asyncHandler(async (req, res) => {
  const letter = await CoverLetter.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!letter) {
    res.status(404);
    throw new Error('Cover letter not found');
  }
  res.json({ message: 'Cover letter deleted', id: req.params.id });
});
