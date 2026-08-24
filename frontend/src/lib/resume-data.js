export const EMPTY_RESUME = {
  title: 'Untitled Resume',
  templateId: 'modern',
  accentColor: '#1d4ed8',
  fontFamily: 'inter',
  personal: {
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    website: '',
    linkedin: '',
    summary: '',
    photo: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  references: '',
  customSections: [],
};

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function newExperience() {
  return {
    id: uid('exp'),
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: [],
  };
}

export function newEducation() {
  return {
    id: uid('edu'),
    school: '',
    degree: '',
    fieldOfStudy: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  };
}

export function newSkill() {
  return { id: uid('skill'), name: '', level: 3 };
}

export function newProject() {
  return { id: uid('proj'), name: '', link: '', startDate: '', endDate: '', description: [] };
}

export function newCertification() {
  return { id: uid('cert'), name: '', issuer: '', date: '', link: '' };
}

export function newLanguage() {
  return { id: uid('lang'), name: '', proficiency: 'Native' };
}

export const LANGUAGE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Fluent', 'Native'];

export const FONTS = [
  { id: 'inter', label: 'Inter', css: 'Inter, sans-serif' },
  { id: 'serif', label: 'Georgia', css: 'Georgia, serif' },
  { id: 'sans', label: 'Arial', css: 'Arial, Helvetica, sans-serif' },
  { id: 'times', label: 'Times New Roman', css: '"Times New Roman", Times, serif' },
  { id: 'calibri', label: 'Calibri', css: 'Calibri, "Segoe UI", sans-serif' },
  { id: 'trebuchet', label: 'Trebuchet MS', css: '"Trebuchet MS", sans-serif' },
];
