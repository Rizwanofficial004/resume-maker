import { Router } from 'express';

const router = Router();

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean two-column layout with accent sidebar. Great balance for any role.',
    layout: 'two-column',
    category: 'modern',
    accentColors: ['#1d4ed8', '#0ea5e9', '#059669', '#d97706', '#7c3aed', '#dc2626'],
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional single-column format trusted by recruiters for decades.',
    layout: 'single-column',
    category: 'classic',
    accentColors: ['#1f2937', '#1d4ed8', '#6b7280', '#0f766e'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean, modern look with generous whitespace and refined typography.',
    layout: 'single-column',
    category: 'minimal',
    accentColors: ['#111827', '#2563eb', '#4b5563', '#0284c7'],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'A trusted layout for corporate and finance roles. Crisp and formal.',
    layout: 'single-column',
    category: 'classic',
    accentColors: ['#0f172a', '#1e3a8a', '#334155', '#065f46'],
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold color blocks for designers and marketers who want to stand out.',
    layout: 'two-column',
    category: 'creative',
    accentColors: ['#f43f5e', '#8b5cf6', '#f59e0b', '#06b6d4'],
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sleek and powerful design for senior leadership and management.',
    layout: 'single-column',
    category: 'modern',
    accentColors: ['#111827', '#7c3aed', '#0f766e', '#b45309'],
  },
];

router.get('/', (req, res) => {
  res.json(TEMPLATES);
});

export default router;
