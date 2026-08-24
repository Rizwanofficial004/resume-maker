'use client';

import { Trash2 } from 'lucide-react';
import { Field, EntryCard, SectionHeader, RemoveButton } from './fields';
import { newCertification, newLanguage, LANGUAGE_LEVELS } from '@/lib/resume-data';

export function CertificationsEditor({ items, setItems }) {
  const update = (id, key, value) => setItems(items.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  const removeEntry = (id) => setItems(items.filter((it) => it.id !== id));

  return (
    <div>
      <SectionHeader title="Certifications" onAdd={() => setItems([...items, newCertification()])} addLabel="Add Certification" />
      {items.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-400">No certifications yet.</p>
      )}
      {items.map((item) => (
        <EntryCard key={item.id}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{item.name || 'New Certification'}</span>
            <RemoveButton onClick={() => removeEntry(item.id)}>
              <span className="inline-flex items-center gap-1"><Trash2 size={12} /> Remove</span>
            </RemoveButton>
          </div>
          <Field label="Certification name" value={item.name} onChange={(v) => update(item.id, 'name', v)} placeholder="AWS Certified Solutions Architect" />
          <div className="mt-3 grid grid-cols-3 gap-3">
            <Field label="Issuer" value={item.issuer} onChange={(v) => update(item.id, 'issuer', v)} placeholder="Amazon Web Services" />
            <Field label="Date" value={item.date} onChange={(v) => update(item.id, 'date', v)} placeholder="2024" />
            <Field label="Link (optional)" value={item.link} onChange={(v) => update(item.id, 'link', v)} placeholder="credential URL" />
          </div>
        </EntryCard>
      ))}
    </div>
  );
}

export function LanguagesEditor({ items, setItems }) {
  const update = (id, key, value) => setItems(items.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  const removeEntry = (id) => setItems(items.filter((it) => it.id !== id));

  return (
    <div>
      <SectionHeader title="Languages" onAdd={() => setItems([...items, newLanguage()])} addLabel="Add Language" />
      {items.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-400">No languages added.</p>
      )}
      {items.map((item) => (
        <div key={item.id} className="mb-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
          <Field label="" value={item.name} onChange={(v) => update(item.id, 'name', v)} placeholder="English" className="flex-1" />
          <select value={item.proficiency} onChange={(e) => update(item.id, 'proficiency', e.target.value)} className="input w-40">
            {LANGUAGE_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
          <button onClick={() => removeEntry(item.id)} className="text-slate-300 transition hover:text-red-500">
            <Trash2 size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
