'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, Sparkles } from 'lucide-react';
import AppShell from '@/components/AppShell';
import ResumeRenderer from '@/templates';
import {
  defaultDefinition,
  BODY_LAYOUTS,
  HEADER_STYLES,
  HEADING_STYLES,
  SIDEBAR_TONES,
  validateDefinition,
  BUILTIN_DEFINITIONS,
} from '@/templates/templateEngine';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/components/Toast';
import { buildSampleResume } from '@/lib/sample-data';

const SECTION_OPTIONS = [
  'summary', 'experience', 'education', 'skills', 'projects',
  'certifications', 'languages', 'awards', 'hobbies', 'references',
];

export default function TemplateStudioPage() {
  const router = useRouter();
  const toast = useToast();
  const [def, setDef] = useState(() => defaultDefinition({
    name: 'My Template',
    layout: { type: 'single' },
    header: { style: 'centered', nameFont: 'serif' },
    sections: { heading: 'center-underline' },
  }));
  const [saving, setSaving] = useState(false);
  const [accent, setAccent] = useState('#1d4ed8');
  const sample = useMemo(() => buildSampleResume(), []);

  useEffect(() => {
    setAccent(def.defaultAccent || '#1d4ed8');
  }, [def.defaultAccent]);

  const patch = (path, value) => {
    setDef((prev) => {
      const next = structuredClone(prev);
      const parts = path.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const toggleSection = (bucket, id) => {
    setDef((prev) => {
      const list = [...(prev.sections?.[bucket] || [])];
      const idx = list.indexOf(id);
      if (idx >= 0) list.splice(idx, 1);
      else list.push(id);
      return { ...prev, sections: { ...prev.sections, [bucket]: list } };
    });
  };

  const startFromBuiltin = (id) => {
    const base = BUILTIN_DEFINITIONS.find((d) => d.id === id);
    if (!base) return;
    setDef(defaultDefinition({
      ...structuredClone(base),
      id: `custom_${Date.now().toString(36)}`,
      name: `${base.name} Remix`,
      builtin: false,
      preview: '',
      category: 'custom',
    }));
  };

  const save = async () => {
    const err = validateDefinition(def);
    if (err) {
      toast.error(err);
      return;
    }
    setSaving(true);
    try {
      const created = await apiFetch('/api/templates/custom', {
        method: 'POST',
        body: {
          name: def.name,
          defaultAccent: accent,
          definition: { ...def, defaultAccent: accent },
        },
      });
      toast.success('Template saved — use it in Customize');
      router.push('/templates');
      return created;
    } catch (e) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const previewDef = useMemo(
    () => ({ ...def, defaultAccent: accent, id: def.id || 'preview' }),
    [def, accent]
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/templates" className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
              <ArrowLeft size={14} /> Templates
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Template Studio</h1>
            <p className="mt-1 text-sm text-slate-500">
              Build a new resume layout with the declarative engine — no code required.
            </p>
          </div>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save template
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Start from</span>
          {BUILTIN_DEFINITIONS.slice(0, 8).map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => startFromBuiltin(b.id)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-700"
            >
              {b.name}
            </button>
          ))}
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Sparkles size={12} /> Remix a built-in layout
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Name</span>
              <input
                value={def.name}
                onChange={(e) => patch('name', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Body layout</span>
              <select
                value={def.layout.type}
                onChange={(e) => patch('layout.type', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                {BODY_LAYOUTS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Header style</span>
              <select
                value={def.header.style}
                onChange={(e) => patch('header.style', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                {HEADER_STYLES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Section headings</span>
              <select
                value={def.sections.heading}
                onChange={(e) => patch('sections.heading', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                {HEADING_STYLES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-semibold text-slate-600">Sidebar %</span>
                <input
                  type="number"
                  min={22}
                  max={45}
                  value={def.layout.sidebarWidth}
                  onChange={(e) => patch('layout.sidebarWidth', Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-600">Sidebar tone</span>
                <select
                  value={def.layout.sidebarTone}
                  onChange={(e) => patch('layout.sidebarTone', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  {SIDEBAR_TONES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-semibold text-slate-600">Name font</span>
                <select
                  value={def.header.nameFont}
                  onChange={(e) => patch('header.nameFont', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="sans">Sans</option>
                  <option value="serif">Serif</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-600">Skills</span>
                <select
                  value={def.sections.skillsDisplay}
                  onChange={(e) => patch('sections.skillsDisplay', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="dots">Dots</option>
                  <option value="bars">Bars</option>
                </select>
              </label>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={!!def.sections.timeline}
                onChange={(e) => patch('sections.timeline', e.target.checked)}
              />
              Timeline accent (columns)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={def.header.showPhoto !== false}
                onChange={(e) => patch('header.showPhoto', e.target.checked)}
              />
              Show photo
            </label>

            <div>
              <span className="text-xs font-semibold text-slate-600">Accent color</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {['#1d4ed8', '#3b82f6', '#0f766e', '#7c3aed', '#b45309', '#ca8a04', '#dc2626', '#10b981', '#334155'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setAccent(c);
                      patch('defaultAccent', c);
                    }}
                    className={`h-7 w-7 rounded-full ${accent === c ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-600">Main sections</span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SECTION_OPTIONS.map((id) => (
                  <button
                    key={`m-${id}`}
                    type="button"
                    onClick={() => toggleSection('main', id)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      def.sections.main?.includes(id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-600">Sidebar sections</span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SECTION_OPTIONS.map((id) => (
                  <button
                    key={`s-${id}`}
                    type="button"
                    onClick={() => toggleSection('sidebar', id)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      def.sections.sidebar?.includes(id)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-auto rounded-xl border border-slate-200 bg-slate-200/60 p-4">
            <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Live engine preview
            </p>
            <div className="mx-auto origin-top scale-[0.72] sm:scale-[0.85]" style={{ width: 794 }}>
              <div className="overflow-hidden rounded bg-white shadow-lg">
                <ResumeRenderer
                  resume={sample}
                  definition={previewDef}
                  accentColor={accent}
                  fontFamily="inter"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
