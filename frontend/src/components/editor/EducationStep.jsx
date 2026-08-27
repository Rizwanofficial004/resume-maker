'use client';
import { useState } from 'react';
import { GripVertical, ChevronDown, ChevronUp, Trash2, Plus } from 'lucide-react';
import { newEducation } from '@/lib/resume-data';
import RichTextEditor from './RichTextEditor';
import AIButton from './AIButton';
import TipsDropdown from './TipsDropdown';
import { MuiProvider, TextField, DateField, Checkbox } from './MuiFields';

export default function EducationStep({ items = [], setItems }) {
  const [expanded, setExpanded] = useState(null);

  const add = () => { const e = newEducation(); setItems([...items, e]); setExpanded(e.id); };
  const update = (id, k, v) => setItems(items.map(it => it.id === id ? { ...it, [k]: v } : it));
  const remove = (id) => setItems(items.filter(it => it.id !== id));

  return (
    <MuiProvider>
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[22px] font-bold text-slate-900">Education</h2>
            <p className="mt-1 text-sm text-slate-500">Add your educational background starting with the most recent.</p>
          </div>
          <TipsDropdown section="education" />
        </div>

        <div className="mt-6 space-y-3">
          {items.map(item => (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <GripVertical size={16} className="shrink-0 text-slate-300 cursor-grab" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-[15px]">{item.school || 'School Name'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.degree || 'Degree'}{item.fieldOfStudy ? `, ${item.fieldOfStudy}` : ''}</p>
                </div>
                <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
                  {expanded === item.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <button onClick={() => remove(item.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition">
                  <Trash2 size={18} />
                </button>
              </div>
              {expanded === item.id && (
                <div className="border-t border-slate-100 px-5 py-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <TextField label="School / University" value={item.school} onChange={v => update(item.id, 'school', v)} placeholder="MIT" />
                    <TextField label="Location" value={item.location} onChange={v => update(item.id, 'location', v)} placeholder="Cambridge, MA" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <TextField label="Degree" value={item.degree} onChange={v => update(item.id, 'degree', v)} placeholder="Bachelor of Science" />
                    <TextField label="Field of study" value={item.fieldOfStudy} onChange={v => update(item.id, 'fieldOfStudy', v)} placeholder="Computer Science" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <DateField label="Start date" value={item.startDate} onChange={v => update(item.id, 'startDate', v)} />
                    <DateField label="End date" value={item.endDate} onChange={v => update(item.id, 'endDate', v)} disabled={item.current} />
                  </div>
                  <Checkbox label="I'm still enrolled" checked={item.current} onChange={v => update(item.id, 'current', v)} />
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">Description</span>
                      <AIButton endpoint="improve"
                        payload={() => ({
                          text: (item.description || '').replace(/<[^>]+>/g, '').trim()
                            || `Highlights for ${item.degree || 'degree'} in ${item.fieldOfStudy || 'studies'} at ${item.school || 'university'}`,
                          context: `Education at ${item.school || 'school'}, ${item.degree || ''} in ${item.fieldOfStudy || ''}`,
                        })}
                        small
                        label={item.description?.replace(/<[^>]+>/g, '').trim() ? 'Improve with AI' : 'Generate with AI'}
                        onResult={(r) => update(item.id, 'description', r)} />
                    </div>
                    <RichTextEditor
                      value={item.description}
                      onChange={(v) => update(item.id, 'description', v)}
                      placeholder="Mention relevant coursework, honors, GPA, activities…"
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={add} className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
          <Plus size={16} /> Add education
        </button>
      </div>
    </MuiProvider>
  );
}
