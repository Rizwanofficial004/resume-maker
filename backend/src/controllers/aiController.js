import User from '../models/User.js';
import { asyncHandler } from '../middleware/error.js';
import { callOpenRouter, cleanJsonString } from '../utils/openrouter.js';

const AI_SYSTEM = `You are an expert resume writer and career coach. You write concise, achievement-oriented, ATS-friendly content for resumes and cover letters. Use strong action verbs, quantify results whenever possible, and avoid fluff and first-person pronouns (I, my, we) in resume bullets. Return only the requested content with no extra commentary.`;

function ensureAiConfigured() {
  if (!process.env.OPENROUTER_API_KEY) {
    const error = new Error('OpenRouter API key is not configured on the server');
    error.statusCode = 503;
    throw error;
  }
}

async function consumeCredit(user) {
  if (user.aiCredits <= 0) {
    const error = new Error('You have no AI credits left. Please upgrade your plan.');
    error.statusCode = 402;
    throw error;
  }
  user.aiCredits -= 1;
  await user.save();
}

export const improveText = asyncHandler(async (req, res) => {
  const { text, context } = req.body;
  if (!text || !text.trim()) {
    res.status(400);
    throw new Error('Text is required');
  }

  ensureAiConfigured();
  await consumeCredit(req.user);

  const messages = [
    { role: 'system', content: AI_SYSTEM },
    {
      role: 'user',
      content: `Improve the following resume bullet point / summary to be more professional, concise, and achievement-oriented. Keep the same meaning but make it stronger. Context: ${context || 'resume'}\n\nText: "${text}"`,
    },
  ];

  const improved = await callOpenRouter(messages, { max_tokens: 400 });
  res.json({ result: improved });
});

export const generateSummary = asyncHandler(async (req, res) => {
  const { personal, experience, jobTitle } = req.body;

  ensureAiConfigured();
  await consumeCredit(req.user);

  const experienceSnippet = (experience || [])
    .slice(0, 3)
    .map((e) => `${e.jobTitle || 'Role'} at ${e.company || 'Company'}`)
    .join(', ');

  const messages = [
    { role: 'system', content: AI_SYSTEM },
    {
      role: 'user',
      content: `Write a professional resume summary (3-5 sentences) for a ${jobTitle || personal?.jobTitle || 'professional'}. Name: ${personal?.firstName || ''} ${personal?.lastName || ''}. Relevant experience: ${experienceSnippet || 'Not provided'}. Return only the summary text.`,
    },
  ];

  const summary = await callOpenRouter(messages, { max_tokens: 350 });
  res.json({ result: summary });
});

export const suggestBullets = asyncHandler(async (req, res) => {
  const { jobTitle, company, description, existing } = req.body;
  if (!jobTitle && !company) {
    res.status(400);
    throw new Error('Job title or company is required');
  }

  ensureAiConfigured();
  await consumeCredit(req.user);

  const messages = [
    { role: 'system', content: AI_SYSTEM },
    {
      role: 'user',
      content: `Generate 4 achievement-oriented bullet points for a resume entry as ${jobTitle || 'Professional'} at ${company || 'a company'}. Context from the user: ${description || 'Not provided'}. Return ONLY a JSON array of strings, like: ["Achieved...", "Led...", "Improved...", "Collaborated..."].`,
    },
  ];

  const raw = await callOpenRouter(messages, { max_tokens: 600 });
  let bullets = [];
  try {
    bullets = JSON.parse(cleanJsonString(raw));
  } catch (e) {
    bullets = raw
      .split('\n')
      .map((l) => l.replace(/^[-•*\d.]+/, '').trim())
      .filter(Boolean);
  }

  res.json({ result: Array.isArray(bullets) ? bullets.slice(0, 5) : [] });
});

export const generateCoverLetter = asyncHandler(async (req, res) => {
  const { recipientName, companyName, jobTitle, body, experience } = req.body;
  if (!companyName || !jobTitle) {
    res.status(400);
    throw new Error('Company and job title are required');
  }

  ensureAiConfigured();
  await consumeCredit(req.user);

  const highlights = (experience || [])
    .slice(0, 3)
    .map((e) => `${e.jobTitle || 'Role'} at ${e.company || 'Company'}`)
    .join(', ');

  const messages = [
    { role: 'system', content: AI_SYSTEM },
    {
      role: 'user',
      content: `Write a professional cover letter in plain text for a ${jobTitle} position at ${companyName}. Addressee: ${recipientName || 'Hiring Manager'}. Sender context/experience: ${highlights || body || 'Not provided'}. Keep it to 3 short paragraphs, confident and specific. Return only the letter body.`,
    },
  ];

  const letter = await callOpenRouter(messages, { max_tokens: 700 });
  res.json({ result: letter });
});

export const suggestKeywords = asyncHandler(async (req, res) => {
  const { jobTitle } = req.body;
  if (!jobTitle) {
    res.status(400);
    throw new Error('Job title is required');
  }

  ensureAiConfigured();
  await consumeCredit(req.user);

  const messages = [
    { role: 'system', content: AI_SYSTEM },
    {
      role: 'user',
      content: `List the 15 most important ATS keywords and skills for the role "${jobTitle}". Return ONLY a JSON array of strings, like: ["Keyword 1", "Keyword 2"].`,
    },
  ];

  const raw = await callOpenRouter(messages, { max_tokens: 300 });
  let keywords = [];
  try {
    keywords = JSON.parse(cleanJsonString(raw));
  } catch (e) {
    keywords = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  }

  res.json({ result: Array.isArray(keywords) ? keywords.slice(0, 15) : [] });
});
