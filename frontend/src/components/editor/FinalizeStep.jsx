'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Plus, Globe, Award, BookOpen, Heart, FileText, Users, Languages } from 'lucide-react';
import { uid, newCertification, newLanguage, LANGUAGE_LEVELS } from '@/lib/resume-data';
import TipsDropdown from './TipsDropdown';
import { MuiProvider, TextField, SelectField, DateField } from './MuiFields';

function Section({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-blue-600" />
          <span className="text-sm font-semibold text-slate-800">{title}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && <div className="border-t border-slate-100 px-4 py-4">{children}</div>}
    </div>
  );
}

export default function FinalizeStep({ resume, scheduleSave }) {
  const languages = resume.languages || [];
  const certifications = resume.certifications || [];
  const awards = resume.awards || [];
  const hobbies = resume.hobbies || '';
  const websites = resume.websites || [];
  const customSections = resume.customSections || [];
  const references = resume.references || '';

  const set = (k, v) => scheduleSave(p => ({ ...p, [k]: v }));

  const addLang = () => set('languages', [...languages, newLanguage()]);
  const removeLang = (id) => set('languages', languages.filter(l => l.id !== id));
  const updateLang = (id, k, v) => set('languages', languages.map(l => l.id === id ? { ...l, [k]: v } : l));

  const addCert = () => set('certifications', [...certifications, newCertification()]);
  const removeCert = (id) => set('certifications', certifications.filter(c => c.id !== id));
  const updateCert = (id, k, v) => set('certifications', certifications.map(c => c.id === id ? { ...c, [k]: v } : c));

  const addAward = () => set('awards', [...awards, { id: uid('award'), name: '', issuer: '', date: '', description: '' }]);
  const removeAward = (id) => set('awards', awards.filter(a => a.id !== id));
  const updateAward = (id, k, v) => set('awards', awards.map(a => a.id === id ? { ...a, [k]: v } : a));

  const addWebsite = () => set('websites', [...websites, { id: uid('web'), label: '', url: '' }]);
  const removeWebsite = (id) => set('websites', websites.filter(w => w.id !== id));
  const updateWebsite = (id, k, v) => set('websites', websites.map(w => w.id === id ? { ...w, [k]: v } : w));

  const addCustom = () => set('customSections', [...customSections, { id: uid('custom'), title: '', content: '' }]);
  const removeCustom = (id) => set('customSections', customSections.filter(c => c.id !== id));
  const updateCustom = (id, k, v) => set('customSections', customSections.map(c => c.id === id ? { ...c, [k]: v } : c));

  const langLevels = LANGUAGE_LEVELS.map(l => ({ value: l, label: l }));

  return (
    <MuiProvider>
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[22px] font-bold text-slate-900">Finalize Your Resume</h2>
            <p className="mt-1 text-sm text-slate-500">Add optional sections to make your resume stand out.</p>
          </div>
          <TipsDropdown section="finalize" />
        </div>

        <div className="mt-6 space-y-3">
          {/* Languages */}
          <Section title="Languages" icon={Languages} defaultOpen={true}>
            {languages.length > 0 && (
              <div className="space-y-3 mb-3">
                {languages.map(lang => (
                  <div key={lang.id} className="flex items-start gap-2">
                    <TextField label="Language" value={lang.name} onChange={v => updateLang(lang.id, 'name', v)} placeholder="English" />
                    <div className="w-36">
                      <SelectField label="Level" value={lang.proficiency} onChange={v => updateLang(lang.id, 'proficiency', v)} options={langLevels} />
                    </div>
                    <button onClick={() => removeLang(lang.id)} className="mt-2.5 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={addLang} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700">
              <Plus size={13} /> Add language
            </button>
          </Section>

          {/* Awards */}
          <Section title="Awards & Honors" icon={Award}>
            {awards.length > 0 && (
              <div className="space-y-3 mb-3">
                {awards.map(award => (
                  <div key={award.id} className="rounded-lg border border-slate-100 p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <TextField label="Award title" value={award.name || award.title || ''} onChange={v => updateAward(award.id, 'name', v)} />
                      <button onClick={() => removeAward(award.id)} className="mt-2.5 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <TextField label="Issuing organization" value={award.issuer} onChange={v => updateAward(award.id, 'issuer', v)} />
                      <DateField label="Date" value={award.date} onChange={v => updateAward(award.id, 'date', v)} />
                    </div>
                    <TextField label="Description" value={award.description} onChange={v => updateAward(award.id, 'description', v)} multiline rows={2} placeholder="Brief description (optional)" />
                  </div>
                ))}
              </div>
            )}
            <button onClick={addAward} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700">
              <Plus size={13} /> Add award
            </button>
          </Section>

          {/* Certifications */}
          <Section title="Certifications" icon={FileText}>
            {certifications.length > 0 && (
              <div className="space-y-3 mb-3">
                {certifications.map(cert => (
                  <div key={cert.id} className="flex items-start gap-2">
                    <TextField label="Certification name" value={cert.name} onChange={v => updateCert(cert.id, 'name', v)} />
                    <TextField label="Issuer" value={cert.issuer} onChange={v => updateCert(cert.id, 'issuer', v)} />
                    <DateField label="Date" value={cert.date} onChange={v => updateCert(cert.id, 'date', v)} />
                    <button onClick={() => removeCert(cert.id)} className="mt-2.5 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={addCert} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700">
              <Plus size={13} /> Add certification
            </button>
          </Section>

          {/* Websites */}
          <Section title="Websites & Social Media" icon={Globe}>
            {websites.length > 0 && (
              <div className="space-y-3 mb-3">
                {websites.map(w => (
                  <div key={w.id} className="flex items-start gap-2">
                    <TextField label="Label" value={w.label} onChange={v => updateWebsite(w.id, 'label', v)} placeholder="GitHub" />
                    <TextField label="URL" value={w.url} onChange={v => updateWebsite(w.id, 'url', v)} placeholder="https://github.com/you" />
                    <button onClick={() => removeWebsite(w.id)} className="mt-2.5 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={addWebsite} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700">
              <Plus size={13} /> Add website
            </button>
          </Section>

          {/* Hobbies */}
          <Section title="Hobbies & Interests" icon={Heart}>
            <TextField
              label="Hobbies"
              value={hobbies}
              onChange={v => set('hobbies', v)}
              multiline
              rows={3}
              placeholder="e.g. Photography, Hiking, Open-source contributing, Chess…"
            />
          </Section>

          {/* Custom Sections */}
          <Section title="Custom Section" icon={BookOpen}>
            {customSections.length > 0 && (
              <div className="space-y-3 mb-3">
                {customSections.map(cs => (
                  <div key={cs.id} className="rounded-lg border border-slate-100 p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <TextField label="Section title" value={cs.title} onChange={v => updateCustom(cs.id, 'title', v)} />
                      <button onClick={() => removeCustom(cs.id)} className="mt-2.5 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                    <TextField label="Content" value={cs.content} onChange={v => updateCustom(cs.id, 'content', v)} multiline rows={3} placeholder="Content for this section…" />
                  </div>
                ))}
              </div>
            )}
            <button onClick={addCustom} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700">
              <Plus size={13} /> Add custom section
            </button>
          </Section>

          {/* References */}
          <Section title="References" icon={Users}>
            <TextField
              label="References"
              value={references}
              onChange={v => set('references', v)}
              multiline
              rows={3}
              placeholder="Available upon request — or add names, titles, and contact info."
            />
          </Section>
        </div>
      </div>
    </MuiProvider>
  );
}
