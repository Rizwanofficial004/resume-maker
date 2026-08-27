import mammoth from 'mammoth';
import { callOpenRouter } from './openrouter.js';

const MAX_TEXT_CHARS = 28000;

function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function stripHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function clamp(str, max = 2000) {
  const s = stripHtml(String(str ?? ''));
  return s.length > max ? s.slice(0, max) : s;
}

function asBullets(value) {
  if (Array.isArray(value)) {
    return value
      .map((b) => {
        if (typeof b === 'string') return { text: clamp(b, 500) };
        if (b && typeof b === 'object') return { text: clamp(b.text || '', 500) };
        return null;
      })
      .filter((b) => b && b.text);
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/\n|•|●/)
      .map((t) => clamp(t.replace(/^[-*]\s*/, ''), 500))
      .filter(Boolean)
      .map((text) => ({ text }));
  }
  return [];
}

function cleanObjectJson(str) {
  const cleaned = String(str || '')
    .replace(/```json|```/g, '')
    .trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.slice(start, end + 1);
  }
  return cleaned;
}

/**
 * Extract plain text from PDF or DOCX buffer.
 */
export async function extractResumeText(buffer, mimeType, originalName = '') {
  const name = (originalName || '').toLowerCase();
  const isPdf =
    mimeType === 'application/pdf' ||
    name.endsWith('.pdf') ||
    buffer.slice(0, 5).toString() === '%PDF-';
  const isDocx =
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword' ||
    name.endsWith('.docx') ||
    name.endsWith('.doc');

  if (isPdf) {
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const data = await parser.getText();
      return (data?.text || '').trim();
    } finally {
      if (typeof parser.destroy === 'function') await parser.destroy();
    }
  }

  if (isDocx) {
    const result = await mammoth.extractRawText({ buffer });
    return (result?.value || '').trim();
  }

  const error = new Error('Unsupported file type. Please upload a PDF or DOCX resume.');
  error.statusCode = 400;
  throw error;
}

const PARSE_SYSTEM = `You are a strict resume extraction engine. Convert resume text into a JSON object matching our schema exactly.
Extract only explicitly stated information. Never fabricate. Keep original wording and language. When uncertain, omit or leave empty.
Return ONLY one raw JSON object — no markdown, no commentary.`;

const SCHEMA_HINT = `{
  "personal": {
    "firstName": "", "lastName": "", "jobTitle": "", "email": "", "phone": "",
    "phoneCode": "", "address": "", "city": "", "state": "", "zip": "", "country": "",
    "website": "", "linkedin": "", "summary": ""
  },
  "experience": [{
    "jobTitle": "", "company": "", "location": "", "startDate": "", "endDate": "",
    "current": false, "description": ["bullet 1", "bullet 2"]
  }],
  "education": [{
    "school": "", "degree": "", "fieldOfStudy": "", "location": "",
    "startDate": "", "endDate": "", "current": false, "description": ""
  }],
  "skills": [{ "name": "", "level": 3 }],
  "projects": [{ "name": "", "link": "", "startDate": "", "endDate": "", "description": ["bullet"] }],
  "certifications": [{ "name": "", "issuer": "", "date": "", "link": "" }],
  "languages": [{ "name": "", "proficiency": "Fluent" }],
  "awards": [{ "name": "", "date": "", "issuer": "", "description": "" }],
  "hobbies": "",
  "references": ""
}`;

/**
 * Use OpenRouter to map extracted text into our resume schema.
 */
export async function parseResumeWithAi(text) {
  const truncated = text.length > MAX_TEXT_CHARS ? text.slice(0, MAX_TEXT_CHARS) : text;
  const messages = [
    { role: 'system', content: PARSE_SYSTEM },
    {
      role: 'user',
      content: `Map this resume text into JSON matching this schema:\n${SCHEMA_HINT}\n\nRules:\n- skill level is 0-5 (default 3 if unknown)\n- experience/project description: array of bullet strings\n- dates: keep as written\n- split full name into firstName/lastName when possible\n- phoneCode only if country code is explicit\n\nResume text:\n"""\n${truncated}\n"""`,
    },
  ];

  const raw = await callOpenRouter(messages, {
    max_tokens: 4000,
    temperature: 0.2,
    timeoutMs: 90000,
  });

  let parsed;
  try {
    parsed = JSON.parse(cleanObjectJson(raw));
  } catch {
    const error = new Error('Could not parse resume content. Try a clearer PDF or DOCX.');
    error.statusCode = 422;
    throw error;
  }

  return sanitizeParsedResume(parsed);
}

