import Resume from '../models/Resume.js';
import { asyncHandler } from '../middleware/error.js';

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
    templateId: body.templateId || d.templateId || 'modern',
    accentColor: body.accentColor || d.accentColor || '#1d4ed8',
    fontFamily: body.fontFamily || d.fontFamily || 'inter',
    fontSize: body.fontSize || d.fontSize || 'normal',
    sectionSpacing: body.sectionSpacing ?? d.sectionSpacing ?? 50,
    paragraphSpacing: body.paragraphSpacing ?? d.paragraphSpacing ?? 50,
    lineSpacing: body.lineSpacing ?? d.lineSpacing ?? 50,
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
