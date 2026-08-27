'use client';

import { TEMPLATES_CONFIG } from '@/templates/templateEngine';

const LAYOUT_PREVIEW = {
  'sidebar-left': ({ accent }) => (
    <div className="flex h-full w-full">
      <div className="flex flex-col gap-[2px] p-[4px]" style={{ width: '38%', background: accent }}>
        <div className="h-2.5 w-2.5 rounded-full bg-white/40 mx-auto" />
        <div className="h-[3px] w-6 bg-white/70 rounded mx-auto" />
        <div className="h-[2px] w-4 bg-white/40 rounded mx-auto" />
        <div className="mt-[2px] space-y-[1px]">
          <div className="h-[1.5px] w-full bg-white/30 rounded" />
          <div className="h-[1.5px] w-4/5 bg-white/30 rounded" />
          <div className="h-[1.5px] w-full bg-white/30 rounded" />
        </div>
        <div className="mt-[2px] space-y-[1px]">
          <div className="h-[1.5px] w-full bg-white/30 rounded" />
          <div className="h-[1.5px] w-3/4 bg-white/30 rounded" />
        </div>
        <div className="mt-[2px] space-y-[1px]">
          <div className="h-[1.5px] w-full bg-white/30 rounded" />
          <div className="h-[1.5px] w-5/6 bg-white/30 rounded" />
        </div>
      </div>
      <div className="flex-1 p-[4px] space-y-[2px]">
        <div className="h-[3px] w-full bg-slate-200 rounded" />
        <div className="h-[3px] w-3/4 bg-slate-100 rounded" />
        <div className="h-[1.5px] w-full bg-slate-100 rounded" />
        <div className="h-[1.5px] w-5/6 bg-slate-100 rounded" />
        <div className="h-[1.5px] w-full bg-slate-100 rounded" />
        <div className="mt-[2px] h-[3px] w-full bg-slate-200 rounded" />
        <div className="h-[3px] w-2/3 bg-slate-100 rounded" />
        <div className="h-[1.5px] w-full bg-slate-100 rounded" />
        <div className="h-[1.5px] w-4/5 bg-slate-100 rounded" />
        <div className="h-[1.5px] w-full bg-slate-100 rounded" />
        <div className="mt-[2px] h-[3px] w-6 bg-slate-200 rounded" />
        <div className="h-[1.5px] w-full bg-slate-100 rounded" />
        <div className="h-[1.5px] w-3/4 bg-slate-100 rounded" />
      </div>
    </div>
  ),

  'sidebar-right': ({ accent }) => (
    <div className="flex h-full w-full">
      <div className="flex-1 p-[4px] space-y-[2px]">
        <div className="h-[3px] w-8 bg-slate-800 rounded" />
        <div className="h-[2px] w-5 rounded" style={{ background: accent }} />
        <div className="h-[1.5px] w-full bg-slate-100 rounded mt-[2px]" />
        <div className="h-[1.5px] w-4/5 bg-slate-100 rounded" />
        <div className="mt-[2px] h-[3px] w-full bg-slate-200 rounded" />
        <div className="h-[3px] w-3/4 bg-slate-100 rounded" />
        <div className="h-[1.5px] w-full bg-slate-100 rounded" />
        <div className="h-[1.5px] w-5/6 bg-slate-100 rounded" />
        <div className="mt-[2px] h-[3px] w-6 bg-slate-200 rounded" />
        <div className="h-[1.5px] w-full bg-slate-100 rounded" />
        <div className="h-[1.5px] w-3/4 bg-slate-100 rounded" />
      </div>
      <div className="flex flex-col gap-[2px] p-[4px]" style={{ width: '38%', background: accent }}>
        <div className="h-2.5 w-2.5 rounded-full bg-white/40 mx-auto" />
        <div className="h-[3px] w-6 bg-white/70 rounded mx-auto" />
        <div className="h-[2px] w-4 bg-white/40 rounded mx-auto" />
        <div className="mt-[2px] space-y-[1px]">
          <div className="h-[1.5px] w-full bg-white/30 rounded" />
          <div className="h-[1.5px] w-4/5 bg-white/30 rounded" />
        </div>
        <div className="mt-[2px] space-y-[1px]">
          <div className="h-[1.5px] w-full bg-white/30 rounded" />
          <div className="h-[1.5px] w-3/4 bg-white/30 rounded" />
        </div>
      </div>
    </div>
  ),

  'single': ({ accent }) => (
    <div className="flex h-full w-full flex-col p-[4px]">
      <div className="text-center pb-[2px] mb-[2px]" style={{ borderBottom: `1.5px double ${accent}` }}>
        <div className="h-[4px] w-10 bg-slate-800 rounded mx-auto" />
        <div className="h-[2px] w-6 rounded mx-auto mt-[1px]" style={{ background: accent }} />
        <div className="flex justify-center gap-[3px] mt-[1px]">
          <div className="h-[1.5px] w-4 bg-slate-200 rounded" />
          <div className="h-[1.5px] w-3 bg-slate-200 rounded" />
          <div className="h-[1.5px] w-4 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="flex-1 space-y-[2px]">
        <div className="flex items-center gap-[1px]">
          <div className="h-[1.5px] w-1 rounded" style={{ background: accent }} />
          <div className="h-[3px] w-6 bg-slate-800 rounded" />
        </div>
        <div className="h-[1.5px] w-full bg-slate-100 rounded" />
        <div className="h-[1.5px] w-3/4 bg-slate-100 rounded" />
        <div className="flex items-center gap-[1px] mt-[2px]">
          <div className="h-[1.5px] w-1 rounded" style={{ background: accent }} />
          <div className="h-[3px] w-5 bg-slate-800 rounded" />
        </div>
        <div className="h-[1.5px] w-full bg-slate-100 rounded" />
        <div className="h-[1.5px] w-5/6 bg-slate-100 rounded" />
        <div className="h-[1.5px] w-full bg-slate-100 rounded" />
        <div className="h-[1.5px] w-2/3 bg-slate-100 rounded" />
        <div className="flex items-center gap-[1px] mt-[2px]">
          <div className="h-[1.5px] w-1 rounded" style={{ background: accent }} />
          <div className="h-[3px] w-4 bg-slate-800 rounded" />
        </div>
        <div className="h-[1.5px] w-full bg-slate-100 rounded" />
        <div className="h-[1.5px] w-4/5 bg-slate-100 rounded" />
      </div>
    </div>
  ),

  'header-top': ({ accent }) => (
    <div className="flex h-full w-full flex-col">
      <div className="px-[4px] py-[3px]" style={{ background: accent }}>
        <div className="h-[4px] w-10 bg-white/80 rounded" />
        <div className="h-[2px] w-6 bg-white/50 rounded mt-[1px]" />
        <div className="flex gap-[3px] mt-[1px]">
          <div className="h-[1.5px] w-4 bg-white/40 rounded" />
          <div className="h-[1.5px] w-3 bg-white/40 rounded" />
          <div className="h-[1.5px] w-4 bg-white/40 rounded" />
        </div>
      </div>
      <div className="flex-1 p-[4px] space-y-[2px]">
        <div className="h-[1.5px] w-full bg-slate-100 rounded" />
        <div className="h-[1.5px] w-4/5 bg-slate-100 rounded" />
        <div className="h-[3px] w-full bg-slate-200 rounded mt-[2px]" />
        <div className="h-[3px] w-3/4 bg-slate-100 rounded" />
        <div className="h-[1.5px] w-full bg-slate-100 rounded" />
        <div className="h-[1.5px] w-5/6 bg-slate-100 rounded" />
        <div className="h-[3px] w-5 bg-slate-200 rounded mt-[2px]" />
        <div className="h-[1.5px] w-full bg-slate-100 rounded" />
        <div className="h-[1.5px] w-3/4 bg-slate-100 rounded" />
      </div>
    </div>
  ),

  'two-column': ({ accent }) => (
    <div className="flex h-full w-full flex-col p-[4px]">
      <div className="text-center pb-[2px] mb-[2px]" style={{ borderBottom: `1px solid ${accent}40` }}>
        <div className="h-[4px] w-10 bg-slate-800 rounded mx-auto" />
        <div className="h-[2px] w-5 rounded mx-auto mt-[1px]" style={{ background: accent }} />
      </div>
      <div className="flex gap-[3px] flex-1">
        <div className="flex-1 space-y-[2px]">
          <div className="h-[1.5px] w-full bg-slate-100 rounded" />
          <div className="h-[1.5px] w-4/5 bg-slate-100 rounded" />
          <div className="h-[3px] w-full bg-slate-200 rounded mt-[1px]" />
          <div className="h-[1.5px] w-full bg-slate-100 rounded" />
          <div className="h-[1.5px] w-5/6 bg-slate-100 rounded" />
          <div className="h-[3px] w-5 bg-slate-200 rounded mt-[1px]" />
          <div className="h-[1.5px] w-full bg-slate-100 rounded" />
          <div className="h-[1.5px] w-3/4 bg-slate-100 rounded" />
        </div>
        <div className="w-[35%] space-y-[2px]">
          <div className="h-[3px] w-4 bg-slate-200 rounded" />
          <div className="h-[1.5px] w-full bg-slate-100 rounded" />
          <div className="h-[1.5px] w-4/5 bg-slate-100 rounded" />
          <div className="h-[1.5px] w-full bg-slate-100 rounded" />
          <div className="h-[3px] w-5 bg-slate-200 rounded mt-[1px]" />
          <div className="h-[1.5px] w-full bg-slate-100 rounded" />
          <div className="h-[1.5px] w-3/4 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
  ),

  'accent-blocks': ({ accent }) => (
    <div className="flex h-full w-full flex-col">
      <div className="px-[4px] py-[3px] rounded-b" style={{ background: accent }}>
        <div className="h-[4px] w-10 bg-white/80 rounded" />
        <div className="h-[2px] w-6 bg-white/50 rounded mt-[1px]" />
        <div className="flex gap-[3px] mt-[1px]">
          <div className="h-[1.5px] w-4 bg-white/40 rounded" />
          <div className="h-[1.5px] w-3 bg-white/40 rounded" />
        </div>
      </div>
      <div className="flex-1 p-[4px] space-y-[2px]">
        <div className="flex gap-[1px]">
          <div className="h-[1.5px] w-4 rounded" style={{ background: accent }} />
          <div className="h-[1.5px] w-3 bg-slate-200 rounded" />
          <div className="h-[1.5px] w-3 bg-slate-200 rounded" />
        </div>
        <div className="h-[3px] w-6 bg-slate-800 rounded" />
        <div className="h-[1.5px] w-full bg-slate-100 rounded" />
        <div className="h-[1.5px] w-4/5 bg-slate-100 rounded" />
        <div className="flex items-center gap-[1px] mt-[2px]">
          <div className="h-[1.5px] w-1 rounded" style={{ background: accent }} />
          <div className="h-[3px] w-5 bg-slate-800 rounded" />
        </div>
        <div className="h-[1.5px] w-full bg-slate-100 rounded" />
        <div className="h-[1.5px] w-3/4 bg-slate-100 rounded" />
      </div>
    </div>
  ),
};

// Assign colors to each template
const COLORS = {
  modern: '#1d4ed8',
  gengar: '#7c3aed',
  midnight: '#0f172a',
  arctic: '#0ea5e9',
  classic: '#1f2937',
  minimal: '#2563eb',
  professional: '#1e3a8a',
  creative: '#f43f5e',
  executive: '#111827',
  harmony: '#059669',
  zen: '#64748b',
  block: '#d97706',
};

export default function TemplatePreview({ templateId, accent, className = '' }) {
  const config = TEMPLATES_CONFIG.find(t => t.id === templateId);
  if (!config) return null;
  const Preview = LAYOUT_PREVIEW[config.layout];
  if (!Preview) return null;

  const color = accent || COLORS[templateId] || '#1d4ed8';

  return (
    <div className={`overflow-hidden rounded bg-white ${className}`}>
      <Preview accent={color} />
    </div>
  );
}
