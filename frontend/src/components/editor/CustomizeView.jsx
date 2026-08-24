'use client';
import { useState, useMemo } from 'react';
import { ArrowLeft, Palette, LayoutGrid, Type, SpellCheck, RotateCcw, Check, Eye } from 'lucide-react';
import ResumeRenderer from '@/templates';
import { TEMPLATES } from '@/templates';
import { FONTS } from '@/lib/resume-data';
import TemplatePreview from './TemplatePreview';

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
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [sectionOrder, setSectionOrder] = useState(resume.sectionOrder || {
    left: ['experience', 'education', 'projects'],
    right: ['skills', 'certifications', 'languages'],
  });
  const [fontScale, setFontScale] = useState(resume.fontScale || 'normal');
  const [sectionSpacing, setSectionSpacing] = useState(resume.sectionSpacing || 16);
  const [paragraphSpacing, setParagraphSpacing] = useState(resume.paragraphSpacing || 8);
  const [lineSpacing, setLineSpacing] = useState(resume.lineSpacing || 1.5);
  const [spellChecked, setSpellChecked] = useState(false);

  const update = (k, v) => scheduleSave(p => ({ ...p, [k]: v }));

  const activeTemplateId = hoveredTemplate || resume.templateId;

  const tabs = [
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'sections', label: 'Section', icon: LayoutGrid },
    { id: 'design', label: 'Design', icon: Type },
    { id: 'spell', label: 'Spell Check', icon: SpellCheck },
  ];

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left panel - controls */}
      <div className="w-full lg:w-[340px] border-r border-slate-200 bg-white overflow-y-auto shrink-0" style={{ maxHeight: 'calc(100vh - 52px)' }}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
          <button onClick={onBack} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
            <ArrowLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-slate-800">Customize</span>
        </div>

        <div className="flex border-b border-slate-200">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-[11px] font-medium transition border-b-2 ${
                tab === t.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}>
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === 'templates' && (
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Resume Templates</h3>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      update('templateId', t.id);
                      setHoveredTemplate(null);
                    }}
                    onMouseEnter={() => setHoveredTemplate(t.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                    className={`group relative overflow-hidden rounded-xl border-2 transition ${
                      resume.templateId === t.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-300'
                    }`}>
                    <div className="aspect-[3/4] p-2">
                      <TemplatePreview templateId={t.id} accent={resume.accentColor} className="h-full w-full" />
                    </div>
                    <div className="px-2 py-1.5">
                      <p className="text-[11px] font-semibold text-slate-800">{t.name}</p>
                      <p className="text-[10px] text-slate-400">{t.thumb}</p>
                    </div>
                    {resume.templateId === t.id && (
                      <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-wide text-slate-500">Accent Color</h3>
              <div className="flex flex-wrap gap-2">
                {ACCENT_COLORS.map(c => (
                  <button key={c} onClick={() => update('accentColor', c)}
                    className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${
                      resume.accentColor === c ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                    }`} style={{ background: c }} />
                ))}
              </div>
            </div>
          )}

          {tab === 'sections' && (
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Section Order</h3>
              <p className="mb-4 text-xs text-slate-400">Drag to reorder sections on your resume.</p>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-600">Left Column</p>
                  {sectionOrder.left.map((s, i) => (
                    <div key={s} className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      <span className="text-slate-400">⠿</span>
                      <span className="capitalize">{s}</span>
                      <button onClick={() => {
                        const newLeft = sectionOrder.left.filter((_, idx) => idx !== i);
                        const newRight = [...sectionOrder.right, s];
                        setSectionOrder({ left: newLeft, right: newRight });
                        update('sectionOrder', { left: newLeft, right: newRight });
                      }} className="ml-auto text-xs text-blue-600 hover:text-blue-700">Move →</button>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-600">Right Column</p>
                  {sectionOrder.right.map((s, i) => (
                    <div key={s} className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      <span className="text-slate-400">⠿</span>
                      <span className="capitalize">{s}</span>
                      <button onClick={() => {
                        const newRight = sectionOrder.right.filter((_, idx) => idx !== i);
                        const newLeft = [...sectionOrder.left, s];
                        setSectionOrder({ left: newLeft, right: newRight });
                        update('sectionOrder', { left: newLeft, right: newRight });
                      }} className="ml-auto text-xs text-blue-600 hover:text-blue-700">← Move</button>
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
                {FONT_SIZES.map(fs => (
                  <button key={fs.id} onClick={() => { setFontScale(fs.id); update('fontScale', fs.id); }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                      fontScale === fs.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                    }`}>
                    {fs.label}
                    {fontScale === fs.id && <Check size={14} />}
                  </button>
                ))}
              </div>

              <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-wide text-slate-500">Font Family</h3>
              <div className="space-y-1.5">
                {FONTS.map(f => (
                  <button key={f.id} onClick={() => update('fontFamily', f.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                      resume.fontFamily === f.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                    }`} style={{ fontFamily: f.css }}>
                    {f.label}
                    {resume.fontFamily === f.id && <Check size={14} />}
                  </button>
                ))}
              </div>

              <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-wide text-slate-500">Spacing</h3>
              <SpacingSlider label="Section spacing" value={sectionSpacing} onChange={v => { setSectionSpacing(v); update('sectionSpacing', v); }} min={8} max={32} />
              <SpacingSlider label="Paragraph spacing" value={paragraphSpacing} onChange={v => { setParagraphSpacing(v); update('paragraphSpacing', v); }} min={4} max={20} />
              <SpacingSlider label="Line spacing" value={lineSpacing} onChange={v => { setLineSpacing(v); update('lineSpacing', v); }} min={1} max={2.5} step={0.1} />

              <button onClick={() => {
                setSectionSpacing(16); setParagraphSpacing(8); setLineSpacing(1.5); setFontScale('normal');
                update('sectionSpacing', 16); update('paragraphSpacing', 8); update('lineSpacing', 1.5); update('fontScale', 'normal');
              }} className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700">
                <RotateCcw size={13} /> Reset to Default
              </button>
            </div>
          )}

          {tab === 'spell' && (
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Spell Check</h3>
              <p className="mb-4 text-xs text-slate-400">Review your resume for spelling and grammar errors.</p>
              <button onClick={() => setSpellChecked(true)}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
                <SpellCheck size={16} className="mr-1.5 inline" />
                Run Spell Check
              </button>
              {spellChecked && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                  <Check size={24} className="mx-auto text-emerald-500" />
                  <p className="mt-2 text-sm font-medium text-emerald-700">No spelling errors found!</p>
                  <p className="mt-1 text-xs text-emerald-500">Your resume looks good.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right panel - live resume preview */}
      <div className="hidden flex-1 overflow-auto bg-slate-200/60 p-6 lg:block">
        <div className="pointer-events-none absolute right-4 top-16 z-10 hidden lg:block">
          <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-semibold text-white">
            <Eye size={12} className="mr-1 inline" /> Live preview
          </span>
        </div>
        <div style={{ width: 794, margin: '0 auto' }}>
          <div className="shadow-lift">
            <ResumeRenderer
              resume={resume}
              templateId={activeTemplateId}
              accentColor={resume.accentColor}
              fontFamily={resume.fontFamily}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SpacingSlider({ label, value, onChange, min, max, step = 1 }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-600">{label}</span>
        <span className="text-xs font-medium text-slate-500">{typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(1) : value}{step < 1 ? '' : 'px'}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full bg-slate-200 appearance-none cursor-pointer accent-blue-600" />
    </div>
  );
}
