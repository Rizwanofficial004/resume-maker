import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  listCustomTemplates,
  createCustomTemplate,
  updateCustomTemplate,
  deleteCustomTemplate,
} from '../controllers/customTemplateController.js';

const router = Router();

/** Must stay in sync with frontend TEMPLATES_CONFIG (Reactive Resume IDs). */
const TEMPLATES = [
  {
    id: 'azurill',
    name: 'Azurill',
    description: 'Centered header with timeline two-column body — creative or tech roles.',
    category: 'creative',
    preview: '/templates/jpg/azurill.jpg',
    accentColors: ['#3b82f6', '#1d4ed8', '#0ea5e9', '#7c3aed', '#dc2626'],
  },
  {
    id: 'bronzor',
    name: 'Bronzor',
    description: 'Section title column beside content — corporate, finance, consulting.',
    category: 'classic',
    preview: '/templates/jpg/bronzor.jpg',
    accentColors: ['#334155', '#1e293b', '#1d4ed8', '#0f766e'],
  },
  {
    id: 'chikorita',
    name: 'Chikorita',
    description: 'Main column plus solid accent sidebar — marketing, HR, client-facing.',
    category: 'creative',
    preview: '/templates/jpg/chikorita.jpg',
    accentColors: ['#10b981', '#059669', '#0ea5e9', '#84cc16'],
  },
  {
    id: 'ditgar',
    name: 'Ditgar',
    description: 'Tinted sidebar with accent header block — developers and technical PMs.',
    category: 'modern',
    preview: '/templates/jpg/ditgar.jpg',
    accentColors: ['#0f766e', '#115e59', '#0ea5e9', '#1d4ed8'],
  },
  {
    id: 'ditto',
    name: 'Ditto',
    description: 'Accent header band with two-column body — ATS-friendly and dense.',
    category: 'minimal',
    preview: '/templates/jpg/ditto.jpg',
    accentColors: ['#475569', '#334155', '#1e293b', '#2563eb'],
  },
  {
    id: 'gengar',
    name: 'Gengar',
    description: 'Tinted sidebar and accent header — business analysts and operations.',
    category: 'creative',
    preview: '/templates/jpg/gengar.jpg',
    accentColors: ['#7c3aed', '#a855f7', '#4c1d95', '#ec4899'],
  },
  {
    id: 'glalie',
    name: 'Glalie',
    description: 'Light sidebar with bordered contact box — legal, finance, executive.',
    category: 'classic',
    preview: '/templates/jpg/glalie.jpg',
    accentColors: ['#64748b', '#475569', '#1e293b', '#0f766e'],
  },
  {
    id: 'kakuna',
    name: 'Kakuna',
    description: 'Centered header and accent section titles — compact single column.',
    category: 'classic',
    preview: '/templates/jpg/kakuna.jpg',
    accentColors: ['#b45309', '#ca8a04', '#db2777', '#1d4ed8'],
  },
  {
    id: 'lapras',
    name: 'Lapras',
    description: 'Card sections with overlapping titles — senior and enterprise roles.',
    category: 'executive',
    preview: '/templates/jpg/lapras.jpg',
    accentColors: ['#1e3a8a', '#0f172a', '#334155', '#065f46'],
  },
  {
    id: 'leafish',
    name: 'Leafish',
    description: 'Tinted intro band and two columns — healthcare, nonprofit, sustainability.',
    category: 'modern',
    preview: '/templates/jpg/leafish.jpg',
    accentColors: ['#059669', '#047857', '#0d9488', '#65a30d'],
  },
  {
    id: 'meowth',
    name: 'Meowth',
    description: 'Uppercase titles with inline entry headers — compact ATS-friendly.',
    category: 'classic',
    preview: '/templates/jpg/meowth.jpg',
    accentColors: ['#b45309', '#92400e', '#1d4ed8', '#374151'],
  },
  {
    id: 'onyx',
    name: 'Onyx',
    description: 'Header with accent rule — versatile clean single column (default).',
    category: 'modern',
    preview: '/templates/jpg/onyx.jpg',
    accentColors: ['#1d4ed8', '#0ea5e9', '#111827', '#059669'],
  },
  {
    id: 'pikachu',
    name: 'Pikachu',
    description: 'Sidebar plus accent header panel — creative and junior roles.',
    category: 'creative',
    preview: '/templates/jpg/pikachu.jpg',
    accentColors: ['#ca8a04', '#eab308', '#f59e0b', '#1d4ed8'],
  },
  {
    id: 'rhyhorn',
    name: 'Rhyhorn',
    description: 'Pipe-separated contacts and whitespace — designers and creators.',
    category: 'minimal',
    preview: '/templates/jpg/rhyhorn.jpg',
    accentColors: ['#0ea5e9', '#0284c7', '#64748b', '#111827'],
  },
  {
    id: 'scizor',
    name: 'Scizor',
    description: 'Top accent stripe with uppercase headings — executive and consulting.',
    category: 'executive',
    preview: '/templates/jpg/scizor.jpg',
    accentColors: ['#dc2626', '#b91c1c', '#111827', '#7c3aed'],
  },
];

router.get('/', (req, res) => {
  res.json(TEMPLATES);
});

router.get('/custom', protect, listCustomTemplates);
router.post('/custom', protect, createCustomTemplate);
router.put('/custom/:id', protect, updateCustomTemplate);
router.delete('/custom/:id', protect, deleteCustomTemplate);

export default router;
