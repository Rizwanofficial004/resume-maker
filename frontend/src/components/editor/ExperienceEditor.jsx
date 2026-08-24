'use client';

import { Plus, Trash2, Wand2 } from 'lucide-react';
import { Field, EntryCard, SectionHeader, RemoveButton } from './fields';
import AIButton from './AIButton';
import { newExperience } from '@/lib/resume-data';

export default function ExperienceEditor({ items, setItems }) {
  const update = (id, key, value) => {
    setItems(items.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  };

  const updateBullet = (id, bulletIdx, text) => {
    setItems(
      items.map((it) =>
        it.id === id
          ? { ...it, description: it.description.map((b, i) => (i === bulletIdx ? { ...b, text } : b)) }
          : it
      )
    );
  };

  const addBullet = (id) => {
    update(id, 'description', [...(items.find((it) => it.id === id)?.description || []), { text: '' }]);
  };

  const removeBullet = (id, bulletIdx) => {
    const entry = items.find((it) => it.id === id);
    update(id, 'description', entry.description.filter((_, i) => i !== bulletIdx));
  };

  const removeEntry = (id) => setItems(items.filter((it) => it.id !== id));

  return (
    <div>
      <SectionHeader title="Work Experience" onAdd={() => setItems([...items, newExperience()])} addLabel="Add Position" />
      {items.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-400">
          No experience yet — add your first position.
        </p>
      )}

      {items.map((item) => (
        <EntryCard key={item.id}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
              {item.jobTitle || item.company || 'New Position'}
            </span>
            <RemoveButton onClick={() => removeEntry(item.id)}>
              <span className="inline-flex items-center gap-1"><Trash2 size={12} /> Remove</span>
            </RemoveButton>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Job title" value={item.jobTitle} onChange={(v) => update(item.id, 'jobTitle', v)} placeholder="Senior Developer" />
            <Field label="Company" value={item.company} onChange={(v) => update(item.id, 'company', v)} placeholder="Acme Corp" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <Field label="Start date" value={item.startDate} onChange={(v) => update(item.id, 'startDate', v)} placeholder="Jan 2021" />
            <Field label="End date" value={item.endDate} onChange={(v) => update(item.id, 'endDate', v)} placeholder="Dec 2024" />
            <Field label="Location" value={item.location} onChange={(v) => update(item.id, 'location', v)} placeholder="Remote" />
          </div>
          <label className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-600">
            <input
              type="checkbox"
              checked={item.current}
              onChange={(e) => update(item.id, 'current', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            I currently work here
          </label>

          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Achievements / Bullet points</span>
              <div className="flex items-center gap-1">
                <AIButton
                  endpoint="bullets"
                  payload={{ jobTitle: item.jobTitle, company: item.company, description: item.description?.map((b) => b.text).filter(Boolean).join(' '), existing: item.description?.map((b) => b.text) }}
                  label="Suggest bullets"
                  small
                  onResult={(bullets) => {
                    const existing = item.description?.map((b) => b.text).filter(Boolean) || [];
                    const merged = [...existing, ...bullets].map((t) => ({ text: t }));
                    setItems(items.map((it) => (it.id === item.id ? { ...it, description: merged } : it)));
                  }}
                />
                <button onClick={() => addBullet(item.id)} className="rounded-md px-2 py-1 text-[11px] font-semibold text-brand-600 hover:bg-brand-50">
                  + Add bullet
                </button>
              </div>
            </div>
            {item.description?.map((bullet, i) => (
              <div key={i} className="mb-2 flex items-start gap-2">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                <div className="flex-1">
                  <textarea
                    value={bullet.text}
                    onChange={(e) => updateBullet(item.id, i, e.target.value)}
                    rows={2}
                    placeholder="e.g. Increased conversion rate by 25% through A/B testing…"
                    className="input resize-y text-[13px]"
                  />
                  {bullet.text.trim() && (
                    <div className="mt-1 flex justify-end">
                      <AIButton
                        endpoint="improve"
                        payload={{ text: bullet.text, context: `${item.jobTitle} at ${item.company}` }}
                        small
                        label="Improve"
                        onResult={(r) => updateBullet(item.id, i, r)}
                      />
                    </div>
                  )}
                </div>
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
