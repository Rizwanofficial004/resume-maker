'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Loader2, Check, Eye, User, Briefcase,
  GraduationCap, Wrench, PenLine, Star, Palette, Download, Printer,
} from 'lucide-react';
import ResumeRenderer from '@/templates';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { EMPTY_RESUME, FONTS } from '@/lib/resume-data';
import { downloadResumeAsWord } from '@/lib/export';
import ResumeScore from '@/components/editor/ResumeScore';
import ContactsStep from '@/components/editor/ContactsStep';
import ExperienceStep from '@/components/editor/ExperienceStep';
import EducationStep from '@/components/editor/EducationStep';
import SkillsStep from '@/components/editor/SkillsStep';
import SummaryStep from '@/components/editor/SummaryStep';
import FinalizeStep from '@/components/editor/FinalizeStep';
import CustomizeView from '@/components/editor/CustomizeView';

const STEPS = [
  { id: 'contacts', label: 'Contacts', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'summary', label: 'Summary', icon: PenLine },
  { id: 'finalize', label: 'Finalize', icon: Star },
];

function calcScore(r) {
  let s = 0;
  if (r.personal?.firstName && r.personal?.lastName) s += 15;
  if (r.personal?.email) s += 5;
  if (r.personal?.phone) s += 5;
  if (r.personal?.jobTitle) s += 10;
  if (r.personal?.summary?.length > 20) s += 15;
  if (r.experience?.length > 0) s += 15;
  if (r.experience?.some(e => e.description?.length > 0)) s += 5;
  if (r.education?.length > 0) s += 10;
  if (r.skills?.length >= 3) s += 10;
  if (r.skills?.length >= 6) s += 5;
  if (r.languages?.length > 0) s += 5;
  return Math.min(100, s);
}

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const id = params.id;

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [step, setStep] = useState(0);
  const [view, setView] = useState('editor');
  const saveTimer = useRef(null);
  const printRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = id === 'new'
          ? JSON.parse(JSON.stringify(EMPTY_RESUME))
          : await apiFetch(`/api/resumes/${id}`);
        setResume(data);
      } catch (err) { alert(err.message); router.push('/dashboard'); }
      finally { setLoading(false); }
    };
    load();
  }, [id, router]);

  const save = useCallback(async (data) => {
    if (id === 'new') return;
    setSaving(true);
    try {
      const saved = await apiFetch(`/api/resumes/${id}`, { method: 'PUT', body: data });
      setResume(prev => ({ ...prev, ...saved }));
      setSavedAt(new Date());
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  }, [id]);

  const scheduleSave = useCallback((updater) => {
    setResume(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => save(next), 900);
      return next;
    });
  }, [save]);

  const updatePersonal = useCallback((key, val) => {
    scheduleSave(p => ({ ...p, personal: { ...p.personal, [key]: val } }));
  }, [scheduleSave]);

  const setList = useCallback((k) => (items) => {
    scheduleSave(p => ({ ...p, [k]: items }));
  }, [scheduleSave]);

  useEffect(() => {
    if (searchParams.get('print') === '1' && !loading && resume) {
      const t = setTimeout(() => window.print(), 700);
      return () => clearTimeout(t);
    }
  }, [loading, resume, searchParams]);

  const score = useMemo(() => resume ? calcScore(resume) : 0, [resume]);

  if (loading || !resume) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </div>
    );
  }

  const handleSaveNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else router.push('/documents');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="sticky top-0 z-40 flex h-[52px] items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
            <ArrowLeft size={18} />
          </Link>
          <span className="text-xs text-slate-400">Back to editor</span>
        </div>
        <div className="flex items-center gap-4">
          <ResumeScore score={score} />
          <button
            onClick={() => setView(view === 'editor' ? 'customize' : 'editor')}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Palette size={15} /> Change Template
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" title="Print PDF">
            <Printer size={18} />
          </button>
          <button
            onClick={() => printRef.current && downloadResumeAsWord(resume, printRef.current.innerHTML)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" title="Download Word"
          >
            <Download size={18} />
          </button>
          {saving
            ? <span className="flex items-center gap-1 text-xs text-slate-400"><Loader2 size={12} className="animate-spin" /> Saving…</span>
            : savedAt && <span className="flex items-center gap-1 text-xs text-emerald-500"><Check size={12} /> Saved</span>
          }
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
            {user?.firstName?.[0] || 'U'}
          </span>
        </div>
      </div>

      {view === 'editor' ? (
        <div className="flex flex-1 overflow-hidden">
          <div className="flex w-full flex-col lg:flex-row">
            <div className="w-full lg:w-[780px] lg:border-r lg:border-slate-200">
              <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-2">
                {STEPS.map((s, i) => (
                  <button key={s.id} onClick={() => setStep(i)}
                    className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-3 text-[13px] font-medium border-b-2 transition ${
                      step === i ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}>
                    <s.icon size={14} /> {s.label}
                  </button>
                ))}
              </div>
              <div className="overflow-y-auto px-6 py-6" style={{ maxHeight: 'calc(100vh - 160px)' }}>
                {step === 0 && <ContactsStep resume={resume} updatePersonal={updatePersonal} />}
                {step === 1 && <ExperienceStep items={resume.experience || []} setItems={setList('experience')} />}
                {step === 2 && <EducationStep items={resume.education || []} setItems={setList('education')} />}
                {step === 3 && <SkillsStep items={resume.skills || []} setItems={setList('skills')} jobTitle={resume.personal?.jobTitle} />}
                {step === 4 && <SummaryStep value={resume.personal?.summary || ''} onUpdate={(v) => updatePersonal('summary', v)} jobTitle={resume.personal?.jobTitle} />}
                {step === 5 && <FinalizeStep resume={resume} scheduleSave={scheduleSave} />}
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3">
                <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-40">
                  ← Back
                </button>
                <button onClick={handleSaveNext}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                  {step === STEPS.length - 1 ? 'Finish' : 'Save & Next'}
                  {step < STEPS.length - 1 && <ArrowRight size={15} className="inline ml-1" />}
                </button>
              </div>
            </div>
            <div className="hidden flex-1 overflow-auto bg-slate-200/60 p-6 lg:block">
              <div className="pointer-events-none absolute right-4 top-16 z-10 hidden lg:block">
                <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-semibold text-white">
                  <Eye size={12} className="mr-1 inline" /> Live preview
                </span>
              </div>
              <div style={{ width: 794, margin: '0 auto' }}>
                <div className="shadow-lift">
                  <ResumeRenderer resume={resume} templateId={resume.templateId} accentColor={resume.accentColor} fontFamily={resume.fontFamily} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CustomizeView resume={resume} scheduleSave={scheduleSave} onBack={() => setView('editor')} />
      )}

      <div id="print-resume-holder">
        <div ref={printRef}>
          <ResumeRenderer resume={resume} templateId={resume.templateId} accentColor={resume.accentColor} fontFamily={resume.fontFamily} />
        </div>
      </div>
    </div>
  );
}