export function sanitizeParsedResume(raw) {
  const p = raw?.personal && typeof raw.personal === 'object' ? raw.personal : {};

  const personal = {
    firstName: clamp(p.firstName, 80),
    lastName: clamp(p.lastName, 80),
    jobTitle: clamp(p.jobTitle, 120),
    email: clamp(p.email, 120),
    phone: clamp(p.phone, 40),
    phoneCode: clamp(p.phoneCode || '+92', 12),
    address: clamp(p.address, 200),
    city: clamp(p.city, 80),
    state: clamp(p.state, 80),
    zip: clamp(p.zip, 20),
    country: clamp(p.country, 80),
    website: clamp(p.website, 200),
    linkedin: clamp(p.linkedin, 200),
    summary: clamp(p.summary, 3000),
    photo: '',
    additionalInfo: '',
  };

  const experience = (Array.isArray(raw?.experience) ? raw.experience : [])
    .slice(0, 20)
    .map((e) => ({
      id: uid('exp'),
      jobTitle: clamp(e?.jobTitle, 120),
      company: clamp(e?.company, 120),
      location: clamp(e?.location, 120),
      startDate: clamp(e?.startDate, 40),
      endDate: clamp(e?.endDate, 40),
      current: Boolean(e?.current),
      description: asBullets(e?.description).slice(0, 12),
    }))
    .filter((e) => e.jobTitle || e.company || e.description.length);

  const education = (Array.isArray(raw?.education) ? raw.education : [])
    .slice(0, 15)
    .map((e) => ({
      id: uid('edu'),
      school: clamp(e?.school, 150),
      degree: clamp(e?.degree, 120),
      fieldOfStudy: clamp(e?.fieldOfStudy, 120),
      location: clamp(e?.location, 120),
      startDate: clamp(e?.startDate, 40),
      endDate: clamp(e?.endDate, 40),
      current: Boolean(e?.current),
      description: clamp(e?.description, 1000),
    }))
    .filter((e) => e.school || e.degree);

  const skills = (Array.isArray(raw?.skills) ? raw.skills : [])
    .slice(0, 40)
    .map((s) => {
      const name = typeof s === 'string' ? s : s?.name;
      let level = typeof s === 'object' ? Number(s?.level) : 3;
      if (!Number.isFinite(level) || level < 0 || level > 5) level = 3;
      return { id: uid('skill'), name: clamp(name, 80), level };
    })
    .filter((s) => s.name);

  const projects = (Array.isArray(raw?.projects) ? raw.projects : [])
    .slice(0, 15)
    .map((pr) => ({
      id: uid('proj'),
      name: clamp(pr?.name, 150),
      link: clamp(pr?.link, 300),
      startDate: clamp(pr?.startDate, 40),
      endDate: clamp(pr?.endDate, 40),
      description: asBullets(pr?.description).slice(0, 10),
    }))
    .filter((pr) => pr.name || pr.description.length);

  const certifications = (Array.isArray(raw?.certifications) ? raw.certifications : [])
    .slice(0, 20)
    .map((c) => ({
      id: uid('cert'),
      name: clamp(c?.name, 150),
      issuer: clamp(c?.issuer, 120),
      date: clamp(c?.date, 40),
      link: clamp(c?.link, 300),
    }))
    .filter((c) => c.name);

  const languages = (Array.isArray(raw?.languages) ? raw.languages : [])
    .slice(0, 15)
    .map((l) => ({
      id: uid('lang'),
      name: clamp(typeof l === 'string' ? l : l?.name, 80),
      proficiency: clamp(
        (typeof l === 'object' && l?.proficiency) || 'Fluent',
        40
      ),
    }))
    .filter((l) => l.name);

  const awards = (Array.isArray(raw?.awards) ? raw.awards : [])
    .slice(0, 15)
    .map((a) => ({
      id: uid('award'),
      name: clamp(a?.name, 150),
      date: clamp(a?.date, 40),
      issuer: clamp(a?.issuer, 120),
      description: clamp(a?.description, 500),
    }))
    .filter((a) => a.name);

  return {
    personal,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    awards,
    hobbies: clamp(raw?.hobbies, 500),
    references: clamp(raw?.references, 1000),
  };
}
