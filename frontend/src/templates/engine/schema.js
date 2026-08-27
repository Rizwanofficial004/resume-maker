/**
 * Declarative resume template schema.
 * New templates = new definition objects (no custom React required).
 */

export const HEADER_STYLES = [
  'centered',
  'photo-left',
  'photo-right',
  'band',
  'panel',
  'card',
  'sidebar-top',
  'leafish',
];

export const BODY_LAYOUTS = [
  'single',
  'columns', // sidebar | main side-by-side after header
  'sidebar-left', // colored/tinted left rail (header may be inside)
  'sidebar-right',
  'ditgar', // tinted sidebar + accent header block + summary strip
  'pikachu', // plain sidebar + accent panel header in main
  'bronzor', // title | content rows
  'cards', // lapras-style cards
  'scizor', // top stripe + single column
];

export const HEADING_STYLES = [
  'left-underline',
  'center-underline',
  'uppercase',
  'plain',
  'scizor',
];

export const SIDEBAR_TONES = ['accent', 'tint', 'muted', 'light', 'none'];

/** Sensible defaults for the template studio */
export function defaultDefinition(partial = {}) {
  return {
    id: partial.id || `custom_${Date.now().toString(36)}`,
    name: partial.name || 'Custom Template',
    category: partial.category || 'custom',
    thumb: partial.thumb || 'Custom layout',
    defaultAccent: partial.defaultAccent || '#1d4ed8',
    preview: partial.preview || '',
    builtin: partial.builtin ?? false,
    layout: {
      type: 'single',
      sidebarWidth: 34,
      sidebarTone: 'accent',
      padding: '14mm 16mm',
      topStripe: false,
      ...(partial.layout || {}),
    },
    header: {
      style: 'centered',
      nameFont: 'sans',
      nameSize: 24,
      showPhoto: true,
      photoSize: 68,
      photoRadius: 8,
      photoBorder: true,
      contacts: 'row-center',
      ...(partial.header || {}),
    },
    sections: {
      heading: 'left-underline',
      skillsDisplay: 'dots',
      experienceHeader: 'stacked',
      timeline: false,
      main: ['summary', 'experience', 'education', 'projects'],
      sidebar: ['skills', 'languages', 'certifications', 'hobbies'],
      ...(partial.sections || {}),
    },
  };
}

export function validateDefinition(def) {
  if (!def || typeof def !== 'object') return 'Invalid template definition';
  if (!def.name?.trim()) return 'Name is required';
  if (!BODY_LAYOUTS.includes(def.layout?.type) && !HEADER_STYLES.includes(def.header?.style)) {
    // layout type still required
  }
  if (!def.layout?.type || !BODY_LAYOUTS.includes(def.layout.type)) {
    return 'Choose a valid body layout';
  }
  if (!def.header?.style || !HEADER_STYLES.includes(def.header.style)) {
    return 'Choose a valid header style';
  }
  return null;
}
