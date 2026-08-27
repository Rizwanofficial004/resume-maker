'use client';

import { TEMPLATES_CONFIG, TEMPLATE_COMPONENTS, LEGACY_TEMPLATE_ALIASES, DEFINITION_MAP } from './templateEngine';
import TemplateFromDefinition from './engine/render';

export const TEMPLATES = TEMPLATES_CONFIG.map((t) => ({
  id: t.id,
  name: t.name,
  component: TEMPLATE_COMPONENTS[t.id],
  thumb: t.thumb,
  category: t.category,
  defaultAccent: t.defaultAccent,
  preview: t.preview,
  definition: t.definition,
}));

export const TEMPLATE_MAP = Object.fromEntries(TEMPLATES.map((t) => [t.id, t]));

export function resolveTemplateId(templateId) {
  if (typeof templateId === 'string' && templateId.startsWith('custom:')) return templateId;
  if (TEMPLATE_MAP[templateId]) return templateId;
  const aliased = LEGACY_TEMPLATE_ALIASES[templateId];
  if (aliased && TEMPLATE_MAP[aliased]) return aliased;
  return 'onyx';
}

export function getDefinition(templateId, customDefinitions = []) {
  const custom = customDefinitions.find((d) => d.id === templateId || d._id === templateId);
  if (custom) return custom.definition || custom;
  const resolved = resolveTemplateId(templateId);
  return DEFINITION_MAP[resolved] || DEFINITION_MAP.onyx;
}

const FONT_MAP = {
  inter: 'Inter, ui-sans-serif, system-ui, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  sans: 'Arial, Helvetica, sans-serif',
  times: '"Times New Roman", Times, serif',
  calibri: 'Calibri, "Segoe UI", sans-serif',
  trebuchet: '"Trebuchet MS", "Segoe UI", sans-serif',
};

const FONT_SCALE = {
  small: 0.9,
  normal: 1,
  large: 1.12,
};

/**
 * @param {object} props
 * @param {object} [props.definition] - override / custom declarative definition
 * @param {object[]} [props.customDefinitions] - user templates for id lookup
 */
export default function ResumeRenderer({
  resume,
  templateId,
  accentColor,
  fontFamily,
  className = '',
  definition: definitionOverride,
  customDefinitions = [],
}) {
  const def = definitionOverride || getDefinition(templateId, customDefinitions);
  const accent = accentColor || def?.defaultAccent || '#1d4ed8';
  const font = FONT_MAP[fontFamily] || FONT_MAP.inter;
  const scale = FONT_SCALE[resume?.fontSize] || FONT_SCALE.normal;
  const sectionGap = Number(resume?.sectionSpacing);
  const lineHeight = Number(resume?.lineSpacing);
  const paragraphGap = Number(resume?.paragraphSpacing);

  const style = {
    '--accent': accent,
    '--section-gap': `${Number.isFinite(sectionGap) && sectionGap <= 40 ? sectionGap : 12}px`,
    fontFamily: font,
    background: '#fff',
    fontSize: `${11 * scale}px`,
    lineHeight: Number.isFinite(lineHeight) && lineHeight >= 1 && lineHeight <= 3 ? lineHeight : 1.5,
  };
  if (Number.isFinite(paragraphGap) && paragraphGap <= 40) {
    style['--paragraph-gap'] = `${paragraphGap}px`;
  }

  const key = def?.id || templateId || 'onyx';

  return (
    <div className={className} style={style}>
      <TemplateFromDefinition key={key} definition={def} resume={resume} accent={accent} />
    </div>
  );
}

export { TEMPLATES_CONFIG, LEGACY_TEMPLATE_ALIASES, DEFINITION_MAP };
