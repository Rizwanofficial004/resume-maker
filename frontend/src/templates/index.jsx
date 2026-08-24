'use client';

import { TEMPLATES_CONFIG, TEMPLATE_COMPONENTS } from './templateEngine';

export const TEMPLATES = TEMPLATES_CONFIG.map(t => ({
  id: t.id,
  name: t.name,
  component: TEMPLATE_COMPONENTS[t.id],
  thumb: t.thumb,
}));

export const TEMPLATE_MAP = Object.fromEntries(TEMPLATES.map((t) => [t.id, t]));

const FONT_MAP = {
  inter: 'Inter, ui-sans-serif, system-ui, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  sans: 'Arial, Helvetica, sans-serif',
  times: '"Times New Roman", Times, serif',
  calibri: 'Calibri, "Segoe UI", sans-serif',
  trebuchet: '"Trebuchet MS", "Segoe UI", sans-serif',
};

export default function ResumeRenderer({ resume, templateId, accentColor, fontFamily, className = '' }) {
  const Template = (TEMPLATE_MAP[templateId] || TEMPLATE_MAP.modern).component;
  const accent = accentColor || '#1d4ed8';
  const font = FONT_MAP[fontFamily] || FONT_MAP.inter;

  return (
    <div className={className} style={{ '--accent': accent, fontFamily: font, background: '#fff' }}>
      <Template resume={resume} accent={accent} />
    </div>
  );
}
