'use client';

import { Trash2, Plus, FolderKanban } from 'lucide-react';
import { newProject } from '@/lib/resume-data';
import TipsDropdown from './TipsDropdown';
import { MuiProvider, TextField, DateField } from './MuiFields';

export default function ProjectsStep({ items = [], setItems }) {
  const update = (id, key, value) => {
    setItems(items.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  };
  const updateBullet = (id, i, text) => {
    setItems(
      items.map((it) =>
        it.id === id
          ? { ...it, description: (it.description || []).map((b, bi) => (bi === i ? { ...b, text } : b)) }
          : it
      )
    );
  };
  const addBullet = (id) => {
    const entry = items.find((it) => it.id === id);
    update(id, 'description', [...(entry?.description || []), { text: '' }]);
  };
  const removeBullet = (id, i) => {
    const entry = items.find((it) => it.id === id);
    update(id, 'description', (entry.description || []).filter((_, bi) => bi !== i));
  };

  return (
    <MuiProvider>
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[22px] font-bold text-slate-900">Projects</h2>
            <p className="mt-1 text-sm text-slate-500">Showcase side projects, open-source work, or portfolio pieces.</p>
          </div>
          <TipsDropdown section="projects" />
        </div>

        <div className="mt-6 space-y-4">
          {items.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-400">
              <FolderKanban size={28} className="mx-auto mb-2 opacity-50" />
              No projects yet — optional but great for developers and creatives.
            </div>
          )}

          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{item.name || 'New project'}</span>
                <button type="button" onClick={() => setItems(items.filter((it) => it.id !== item.id))} className="text-slate-400 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField label="Project name" value={item.name} onChange={(v) => update(item.id, 'name', v)} placeholder="TaskFlow App" />
                <TextField label="Link" value={item.link} onChange={(v) => update(item.id, 'link', v)} placeholder="github.com/you/project" />
                <DateField label="Start" value={item.startDate} onChange={(v) => update(item.id, 'startDate', v)} />
                <DateField label="End" value={item.endDate} onChange={(v) => update(item.id, 'endDate', v)} />
              </div>
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Highlights</span>
                  <button type="button" onClick={() => addBullet(item.id)} className="text-[11px] font-semibold text-blue-600">
                    + Add
                  </button>
                </div>
                {(item.description || []).map((b, i) => (
                  <div key={i} className="mb-2 flex items-start gap-2">
                    <TextField
                      label=""
                      value={b.text}
                      onChange={(v) => updateBullet(item.id, i, v)}
                      multiline
                      rows={2}
                      placeholder="Describe your role and impact…"
                    />
                    <button type="button" onClick={() => removeBullet(item.id, i)} className="mt-2 text-slate-300 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setItems([...items, newProject()])}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <Plus size={14} /> Add project
        </button>
      </div>
    </MuiProvider>
  );
}
