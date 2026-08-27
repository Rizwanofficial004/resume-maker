'use client';

import TemplateFromDefinition from './engine/render';
import { BUILTIN_DEFINITIONS, LEGACY_TEMPLATE_ALIASES } from './definitions';

export { LEGACY_TEMPLATE_ALIASES };
export { BUILTIN_DEFINITIONS, DEFINITION_MAP } from './definitions';
export { defaultDefinition, validateDefinition, BODY_LAYOUTS, HEADER_STYLES, HEADING_STYLES, SIDEBAR_TONES } from './engine/schema';
export { default as TemplateFromDefinition } from './engine/render';

/** @deprecated use BUILTIN_DEFINITIONS — kept for TEMPLATES_CONFIG consumers */
export const TEMPLATES_CONFIG = BUILTIN_DEFINITIONS.map((d) => ({
  id: d.id,
  name: d.name,
  category: d.category,
  thumb: d.thumb,
  defaultAccent: d.defaultAccent,
  preview: d.preview,
  definition: d,
}));

export function createTemplateComponent(definition) {
  const def = definition.definition || definition;
  const TemplateComponent = function TemplateComponent({ resume, accent }) {
    return <TemplateFromDefinition definition={def} resume={resume} accent={accent} />;
  };
  TemplateComponent.displayName = `Template_${def.id}`;
  return TemplateComponent;
}

export const TEMPLATE_COMPONENTS = Object.fromEntries(
  TEMPLATES_CONFIG.map((t) => [t.id, createTemplateComponent(t)])
);
