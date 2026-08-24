'use client';

import { Trash2 } from 'lucide-react';
import { Field, EntryCard, SectionHeader, RemoveButton } from './fields';
import { newProject } from '@/lib/resume-data';

export default function ProjectsEditor({ items, setItems }) {
  const update = (id, key, value) => {
    setItems(items.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  };
  const updateBullet = (id, i, text) => {
    setItems(
      items.map((it) =>
        it.id === id ? { ...it, description: it.description.map((b, bi) => (bi === i ? { ...b, text } : b)) } : it
      )
    );
  };
  const addBullet = (id) => {
    const entry = items.find((it) => it.id === id);
    update(id, 'description', [...(entry?.description || []), { text: '' }]);
  };
  const removeBullet = (id, i) => {
    const entry = items.find((it) => it.id === id);
    update(id, 'description', entry.description.filter((_, bi) => bi !== i));
  };
  const removeEntry = (id) => setItems(items.filter((it) => it.id !== id));

  return (
    <div>
      <SectionHeader title="Projects" onAdd={() => setItems([...items, newProject()])} addLabel="Add Project" />
      {items.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-400">
          Add side projects, open-source work, or portfolio pieces.
        </p>
      )}
      {items.map((item) => (
        <EntryCard key={item.id}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{item.name || 'New Project'}</span>
            <RemoveButton onClick={() => removeEntry(item.id)}>
              <span className="inline-flex items-center gap-1"><Trash2 size={12} /> Remove</span>
            </RemoveButton>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Project name" value={item.name} onChange={(v) => update(item.id, 'name', v)} placeholder="TaskFlow App" />
            <Field label="Link (optional)" value={item.link} onChange={(v) => update(item.id, 'link', v)} placeholder="github.com/you/taskflow" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Start" value={item.startDate} onChange={(v) => update(item.id, 'startDate', v)} placeholder="2023" />
            <Field label="End" value={item.endDate} onChange={(v) => update(item.id, 'endDate', v)} placeholder="2024" />
          </div>
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Highlights</span>
              <button onClick={() => addBullet(item.id)} className="rounded-md px-2 py-1 text-[11px] font-semibold text-brand-600 hover:bg-brand-50">
                + Add
              </button>
            </div>
            {item.description?.map((b, i) => (
              <div key={i} className="mb-2 flex items-start gap-2">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                <textarea value={b.text} onChange={(e) => updateBullet(item.id, i, e.target.value)} rows={2} placeholder="Describe your role and impact…" className="input resize-y text-[13px]" />
                <button onClick={() => removeBullet(item.id, i)} className="mt-2 shrink-0 text-slate-300 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </EntryCard>
      ))}
    </div>
  );
}
