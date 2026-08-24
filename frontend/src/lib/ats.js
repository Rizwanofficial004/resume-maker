const ROLE_KEYWORDS = {
  frontend: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Responsive Design', 'Accessibility', 'Testing', 'REST APIs', 'Performance'],
  backend: ['Node.js', 'Python', 'APIs', 'REST', 'MongoDB', 'SQL', 'Microservices', 'Docker', 'Testing', 'Caching'],
  fullstack: ['React', 'Node.js', 'TypeScript', 'APIs', 'MongoDB', 'SQL', 'Testing', 'Deployment', 'Git'],
  java: ['Java', 'Spring', 'Microservices', 'REST', 'SQL', 'AWS', 'Testing', 'Kafka', 'Design Patterns'],
  data: ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Statistics', 'Data Visualization', 'ETL', 'A/B Testing'],
  devops: ['Kubernetes', 'Docker', 'CI/CD', 'Terraform', 'AWS', 'Monitoring', 'Linux', 'Networking'],
  designer: ['Figma', 'UI/UX', 'Prototyping', 'Design Systems', 'Wireframing', 'User Research', 'Adobe'],
  marketing: ['SEO', 'Content Marketing', 'Social Media', 'Analytics', 'Email Marketing', 'Google Ads', 'Copywriting'],
  finance: ['Excel', 'Financial Modeling', 'Forecasting', 'Reporting', 'Budgeting', 'SQL', 'PowerPoint'],
  manager: ['Leadership', 'Strategy', 'Budgeting', 'Cross-functional', 'Mentoring', 'Roadmapping', 'Stakeholders'],
  student: ['Teamwork', 'Communication', 'Problem Solving', 'Microsoft Office', 'Research', 'Time Management'],
  generic: ['Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Project Management', 'Attention to Detail'],
};

const ACTION_VERBS = [
  'Led', 'Developed', 'Built', 'Improved', 'Increased', 'Reduced', 'Launched', 'Managed', 'Delivered',
  'Created', 'Designed', 'Implemented', 'Drove', 'Optimized', 'Automated', 'Spearheaded', 'Coordinated', 'Achieved',
];

const NUMERIC_PATTERN = /(\d+%|\d+x|\$\s?\d| \d{3,})/i;

function detectRole(jobTitle = '') {
  const t = (jobTitle || '').toLowerCase();
  if (/(front|react|ui|web|javascript|typescript)/.test(t)) return 'frontend';
  if (/(back|node|api|server|java|spring)/.test(t)) return inJava(t);
  if (/(full|mean|mern)/.test(t)) return 'fullstack';
  if (/(data|scientist|analytics|ml|analyst)/.test(t)) return 'data';
  if (/(devops|sre|infra|cloud|platform)/.test(t)) return 'devops';
  if (/(design|ux|ui|creative)/.test(t)) return 'designer';
  if (/(market|growth|seo|content|social|brand)/.test(t)) return 'marketing';
  if (/(financ|account|analyst|investment|bank)/.test(t)) return 'finance';
  if (/(manage|director|lead|head|vp)/.test(t)) return 'manager';
  if (/(intern|graduate|entry|junior|student)/.test(t)) return 'student';
  return 'generic';
}

function inJava(t) {
  return /(java|spring)/.test(t) ? 'java' : 'backend';
}

function collectResumeText(resume) {
  const parts = [];
  const p = resume.personal || {};
  parts.push(p.jobTitle, p.summary);
  (resume.experience || []).forEach((e) => {
    parts.push(e.jobTitle, e.company);
    (e.description || []).forEach((b) => parts.push(b.text));
  });
  (resume.skills || []).forEach((s) => parts.push(s.name));
  (resume.projects || []).forEach((pr) => {
    parts.push(pr.name);
    (pr.description || []).forEach((b) => parts.push(b.text));
  });
  (resume.education || []).forEach((e) => parts.push(e.school, e.degree, e.fieldOfStudy));
  (resume.certifications || []).forEach((c) => parts.push(c.name));
  return parts.filter(Boolean).join(' ').toLowerCase();
}

export function analyzeATS(resume, targetTitle) {
  const p = resume.personal || {};
  const title = targetTitle || p.jobTitle || '';
  const roleKey = detectRole(title);
  const keywords = [...ROLE_KEYWORDS[roleKey], ...ACTION_VERBS];

  const text = collectResumeText(resume);
  const lowerText = text;

  const found = new Set();
  const missing = [];
  keywords.forEach((k) => {
    const kLower = k.toLowerCase();
    if (lowerText.includes(kLower)) found.add(k);
    else missing.push(k);
  });

  const checks = [];
  const push = (label, pass, weight, note) => checks.push({ label, pass, weight, note });

  push('Contact info (email & phone)', !!(p.email && p.phone), 12,
    !p.email || !p.phone ? 'Add your email and phone number.' : '');
  push('Job title present', !!p.jobTitle.trim(), 8,
    !p.jobTitle.trim() ? 'Add a target job title so ATS can categorize you.' : '');
  push('Professional summary', !!p.summary.trim(), 12,
    !p.summary.trim() ? 'Write a 3–5 sentence summary with keywords.' : '');
  push('Work experience with bullet points', (resume.experience || []).some((e) => (e.description || []).some((b) => b.text.trim())), 15,
    'Use achievement bullets (led / increased / reduced…).');
  push('At least 1 skill listed', (resume.skills || []).some((s) => s.name.trim()), 10,
    'Add skills so ATS can match the job requirements.');
  push('Quantifiable achievements', numericBullets(resume) > 0, 13,
    'Add numbers like "increased X by 25%" to stand out.');
  push('Education or certifications', (resume.education || []).length > 0 || (resume.certifications || []).length > 0, 8,
    'Add education or relevant certifications.');

  // keyword coverage score
  const maxKeywordScore = 22;
  const keywordHits = found.size;
  const keywordScore = Math.min(maxKeywordScore, Math.round((keywordHits / Math.max(6, found.size + missing.length * 0.6)) * maxKeywordScore));

  const checksScore = checks.reduce((sum, c) => sum + (c.pass ? c.weight : 0), 0);
  let total = Math.max(0, Math.min(100, Math.round(checksScore + keywordScore)));

  let grade = 'Needs work';
  let color = '#dc2626';
  if (total >= 85) { grade = 'Excellent'; color = '#059669'; }
  else if (total >= 70) { grade = 'Good'; color = '#d97706'; }
  else if (total >= 50) { grade = 'Fair'; color = '#d97706'; }

  return {
    score: total,
    grade,
    color,
    roleKey,
    checkedKeywords: [...found].slice(0, 14),
    missingKeywords: missing.slice(0, 12),
    checks,
    numericBullets: numericBullets(resume),
  };
}

function numericBullets(resume) {
  let count = 0;
  (resume.experience || []).forEach((e) =>
    (e.description || []).forEach((b) => { if (NUMERIC_PATTERN.test(b.text)) count++; })
  );
  (resume.projects || []).forEach((pr) =>
    (pr.description || []).forEach((b) => { if (NUMERIC_PATTERN.test(b.text)) count++; })
  );
  return count;
}