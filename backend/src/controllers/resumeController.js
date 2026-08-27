import Resume from '../models/Resume.js';
import { asyncHandler } from '../middleware/error.js';
import { withCredit } from '../utils/aiCredits.js';
import { extractResumeText, parseResumeWithAi } from '../utils/resumeImport.js';

const DEFAULT_TEMPLATE_ID = 'onyx';
const DEFAULT_ACCENT = '#1d4ed8';

export const getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(resumes);
});

export const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }
  res.json(resume);
});

export const createResume = asyncHandler(async (req, res) => {
  const body = req.body;
  const d = body.data || body;

  const count = await Resume.countDocuments({ user: req.user._id });

  const resume = await Resume.create({
    user: req.user._id,
    title: body.title || d.title || 'Untitled Resume',
    templateId: body.templateId || d.templateId || DEFAULT_TEMPLATE_ID,
    accentColor: body.accentColor || d.accentColor || DEFAULT_ACCENT,
    fontFamily: body.fontFamily || d.fontFamily || 'inter',
    fontSize: body.fontSize || d.fontSize || 'normal',
    sectionSpacing: body.sectionSpacing ?? d.sectionSpacing ?? 16,
    paragraphSpacing: body.paragraphSpacing ?? d.paragraphSpacing ?? 8,
    lineSpacing: body.lineSpacing ?? d.lineSpacing ?? 1.5,
    sectionOrder: body.sectionOrder || d.sectionOrder || undefined,
    personal: d.personal || undefined,
    experience: d.experience || undefined,
    education: d.education || undefined,
    skills: d.skills || undefined,
    projects: d.projects || undefined,
    certifications: d.certifications || undefined,
    languages: d.languages || undefined,
    awards: d.awards || undefined,
    websites: d.websites || undefined,
    hobbies: d.hobbies || undefined,
    references: d.references || undefined,
    customSections: d.customSections || undefined,
    isDefault: count === 0,
  });

  res.status(201).json(resume);
});

/**
 * Upload PDF/DOCX → extract text → AI map to schema → create resume.
 * Costs 1 AI credit (refunded on failure).
 */
export const importResume = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) {
    res.status(400);
    throw new Error('Please upload a PDF or DOCX resume file.');
  }

  let text;
  try {
    text = await extractResumeText(req.file.buffer, req.file.mimetype, req.file.originalname);
  } catch (err) {
    if (err.statusCode) throw err;
    const error = new Error('Could not read that file. Try another PDF or DOCX.');
    error.statusCode = 400;
    throw error;
  }

  if (!text || text.length < 40) {
    res.status(400);
    throw new Error(
      'Could not extract enough text from this file. Scanned image PDFs are not supported — use a text PDF or DOCX.'
    );
  }

  const { result: parsed, aiCredits } = await withCredit(req.user, () => parseResumeWithAi(text));

  const count = await Resume.countDocuments({ user: req.user._id });
  const titleFromName = [parsed.personal?.firstName, parsed.personal?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
  const title =
    (typeof req.body?.title === 'string' && req.body.title.trim()) ||
    (titleFromName ? `${titleFromName} Resume` : 'Imported Resume');

  const resume = await Resume.create({
    user: req.user._id,
    title,
    templateId: req.body?.templateId || DEFAULT_TEMPLATE_ID,
    accentColor: req.body?.accentColor || DEFAULT_ACCENT,
    fontFamily: 'inter',
    fontSize: 'normal',
    sectionSpacing: 16,
    paragraphSpacing: 8,
    lineSpacing: 1.5,
    personal: parsed.personal,
    experience: parsed.experience,
    education: parsed.education,
    skills: parsed.skills,
    projects: parsed.projects,
    certifications: parsed.certifications,
    languages: parsed.languages,
    awards: parsed.awards,
    hobbies: parsed.hobbies,
    references: parsed.references,
    isDefault: count === 0,
  });

  const payload = resume.toObject();
  payload.aiCredits = aiCredits;
  res.status(201).json(payload);
});

export const updateResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  const body = req.body;
  const d = body.data || body;

  if (body.title !== undefined) resume.title = body.title;
  if (body.templateId !== undefined) resume.templateId = body.templateId;
  if (body.accentColor !== undefined) resume.accentColor = body.accentColor;
  if (body.fontFamily !== undefined) resume.fontFamily = body.fontFamily;
  if (body.fontSize !== undefined) resume.fontSize = body.fontSize;
  if (body.sectionSpacing !== undefined) resume.sectionSpacing = body.sectionSpacing;
  if (body.paragraphSpacing !== undefined) resume.paragraphSpacing = body.paragraphSpacing;
  if (body.lineSpacing !== undefined) resume.lineSpacing = body.lineSpacing;
  if (body.sectionOrder !== undefined) resume.sectionOrder = body.sectionOrder;
  if (body.hobbies !== undefined) resume.hobbies = body.hobbies;
  if (body.references !== undefined) resume.references = body.references;
  if (body.awards !== undefined) resume.awards = body.awards;
  if (body.websites !== undefined) resume.websites = body.websites;

  if (d.personal !== undefined) resume.personal = d.personal;
  if (d.experience !== undefined) resume.experience = d.experience;
  if (d.education !== undefined) resume.education = d.education;
  if (d.skills !== undefined) resume.skills = d.skills;
  if (d.projects !== undefined) resume.projects = d.projects;
  if (d.certifications !== undefined) resume.certifications = d.certifications;
  if (d.languages !== undefined) resume.languages = d.languages;
  if (d.references !== undefined) resume.references = d.references;
  if (d.customSections !== undefined) resume.customSections = d.customSections;
  if (body.atsScore !== undefined || d.atsScore !== undefined) {
    resume.atsScore = body.atsScore ?? d.atsScore;
  }

  const updated = await resume.save();
  res.json(updated);
});

export const duplicateResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  const copy = resume.toObject();
  delete copy._id;
  delete copy.createdAt;
  delete copy.updatedAt;
  copy.title = `${resume.title} (copy)`;
  copy.isDefault = false;

  const created = await Resume.create(copy);
  res.status(201).json(created);
});

export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }
  res.json({ message: 'Resume deleted', id: req.params.id });
});
