import CustomTemplate from '../models/CustomTemplate.js';
import { asyncHandler } from '../middleware/error.js';

const ALLOWED_LAYOUTS = new Set([
  'single', 'columns', 'sidebar-left', 'sidebar-right', 'ditgar', 'pikachu', 'bronzor', 'cards', 'scizor',
]);
const ALLOWED_HEADERS = new Set([
  'centered', 'photo-left', 'photo-right', 'band', 'panel', 'card', 'sidebar-top', 'leafish',
]);

function sanitizeDefinition(raw, name, defaultAccent) {
  const layout = raw?.layout && typeof raw.layout === 'object' ? raw.layout : {};
  const header = raw?.header && typeof raw.header === 'object' ? raw.header : {};
  const sections = raw?.sections && typeof raw.sections === 'object' ? raw.sections : {};

  const type = ALLOWED_LAYOUTS.has(layout.type) ? layout.type : 'single';
  const headerStyle = ALLOWED_HEADERS.has(header.style) ? header.style : 'centered';

  return {
    name: name || 'Custom Template',
    category: 'custom',
    thumb: typeof raw?.thumb === 'string' ? raw.thumb.slice(0, 120) : 'Custom layout',
    defaultAccent: defaultAccent || '#1d4ed8',
    builtin: false,
    layout: {
      type,
      sidebarWidth: Math.min(45, Math.max(22, Number(layout.sidebarWidth) || 34)),
      sidebarTone: ['accent', 'tint', 'muted', 'light', 'none'].includes(layout.sidebarTone)
        ? layout.sidebarTone
        : 'accent',
      padding: typeof layout.padding === 'string' ? layout.padding.slice(0, 40) : '14mm 16mm',
      topStripe: Boolean(layout.topStripe),
    },
    header: {
      style: headerStyle,
      nameFont: header.nameFont === 'serif' ? 'serif' : 'sans',
      nameSize: Math.min(36, Math.max(14, Number(header.nameSize) || 24)),
      showPhoto: header.showPhoto !== false,
      photoSize: Math.min(100, Math.max(40, Number(header.photoSize) || 68)),
      photoRadius: Math.min(999, Math.max(0, Number(header.photoRadius) || 8)),
      photoBorder: header.photoBorder !== false,
      contacts: ['row', 'row-center', 'column', 'pipes'].includes(header.contacts)
        ? header.contacts
        : 'row-center',
    },
    sections: {
      heading: ['left-underline', 'center-underline', 'uppercase', 'plain', 'scizor'].includes(sections.heading)
        ? sections.heading
        : 'left-underline',
      skillsDisplay: sections.skillsDisplay === 'bars' ? 'bars' : 'dots',
      experienceHeader: sections.experienceHeader === 'inline' ? 'inline' : 'stacked',
      timeline: Boolean(sections.timeline),
      main: Array.isArray(sections.main) ? sections.main.slice(0, 12).map(String) : ['summary', 'experience', 'education', 'projects'],
      sidebar: Array.isArray(sections.sidebar) ? sections.sidebar.slice(0, 12).map(String) : ['skills', 'languages', 'certifications'],
    },
  };
}

export const listCustomTemplates = asyncHandler(async (req, res) => {
  const items = await CustomTemplate.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(
    items.map((t) => ({
      _id: t._id,
      id: `custom:${t._id}`,
      name: t.name,
      category: t.category,
      thumb: t.thumb,
      defaultAccent: t.defaultAccent,
      definition: { ...t.definition, id: `custom:${t._id}`, name: t.name, defaultAccent: t.defaultAccent },
      updatedAt: t.updatedAt,
    }))
  );
});

export const createCustomTemplate = asyncHandler(async (req, res) => {
  const name = String(req.body?.name || '').trim();
  if (!name) {
    res.status(400);
    throw new Error('Template name is required');
  }
  const count = await CustomTemplate.countDocuments({ user: req.user._id });
  if (count >= 25) {
    res.status(400);
    throw new Error('You can save up to 25 custom templates');
  }

  const definition = sanitizeDefinition(req.body?.definition || req.body, name, req.body?.defaultAccent);
  const doc = await CustomTemplate.create({
    user: req.user._id,
    name,
    category: 'custom',
    thumb: definition.thumb,
    defaultAccent: definition.defaultAccent,
    definition,
  });

  res.status(201).json({
    _id: doc._id,
    id: `custom:${doc._id}`,
    name: doc.name,
    category: doc.category,
    thumb: doc.thumb,
    defaultAccent: doc.defaultAccent,
    definition: { ...doc.definition, id: `custom:${doc._id}`, name: doc.name },
  });
});

export const updateCustomTemplate = asyncHandler(async (req, res) => {
  const doc = await CustomTemplate.findOne({ _id: req.params.id, user: req.user._id });
  if (!doc) {
    res.status(404);
    throw new Error('Template not found');
  }
  if (req.body?.name) doc.name = String(req.body.name).trim().slice(0, 80);
  if (req.body?.definition || req.body?.layout) {
    const definition = sanitizeDefinition(req.body?.definition || req.body, doc.name, req.body?.defaultAccent || doc.defaultAccent);
    doc.definition = definition;
    doc.thumb = definition.thumb;
    doc.defaultAccent = definition.defaultAccent;
  } else if (req.body?.defaultAccent) {
    doc.defaultAccent = req.body.defaultAccent;
    doc.definition = { ...doc.definition, defaultAccent: req.body.defaultAccent };
  }
  await doc.save();
  res.json({
    _id: doc._id,
    id: `custom:${doc._id}`,
    name: doc.name,
    category: doc.category,
    thumb: doc.thumb,
    defaultAccent: doc.defaultAccent,
    definition: { ...doc.definition, id: `custom:${doc._id}`, name: doc.name },
  });
});

export const deleteCustomTemplate = asyncHandler(async (req, res) => {
  const doc = await CustomTemplate.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!doc) {
    res.status(404);
    throw new Error('Template not found');
  }
  res.json({ message: 'Template deleted', id: req.params.id });
});
