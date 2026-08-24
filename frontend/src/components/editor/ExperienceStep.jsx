'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { GripVertical, ChevronDown, ChevronUp, Trash2, Plus } from 'lucide-react';
import { newExperience } from '@/lib/resume-data';
import AIButton from './AIButton';
import TipsDropdown from './TipsDropdown';
import { MuiProvider, TextField, DateField, Checkbox } from './MuiFields';

export default function ExperienceStep({ items = [], setItems }) {
  const [expanded, setExpanded] = useState(null);

  const add = () => { const e = newExperience(); setItems([...items, e]); setExpanded(e.id); };
  const update = (id, k, v) => setItems(items.map(it => it.id === id ? { ...it, [k]: v } : it));
  const remove = (id) => setItems(items.filter(it => it.id !== id));

  return (
    <MuiProvider>
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[22px] font-bold text-slate-900">Experience</h2>
            <p className="mt-1 text-sm text-slate-500">List your work experience starting with the most recent position first.</p>
          </div>
          <TipsDropdown section="experience" />
        </div>

        <div className="mt-6 space-y-3">
          {items.map(item => (
            <ExperienceCard
              key={item.id}
              item={item}
              expanded={expanded === item.id}
              onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
              onUpdate={(k, v) => update(item.id, k, v)}
              onRemove={() => remove(item.id)}
            />
          ))}
        </div>
        <button onClick={add} className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
          <Plus size={16} /> Add work experience
        </button>
      </div>
    </MuiProvider>
  );
}

function ExperienceCard({ item, expanded, onToggle, onUpdate, onRemove }) {
  const editorRef = useRef(null);
  const [descHtml, setDescHtml] = useState('');

  useEffect(() => {
    if (editorRef.current && expanded) {
      const html = item.description?.map(b => `<div>${b.text || ''}</div>`).join('') || '';
      if (editorRef.current.innerHTML !== html) {
        editorRef.current.innerHTML = html || '<div></div>';
      }
    }
  }, [expanded, item.description]);

  const syncDescription = useCallback(() => {
    if (!editorRef.current) return;
    const divs = editorRef.current.querySelectorAll('div');
    const bullets = Array.from(divs).map(d => ({ text: d.textContent || '' })).filter(b => b.text.trim());
    if (bullets.length === 0) onUpdate('description', [{ text: '' }]);
    else onUpdate('description', bullets);
  }, [onUpdate]);

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) exec('createLink', url);
  };

  const summary = `${item.jobTitle || 'Untitled'}${item.company ? ', ' + item.company : ''}`;
  const dateStr = item.startDate ? `${item.startDate} – ${item.current ? 'Present' : item.endDate || ''}` : '';

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Collapsed header */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        <GripVertical size={16} className="shrink-0 text-slate-300 cursor-grab" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-[15px]">{summary}</p>
          {dateStr && <p className="text-xs text-slate-500 mt-0.5">{dateStr}</p>}
        </div>
        <button onClick={onToggle} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        <button onClick={onRemove} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition">
          <Trash2 size={18} />
        </button>
      </div>

      {/* Expanded form */}
      {expanded && (
        <div className="border-t border-slate-100 px-5 py-5 space-y-4">
          {/* Row 1: Job title + Employer */}
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Job title" value={item.jobTitle} onChange={v => onUpdate('jobTitle', v)} placeholder="Senior Software Engineer" />
            <TextField label="Employer" value={item.company} onChange={v => onUpdate('company', v)} placeholder="Ascend Solution" />
          </div>

          {/* Row 2: Location + Start date + End date */}
          <div className="grid grid-cols-3 gap-4">
            <TextField label="Location" value={item.location} onChange={v => onUpdate('location', v)} placeholder="San Francisco, CA, USA" />
            <DateField label="Start date" value={item.startDate} onChange={v => onUpdate('startDate', v)} />
            <DateField label="End date" value={item.endDate} onChange={v => onUpdate('endDate', v)} disabled={item.current} />
          </div>

          {/* Currently work here */}
          <Checkbox label="Currently work here" checked={item.current} onChange={v => onUpdate('current', v)} />

          {/* Description */}
          <div>
            <label className="label mb-1">Description</label>
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between border-b border-slate-100 px-2 py-1.5">
                <div className="flex items-center gap-0.5">
                  <ToolBtn icon="B" cmd="bold" />
                  <ToolBtn icon="I" cmd="italic" />
                  <ToolBtn icon="U" cmd="underline" />
                  <ToolBtn icon="S" cmd="strikeThrough" />
                  <span className="mx-1 h-4 w-px bg-slate-200" />
                  <ToolBtn icon={<LinkIcon />} onClick={insertLink} />
                  <ToolBtn icon={<BulletIcon />} cmd="insertUnorderedList" />
                  <ToolBtn icon={<NumberIcon />} cmd="insertOrderedList" />
                  <span className="mx-1 h-4 w-px bg-slate-200" />
                  <ToolBtn icon={<UndoIcon />} cmd="undo" />
                  <ToolBtn icon={<RedoIcon />} cmd="redo" />
                </div>
                <AIButton endpoint="bullets"
                  payload={() => ({ jobTitle: item.jobTitle, company: item.company, description: item.description?.map(b => b.text).filter(Boolean).join(' ') })}
                  label="Generate with AI" small
                  onResult={(bullets) => {
                    const existing = item.description?.map(b => b.text).filter(Boolean) || [];
                    const all = [...existing, ...bullets];
                    onUpdate('description', all.map(t => ({ text: t })));
                    if (editorRef.current) {
                      editorRef.current.innerHTML = all.map(t => `<div>${t}</div>`).join('');
                    }
                  }} />
              </div>
              {/* Content editable */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={syncDescription}
                onBlur={syncDescription}
                data-placeholder="Describe your achievements and responsibilities..."
                className="min-h-[180px] px-4 py-3 text-[13px] leading-relaxed text-slate-800 outline-none empty:before:pointer-events-none empty:before:text-slate-400 [&:empty]:before:content-[attr(data-placeholder)] [&_div]:mb-1.5"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolBtn({ icon, cmd, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick || (() => { document.execCommand(cmd, false, null); })}
      className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition text-xs font-medium min-w-[28px] h-[28px] flex items-center justify-center"
      title={typeof icon === 'string' ? icon : undefined}
    >
      {icon}
    </button>
  );
}

function LinkIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>;
}

function BulletIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3.5" cy="6" r="1.5" fill="currentColor" /><circle cx="3.5" cy="12" r="1.5" fill="currentColor" /><circle cx="3.5" cy="18" r="1.5" fill="currentColor" /></svg>;
}

function NumberIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><text x="2" y="8" fontSize="8" fill="currentColor" fontWeight="bold">1</text><text x="2" y="14" fontSize="8" fill="currentColor" fontWeight="bold">2</text><text x="2" y="20" fontSize="8" fill="currentColor" fontWeight="bold">3</text></svg>;
}

function UndoIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>;
}

function RedoIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>;
}
