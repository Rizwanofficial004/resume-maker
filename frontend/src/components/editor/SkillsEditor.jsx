'use client';

import { Trash2, Sparkles } from 'lucide-react';
import { EntryCard, SectionHeader, RemoveButton } from './fields';
import AIButton from './AIButton';
import { newSkill } from '@/lib/resume-data';

const LEVEL_LABELS = ['', 'Basic', 'Working', 'Intermediate', 'Advanced', 'Expert'];

export default function SkillsEditor({ items, setItems, jobTitle }) {
  const update = (id, key, value) => {
    setItems(items.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  };
  const removeEntry = (id) => setItems(items.filter((it) => it.id !== id));

  const addKeywords = (keywords) => {
    const existing = new Set(items.map((s) => s.name.toLowerCase().trim()));
    const fresh = keywords.filter((k) => !existing.has(k.toLowerCase().trim())).slice(0, 8);
    setItems([...items, ...fresh.map((k) => ({ id: newSkill().id, name: k, level: 3 }))]);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Skills</h3>
        <div className="flex items-center gap-2">
          <AIButton
            endpoint="keywords"
            payload={{ jobTitle: jobTitle || 'professional' }}
            label="Suggest keywords"
            small
            onResult={addKeywords}
          />
          <button onClick={() => setItems([...items, newSkill()])} className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-100">
            + Add skill
          </button>
        </div>
      </div>

      {items.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-400">
          No skills yet. Add them or let AI suggest keywords for your target role.
        </p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <input
              value={item.name}
              onChange={(e) => update(item.id, 'name', e.target.value)}
              placeholder="e.g. React"
              className="input flex-1"
            />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => update(item.id, 'level', lvl)}
                  className={`h-3.5 w-3.5 rounded-full transition ${item.level >= lvl ? 'bg-brand-500' : 'bg-slate-200 hover:bg-slate-300'}`}
                  title={LEVEL_LABELS[lvl]}
                />
              ))}
            </div>
            <button onClick={() => removeEntry(item.id)} className="text-slate-300 transition hover:text-red-500">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-slate-400">
        Tap the dots to set your proficiency level. AI suggestions use 1 credit.
      </p>
    </div>
  );
}
