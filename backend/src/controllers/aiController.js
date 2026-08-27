import { asyncHandler } from '../middleware/error.js';
import { callOpenRouter, cleanJsonString } from '../utils/openrouter.js';
import { withCredit } from '../utils/aiCredits.js';

const AI_SYSTEM = `You are an expert resume writer and career coach. You write concise, achievement-oriented, ATS-friendly content for resumes and cover letters. Use strong action verbs, quantify results whenever possible, and avoid fluff and first-person pronouns (I, my, we) in resume bullets. Return only the requested content with no extra commentary.`;

export const improveText = asyncHandler(async (req, res) => {
  const { text, context } = req.body;
  if (!text || !text.trim()) {
    res.status(400);
    throw new Error('Text is required');
  }

  const messages = [
    { role: 'system', content: AI_SYSTEM },
    {
      role: 'user',
      content: `Improve the following resume bullet point / summary to be more professional, concise, and achievement-oriented. Keep the same meaning but make it stronger. Context: ${context || 'resume'}\n\nText: "${text}"`,
    },
  ];

  const { result, aiCredits } = await withCredit(req.user, () =>
    callOpenRouter(messages, { max_tokens: 400 })
  );
  res.json({ result, aiCredits });
});

export const generateSummary = asyncHandler(async (req, res) => {
  const { personal, experience, skills, jobTitle } = req.body;

  const experienceSnippet = (experience || [])
    .slice(0, 3)
    .map((e) => `${e.jobTitle || 'Role'} at ${e.company || 'Company'}`)
    .join(', ');

  const skillsSnippet = Array.isArray(skills)
    ? skills
        .map((g) => g.name || g)
        .filter(Boolean)
        .slice(0, 12)
        .join(', ')
    : '';

  const messages = [
    { role: 'system', content: AI_SYSTEM },
    {
      role: 'user',
      content: `Write a professional resume summary (3-5 sentences) for a ${jobTitle || personal?.jobTitle || 'professional'}. Name: ${personal?.firstName || ''} ${personal?.lastName || ''}. Relevant experience: ${experienceSnippet || 'Not provided'}. Skills: ${skillsSnippet || 'Not provided'}. Return only the summary text.`,
    },
  ];

  const { result, aiCredits } = await withCredit(req.user, () =>
    callOpenRouter(messages, { max_tokens: 350 })
  );
  res.json({ result, aiCredits });
});

export const suggestBullets = asyncHandler(async (req, res) => {
  const { jobTitle, company, description, existing } = req.body;
  if (!jobTitle && !company) {
    res.status(400);
    throw new Error('Job title or company is required');
  }

  const existingNote =
    Array.isArray(existing) && existing.length
      ? ` Avoid duplicating these existing bullets: ${existing.slice(0, 5).join(' | ')}.`
      : '';

  const messages = [
    { role: 'system', content: AI_SYSTEM },
    {
      role: 'user',
      content: `Generate 4 achievement-oriented bullet points for a resume entry as ${jobTitle || 'Professional'} at ${company || 'a company'}. Context from the user: ${description || 'Not provided'}.${existingNote} Return ONLY a JSON array of strings, like: ["Achieved...", "Led...", "Improved...", "Collaborated..."].`,
    },
  ];

  const { result: raw, aiCredits } = await withCredit(req.user, () =>
    callOpenRouter(messages, { max_tokens: 600 })
  );

  let bullets = [];
  try {
    bullets = JSON.parse(cleanJsonString(raw));
  } catch {
    bullets = raw
      .split('\n')
      .map((l) => l.replace(/^[-•*\d.]+/, '').trim())
      .filter(Boolean);
  }

  res.json({ result: Array.isArray(bullets) ? bullets.slice(0, 5) : [], aiCredits });
});

export const generateCoverLetter = asyncHandler(async (req, res) => {
  const { recipientName, companyName, jobTitle, body, experience } = req.body;
  if (!companyName || !jobTitle) {
    res.status(400);
    throw new Error('Company and job title are required');
  }

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

  const { result, aiCredits } = await withCredit(req.user, () =>
    callOpenRouter(messages, { max_tokens: 700 })
  );
  res.json({ result, aiCredits });
});

export const suggestKeywords = asyncHandler(async (req, res) => {
  const { jobTitle, existingSkills } = req.body;
  if (!jobTitle) {
    res.status(400);
    throw new Error('Job title is required');
  }

  const existingNote =
    Array.isArray(existingSkills) && existingSkills.length
      ? ` Avoid duplicating these skills the user already has: ${existingSkills.slice(0, 20).join(', ')}.`
      : '';

  const messages = [
    { role: 'system', content: AI_SYSTEM },
    {
      role: 'user',
      content: `List the 15 most important ATS keywords and skills for the role "${jobTitle}".${existingNote} Return ONLY a JSON array of strings, like: ["Keyword 1", "Keyword 2"].`,
    },
  ];

  const { result: raw, aiCredits } = await withCredit(req.user, () =>
    callOpenRouter(messages, { max_tokens: 300 })
  );

  let keywords = [];
  try {
    keywords = JSON.parse(cleanJsonString(raw));
  } catch {
    keywords = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  }

  res.json({ result: Array.isArray(keywords) ? keywords.slice(0, 15) : [], aiCredits });
});

export const spellCheck = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.json({ corrections: [], aiCredits: req.user.aiCredits });
  }

  const messages = [
    {
      role: 'system',
      content:
        'You are a spell checker. Given text, return a JSON array of corrections. Each correction has: original, corrected, position. If no errors, return an empty array. Only return the JSON array, no other text.',
    },
    {
      role: 'user',
      content: `Check spelling in this text and return corrections as JSON array:\n\n"${text}"`,
    },
  ];

  const { result: raw, aiCredits } = await withCredit(req.user, () =>
    callOpenRouter(messages, { max_tokens: 600, temperature: 0.1 })
  );

  let corrections = [];
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    corrections = JSON.parse(cleaned);
  } catch {
    corrections = [];
  }

  res.json({ corrections: Array.isArray(corrections) ? corrections : [], aiCredits });
});
