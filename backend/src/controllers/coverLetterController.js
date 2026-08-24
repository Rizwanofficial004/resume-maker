import CoverLetter from '../models/CoverLetter.js';
import { asyncHandler } from '../middleware/error.js';

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
  const letter = await CoverLetter.create({
    user: req.user._id,
    title: title || 'Untitled Cover Letter',
    ...(data || {}),
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
  if (title !== undefined) letter.title = title;
  if (data) {
    Object.assign(letter, data);
  }
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
