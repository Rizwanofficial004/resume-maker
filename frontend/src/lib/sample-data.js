export const SAMPLE_EXPERIENCE = [
  {
    id: 'exp_sample_1',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechNova',
    location: 'Remote',
    startDate: 'Jan 2021',
    endDate: 'Present',
    current: true,
    description: [
      { text: 'Led a team of 6 engineers building a design system used across 12 products, cutting UI development time by 40%.' },
      { text: 'Improved core application performance by 55% through code splitting and memoization, raising Lighthouse scores to 98.' },
      { text: 'Mentored 4 junior developers, conducting weekly code reviews that reduced production bugs by 30%.' },
    ],
  },
  {
    id: 'exp_sample_2',
    jobTitle: 'Frontend Developer',
    company: 'Startify',
    location: 'Berlin, Germany',
    startDate: 'Jun 2018',
    endDate: 'Dec 2020',
    current: false,
    description: [
      { text: 'Built and shipped 20+ customer-facing features using React and TypeScript, growing active users from 10k to 90k.' },
      { text: 'Introduced automated testing with Jest and Playwright, raising test coverage from 12% to 78%.' },
    ],
  },
];

export const SAMPLE_EDUCATION = [
  {
    id: 'edu_sample_1',
    school: 'Technical University of Berlin',
    degree: "Bachelor's Degree",
    fieldOfStudy: 'Computer Science',
    location: 'Berlin, Germany',
    startDate: '2014',
    endDate: '2018',
    current: false,
    description: 'Graduated with honors. Thesis on scalable web architecture.',
  },
];

export const SAMPLE_SKILLS = [
  { id: 'skill_sample_1', name: 'React & Next.js', level: 5 },
  { id: 'skill_sample_2', name: 'TypeScript', level: 4 },
  { id: 'skill_sample_3', name: 'Node.js', level: 4 },
  { id: 'skill_sample_4', name: 'Tailwind CSS', level: 5 },
  { id: 'skill_sample_5', name: 'MongoDB', level: 3 },
  { id: 'skill_sample_6', name: 'AWS', level: 3 },
];

export const SAMPLE_PROJECTS = [
  {
    id: 'proj_sample_1',
    name: 'TaskFlow — Project Management App',
    link: 'github.com/you/taskflow',
    startDate: '2023',
    endDate: '2024',
    description: [
      { text: 'Designed and built a real-time kanban board used by 3,000+ users with collaborative editing via WebSockets.' },
      { text: 'Architected the data layer with MongoDB aggregation pipelines, reducing report query time by 70%.' },
    ],
  },
];

export const SAMPLE_CERTIFICATIONS = [
  { id: 'cert_sample_1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023', link: '' },
  { id: 'cert_sample_2', name: 'Meta Front-End Developer', issuer: 'Coursera', date: '2022', link: '' },
];

export const SAMPLE_LANGUAGES = [
  { id: 'lang_sample_1', name: 'English', proficiency: 'Native' },
  { id: 'lang_sample_2', name: 'German', proficiency: 'Fluent' },
];

export const SAMPLE_SUMMARY =
  'Senior frontend engineer with 7+ years of experience building high-performance web applications. Specialized in React, TypeScript, and design systems. Passionate about clean architecture, accessibility, and mentoring engineers to deliver measurable business impact.';

export function buildSampleResume() {
  return {
    personal: {
      firstName: 'Anna',
      lastName: 'Peterson',
      jobTitle: 'Senior Frontend Developer',
      email: 'anna.peterson@email.com',
      phone: '+1 (555) 012-3456',
      address: '101 Market Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'United States',
      website: 'annapeterson.dev',
      linkedin: 'linkedin.com/in/annapeterson',
      summary: SAMPLE_SUMMARY,
      photo: '',
    },
    experience: SAMPLE_EXPERIENCE,
    education: SAMPLE_EDUCATION,
    skills: SAMPLE_SKILLS,
    projects: SAMPLE_PROJECTS,
    certifications: SAMPLE_CERTIFICATIONS,
    languages: SAMPLE_LANGUAGES,
    references: '',
    customSections: [],
  };
}
