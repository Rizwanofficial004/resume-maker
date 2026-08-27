'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Palette, LayoutGrid, Type, SpellCheck, RotateCcw, Check, Eye, Loader2, Plus } from 'lucide-react';
import ResumeRenderer, { TEMPLATES, resolveTemplateId, getDefinition } from '@/templates';
import { FONTS } from '@/lib/resume-data';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast';

const ACCENT_COLORS = [
  '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa',
  '#059669', '#10b981', '#34d399',
  '#d97706', '#f59e0b', '#fbbf24',
  '#dc2626', '#ef4444', '#f87171',
  '#7c3aed', '#8b5cf6', '#a78bfa',
  '#0891b2', '#06b6d4', '#22d3ee',
  '#be185d', '#ec4899', '#f472b6',
  '#374151', '#1f2937', '#111827',
];

const FONT_SIZES = [
  { id: 'small', label: 'Small', scale: 0.85 },
  { id: 'normal', label: 'Normal', scale: 1 },
  { id: 'large', label: 'Large', scale: 1.15 },
];

export default function CustomizeView({ resume, scheduleSave, onBack }) {
  const [tab, setTab] = useState('templates');
  const [customTemplates, setCustomTemplates] = useState([]);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [sectionOrder, setSectionOrder] = useState(resume.sectionOrder || {
    left: ['experience', 'education', 'projects'],
    right: ['skills', 'certifications', 'languages'],
  });
  const [fontScale, setFontScale] = useState(resume.fontSize || 'normal');
  const [sectionSpacing, setSectionSpacing] = useState(resume.sectionSpacing > 40 ? 16 : (resume.sectionSpacing || 16));
  const [paragraphSpacing, setParagraphSpacing] = useState(resume.paragraphSpacing > 40 ? 8 : (resume.paragraphSpacing || 8));
  const [lineSpacing, setLineSpacing] = useState(resume.lineSpacing > 3 ? 1.5 : (resume.lineSpacing || 1.5));
  const [spellChecked, setSpellChecked] = useState(false);
  const [spellLoading, setSpellLoading] = useState(false);
  const [corrections, setCorrections] = useState([]);
  const { updateUser, user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    apiFetch('/api/templates/custom')
      .then(setCustomTemplates)
      .catch(() => setCustomTemplates([]));
  }, []);

  const catalog = useMemo(() => {
    const customs = (customTemplates || []).map((t) => ({
      id: t.id,
      name: t.name,
      thumb: t.thumb || 'Custom',
      category: 'custom',
      defaultAccent: t.defaultAccent,
      preview: null,
      definition: t.definition,
    }));
    return [...TEMPLATES, ...customs];
  }, [customTemplates]);

  const isCustomId = typeof resume.templateId === 'string' && resume.templateId.startsWith('custom:');
  const resolvedTemplateId = isCustomId ? resume.templateId : resolveTemplateId(resume.templateId);

  const update = (k, v) => scheduleSave((p) => ({ ...p, [k]: v }));

  const selectTemplate = (t) => {
    scheduleSave((p) => ({
      ...p,
      templateId: t.id,
      accentColor: t.defaultAccent || p.accentColor || '#1d4ed8',
    }));
    setHoveredTemplate(null);
  };

  const runSpellCheck = async () => {
    const chunks = [
      resume.personal?.summary,
      ...(resume.experience || []).flatMap((e) => (e.description || []).map((b) => b.text)),
      ...(resume.projects || []).flatMap((e) => (e.description || []).map((b) => b.text)),
    ].filter(Boolean);
    const text = chunks.join('\n');
    if (!text.trim()) {
      toast.info('Add some resume text first');
      return;
    }
    setSpellLoading(true);
    try {
      const data = await apiFetch('/api/ai/spell-check', { method: 'POST', body: { text: text.slice(0, 4000) } });
      setCorrections(Array.isArray(data.corrections) ? data.corrections : []);
      setSpellChecked(true);
      if (typeof data.aiCredits === 'number') updateUser({ ...user, aiCredits: data.aiCredits });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSpellLoading(false);
    }
  };

  const activeTemplateId = hoveredTemplate || resolvedTemplateId;
  const activeMeta = catalog.find((t) => t.id === activeTemplateId);
  const activeDefinition = getDefinition(activeTemplateId, customTemplates);
  const previewAccent = hoveredTemplate
    ? (activeMeta?.defaultAccent || resume.accentColor)
    : (resume.accentColor || activeMeta?.defaultAccent || '#1d4ed8');
  const referencePreview = activeMeta?.preview;

  const tabs = [
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'sections', label: 'Section', icon: LayoutGrid },
    { id: 'design', label: 'Design', icon: Type },
    { id: 'spell', label: 'Spell Check', icon: SpellCheck },
  ];

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="w-full shrink-0 overflow-y-auto border-r border-slate-200 bg-white lg:w-[340px]" style={{ maxHeight: 'calc(100vh - 52px)' }}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
          <button type="button" onClick={onBack} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
            <ArrowLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-slate-800">Customize</span>
        </div>

        <div className="flex border-b border-slate-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-[11px] font-medium transition ${
                tab === t.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === 'templates' && (
            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Resume Templates</h3>
                <Link
                  href="/templates/studio"
                  className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white hover:bg-slate-700"
                >
                  <Plus size={12} /> New
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {catalog.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => selectTemplate(t)}
                    onMouseEnter={() => setHoveredTemplate(t.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                    className={`group relative overflow-hidden rounded-xl border-2 transition ${
                      resolvedTemplateId === t.id
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-slate-50">
                      {t.preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.preview} alt="" className="h-full w-full object-cover object-top" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-2 text-center text-[10px] font-semibold text-slate-500">
                          {t.name}
                        </div>
                      )}
                    </div>
                    <div className="px-2 py-1.5">
                      <p className="text-[11px] font-semibold text-slate-800">{t.name}</p>
                      <p className="text-[10px] text-slate-400">{t.thumb}</p>
                    </div>
                    {resolvedTemplateId === t.id && (
                      <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-wide text-slate-500">Accent Color</h3>
              <p className="mb-2 text-[11px] text-slate-400">
                Colors apply to <span className="font-semibold text-slate-600">{activeMeta?.name || 'selected'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => update('accentColor', c)}
                    className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${
                      resume.accentColor === c ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    }`}
                    style={{ background: c }}
                    aria-label={`Accent ${c}`}
                  />
                ))}
              </div>
            </div>
          )}

          {tab === 'sections' && (
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Section Order</h3>
              <p className="mb-4 text-xs text-slate-400">
                Applies to two-column templates (Bronzor). Other layouts use a fixed structure.
              </p>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-600">Left Column</p>
                  {sectionOrder.left.map((s, i) => (
                    <div key={s} className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      <span className="text-slate-400">⠿</span>
                      <span className="capitalize">{s}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newLeft = sectionOrder.left.filter((_, idx) => idx !== i);
                          const newRight = [...sectionOrder.right, s];
                          setSectionOrder({ left: newLeft, right: newRight });
                          update('sectionOrder', { left: newLeft, right: newRight });
                        }}
                        className="ml-auto text-xs text-blue-600 hover:text-blue-700"
                      >
                        Move →
                      </button>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-600">Right Column</p>
                  {sectionOrder.right.map((s, i) => (
                    <div key={s} className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      <span className="text-slate-400">⠿</span>
                      <span className="capitalize">{s}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newRight = sectionOrder.right.filter((_, idx) => idx !== i);
                          const newLeft = [...sectionOrder.left, s];
                          setSectionOrder({ left: newLeft, right: newRight });
                          update('sectionOrder', { left: newLeft, right: newRight });
                        }}
                        className="ml-auto text-xs text-blue-600 hover:text-blue-700"
                      >
                        ← Move
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'design' && (
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Font Style</h3>
              <div className="space-y-1.5">
                {FONT_SIZES.map((fs) => (
                  <button
                    key={fs.id}
                    type="button"
                    onClick={() => {
                      setFontScale(fs.id);
                      update('fontSize', fs.id);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                      fontScale === fs.id ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {fs.label}
                    {fontScale === fs.id && <Check size={14} />}
                  </button>
                ))}
              </div>

              <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-wide text-slate-500">Font Family</h3>
              <div className="space-y-1.5">
                {FONTS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => update('fontFamily', f.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                      resume.fontFamily === f.id ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                    style={{ fontFamily: f.css }}
                  >
                    {f.label}
                    {resume.fontFamily === f.id && <Check size={14} />}
                  </button>
                ))}
              </div>

              <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-wide text-slate-500">Spacing</h3>
              <SpacingSlider label="Section spacing" value={sectionSpacing} onChange={(v) => { setSectionSpacing(v); update('sectionSpacing', v); }} min={8} max={32} />
              <SpacingSlider label="Paragraph spacing" value={paragraphSpacing} onChange={(v) => { setParagraphSpacing(v); update('paragraphSpacing', v); }} min={4} max={20} />
              <SpacingSlider label="Line spacing" value={lineSpacing} onChange={(v) => { setLineSpacing(v); update('lineSpacing', v); }} min={1} max={2.5} step={0.1} />

              <button
                type="button"
                onClick={() => {
                  setSectionSpacing(16);
                  setParagraphSpacing(8);
                  setLineSpacing(1.5);
                  setFontScale('normal');
                  scheduleSave((p) => ({
                    ...p,
                    sectionSpacing: 16,
                    paragraphSpacing: 8,
                    lineSpacing: 1.5,
                    fontSize: 'normal',
                  }));
                }}
                className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                <RotateCcw size={13} /> Reset to Default
              </button>
            </div>
          )}

          {tab === 'spell' && (
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Spell Check</h3>
              <p className="mb-4 text-xs text-slate-400">Uses 1 AI credit to review summary and bullet text.</p>
              <button
                type="button"
                onClick={runSpellCheck}
                disabled={spellLoading}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {spellLoading ? <Loader2 size={16} className="mr-1.5 inline animate-spin" /> : <SpellCheck size={16} className="mr-1.5 inline" />}
                {spellLoading ? 'Checking…' : 'Run Spell Check'}
              </button>
              {spellChecked && (
                corrections.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                    <Check size={24} className="mx-auto text-emerald-500" />
                    <p className="mt-2 text-sm font-medium text-emerald-700">No spelling errors found</p>
                  </div>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {corrections.slice(0, 12).map((c, i) => (
                      <li key={i} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                        <span className="font-semibold line-through">{c.original}</span>
                        {' → '}
                        <span className="font-semibold">{c.corrected}</span>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative hidden flex-1 overflow-auto bg-slate-200/60 p-6 lg:block">
        <div className="pointer-events-none absolute right-4 top-4 z-10">
          <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-semibold text-white">
            <Eye size={12} className="mr-1 inline" />{' '}
            {hoveredTemplate ? `Preview: ${activeMeta?.name}` : 'Live preview'}
          </span>
        </div>
        <div className={referencePreview ? 'mx-auto grid max-w-[1100px] gap-4 xl:grid-cols-2' : 'mx-auto'} style={referencePreview ? undefined : { width: 794 }}>
          {referencePreview && (
            <div>
              <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500">Reference design</p>
              <div className="overflow-hidden rounded-sm bg-white shadow-lift">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={referencePreview} alt={`${activeMeta?.name} reference`} className="w-full object-contain object-top" />
              </div>
            </div>
          )}
          <div>
            {referencePreview && (
              <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500">Your live resume</p>
            )}
            <div className="mx-auto overflow-hidden rounded-sm bg-white shadow-lift" style={{ width: 794, maxWidth: '100%' }}>
              <ResumeRenderer
                key={`${activeTemplateId}-${previewAccent}`}
                resume={resume}
                templateId={activeTemplateId}
                definition={activeDefinition}
                customDefinitions={customTemplates}
                accentColor={previewAccent}
                fontFamily={resume.fontFamily}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpacingSlider({ label, value, onChange, min, max, step = 1 }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-slate-600">{label}</span>
        <span className="text-xs font-medium text-slate-500">
          {typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(1) : value}
          {step < 1 ? '' : 'px'}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
      />
    </div>
  );
}
