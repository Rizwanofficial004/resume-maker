'use client';

import { Trash2 } from 'lucide-react';
import { Field, TextArea, EntryCard, SectionHeader, RemoveButton } from './fields';
import { newEducation } from '@/lib/resume-data';

export default function EducationEditor({ items, setItems }) {
  const update = (id, key, value) => {
    setItems(items.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  };
  const removeEntry = (id) => setItems(items.filter((it) => it.id !== id));

  return (
    <div>
      <SectionHeader title="Education" onAdd={() => setItems([...items, newEducation()])} addLabel="Add Education" />
      {items.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-400">
          No education added yet.
        </p>
      )}
      {items.map((item) => (
        <EntryCard key={item.id}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
              {item.school || item.degree || 'New Education'}
            </span>
            <RemoveButton onClick={() => removeEntry(item.id)}>
              <span className="inline-flex items-center gap-1"><Trash2 size={12} /> Remove</span>
            </RemoveButton>
          </div>
          <Field label="School / University" value={item.school} onChange={(v) => update(item.id, 'school', v)} placeholder="University of California" />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Degree" value={item.degree} onChange={(v) => update(item.id, 'degree', v)} placeholder="Bachelor's Degree" />
            <Field label="Field of study" value={item.fieldOfStudy} onChange={(v) => update(item.id, 'fieldOfStudy', v)} placeholder="Computer Science" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <Field label="Start year" value={item.startDate} onChange={(v) => update(item.id, 'startDate', v)} placeholder="2014" />
            <Field label="End year" value={item.endDate} onChange={(v) => update(item.id, 'endDate', v)} placeholder="2018" />
            <Field label="Location" value={item.location} onChange={(v) => update(item.id, 'location', v)} placeholder="Berlin" />
          </div>
          <div className="mt-3">
            <TextArea label="Additional details (optional)" value={item.description} onChange={(v) => update(item.id, 'description', v)} rows={2} placeholder="Honors, relevant coursework, GPA…" />
          </div>
        </EntryCard>
      ))}
    </div>
  );
}
