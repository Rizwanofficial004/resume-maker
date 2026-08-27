'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Loader2, Check, Eye, User, Briefcase,
  GraduationCap, Wrench, PenLine, Star, Palette, Download, Printer, FolderKanban, AlertCircle,
  Undo2, Redo2,
} from 'lucide-react';
import ResumeRenderer from '@/templates';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { EMPTY_RESUME } from '@/lib/resume-data';
import { analyzeATS } from '@/lib/ats';
import { useToast } from '@/components/Toast';
import ResumeScore from '@/components/editor/ResumeScore';
import ContactsStep from '@/components/editor/ContactsStep';
import ExperienceStep from '@/components/editor/ExperienceStep';
import EducationStep from '@/components/editor/EducationStep';
import SkillsStep from '@/components/editor/SkillsStep';
import ProjectsStep from '@/components/editor/ProjectsStep';
import SummaryStep from '@/components/editor/SummaryStep';
import FinalizeStep from '@/components/editor/FinalizeStep';
import CustomizeView from '@/components/editor/CustomizeView';
import DownloadModal from '@/components/editor/DownloadModal';

const STEPS = [
  { id: 'contacts', label: 'Contacts', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'summary', label: 'Summary', icon: PenLine },
  { id: 'finalize', label: 'Finalize', icon: Star },
];

const MAX_HISTORY = 30;

function calcScore(r) {
  let s = 0;
  if (r.personal?.firstName && r.personal?.lastName) s += 15;
  if (r.personal?.email) s += 5;
  if (r.personal?.phone) s += 5;
  if (r.personal?.jobTitle) s += 10;
  if (r.personal?.summary?.length > 20) s += 15;
  if (r.experience?.length > 0) s += 15;
  if (r.experience?.some((e) => e.description?.length > 0)) s += 5;
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
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();
  const id = params.id;

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [savedAt, setSavedAt] = useState(null);
  const [step, setStep] = useState(0);
  const [view, setView] = useState('editor');
  const [mobilePreview, setMobilePreview] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [mountPrint, setMountPrint] = useState(false);
  const saveTimer = useRef(null);
  const historyTimer = useRef(null);
  const printRef = useRef(null);
  const pastRef = useRef([]);
  const futureRef = useRef([]);
  const applyingHistory = useRef(false);
  const [historyTick, setHistoryTick] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async () => {
      try {
        const data =
          id === 'new' ? JSON.parse(JSON.stringify(EMPTY_RESUME)) : await apiFetch(`/api/resumes/${id}`);
        if (!cancelled) {
          setResume(data);
          pastRef.current = [];
          futureRef.current = [];
        }
      } catch (err) {
        if (!cancelled) {
          toast.error(err.message);
          router.push('/documents');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router, user]);

  const save = useCallback(
    async (data) => {
      if (id === 'new') return;
      setSaving(true);
      setSaveError(null);
      try {
        const ats = analyzeATS(data);
        const payload = { ...data, atsScore: ats.score };
        const saved = await apiFetch(`/api/resumes/${id}`, { method: 'PUT', body: payload });
        // Keep local edits; only sync server fields that don't clobber in-flight UI changes
        setResume((prev) => ({
          ...prev,
          atsScore: ats.score,
          updatedAt: saved.updatedAt || prev.updatedAt,
        }));
        setSavedAt(new Date());
      } catch (e) {
        setSaveError(e.message || 'Save failed');
        toast.error(e.message || 'Failed to save resume');
      } finally {
        setSaving(false);
      }
    },
    [id, toast]
  );

  const pushHistory = useCallback((snapshot) => {
    if (applyingHistory.current) return;
    clearTimeout(historyTimer.current);
    historyTimer.current = setTimeout(() => {
      pastRef.current = [...pastRef.current.slice(-(MAX_HISTORY - 1)), JSON.parse(JSON.stringify(snapshot))];
      futureRef.current = [];
      setHistoryTick((t) => t + 1);
    }, 500);
  }, []);

  const scheduleSave = useCallback(
    (updater) => {
      setResume((prev) => {
        pushHistory(prev);
        const next = typeof updater === 'function' ? updater(prev) : updater;
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => save(next), 500);
        return next;
      });
    },
    [save, pushHistory]
  );

  const undo = useCallback(() => {
    if (!pastRef.current.length) return;
    setResume((current) => {
      const previous = pastRef.current[pastRef.current.length - 1];
      pastRef.current = pastRef.current.slice(0, -1);
      futureRef.current = [JSON.parse(JSON.stringify(current)), ...futureRef.current].slice(0, MAX_HISTORY);
      applyingHistory.current = true;
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        applyingHistory.current = false;
        save(previous);
      }, 500);
      setHistoryTick((t) => t + 1);
      return previous;
    });
  }, [save]);

  const redo = useCallback(() => {
    if (!futureRef.current.length) return;
    setResume((current) => {
      const next = futureRef.current[0];
      futureRef.current = futureRef.current.slice(1);
      pastRef.current = [...pastRef.current, JSON.parse(JSON.stringify(current))].slice(-MAX_HISTORY);
      applyingHistory.current = true;
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        applyingHistory.current = false;
        save(next);
      }, 500);
      setHistoryTick((t) => t + 1);
      return next;
    });
  }, [save]);

  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  const updatePersonal = useCallback(
    (key, val) => {
      scheduleSave((p) => ({ ...p, personal: { ...p.personal, [key]: val } }));
    },
    [scheduleSave]
  );

  const setList = useCallback(
    (k) => (items) => {
      scheduleSave((p) => ({ ...p, [k]: items }));
    },
    [scheduleSave]
  );

  useEffect(() => {
    if (searchParams.get('print') === '1' && !loading && resume) {
      setMountPrint(true);
      const t = setTimeout(() => window.print(), 700);
      return () => clearTimeout(t);
    }
  }, [loading, resume, searchParams]);

  const score = useMemo(() => (resume ? calcScore(resume) : 0), [resume]);
  const canUndo = pastRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;
  void historyTick;

  const openDownload = () => {
    setMountPrint(true);
    setDownloadOpen(true);
  };

  const handlePrint = () => {
    setMountPrint(true);
    requestAnimationFrame(() => setTimeout(() => window.print(), 50));
  };

  if (authLoading || loading || !resume || !user) {
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

  const preview = (
    <div
      style={{
        width: 794,
        margin: '0 auto',
        transform: mobilePreview ? 'scale(0.48)' : undefined,
        transformOrigin: 'top center',
      }}
    >
      <div className="shadow-lift">
        <ResumeRenderer
          resume={resume}
          templateId={resume.templateId}
          accentColor={resume.accentColor}
          fontFamily={resume.fontFamily}
        />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="sticky top-0 z-40 flex h-[52px] items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-3">
          <Link href="/documents" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
            <ArrowLeft size={18} />
          </Link>
          <span className="hidden text-xs text-slate-400 sm:inline">Documents</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <ResumeScore score={score} />
          <button
            type="button"
            onClick={() => setView(view === 'editor' ? 'customize' : 'editor')}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Palette size={15} /> <span className="hidden sm:inline">Change Template</span>
          </button>
          <button
            type="button"
            onClick={() => setMobilePreview((v) => !v)}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-600 lg:hidden"
          >
            <Eye size={14} /> {mobilePreview ? 'Edit' : 'Preview'}
          </button>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 size={16} />
          </button>
          <button type="button" onClick={handlePrint} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" title="Print">
            <Printer size={18} />
          </button>
          <button type="button" onClick={openDownload} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" title="Download">
            <Download size={18} />
          </button>
          {saving ? (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Loader2 size={12} className="animate-spin" /> Saving…
            </span>
          ) : saveError ? (
            <span className="flex items-center gap-1 text-xs text-red-500" title={saveError}>
              <AlertCircle size={12} /> Save failed
            </span>
          ) : savedAt ? (
            <span className="flex items-center gap-1 text-xs text-emerald-500">
              <Check size={12} /> Saved
            </span>
          ) : null}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
            {user?.firstName?.[0] || 'U'}
          </span>
        </div>
      </div>

      {view === 'editor' ? (
        <div className="flex flex-1 overflow-hidden">
          <div className="flex w-full flex-col lg:flex-row">
            <div className={`w-full lg:w-[780px] lg:border-r lg:border-slate-200 ${mobilePreview ? 'hidden' : 'block'}`}>
              <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-2">
                {STEPS.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStep(i)}
                    className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-3 text-[13px] font-medium transition ${
                      step === i ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <s.icon size={14} /> {s.label}
                  </button>
                ))}
              </div>
              <div className="overflow-y-auto px-6 py-6" style={{ maxHeight: 'calc(100vh - 160px)' }}>
                {step === 0 && <ContactsStep resume={resume} updatePersonal={updatePersonal} />}
                {step === 1 && <ExperienceStep items={resume.experience || []} setItems={setList('experience')} />}
                {step === 2 && <EducationStep items={resume.education || []} setItems={setList('education')} />}
                {step === 3 && (
                  <SkillsStep items={resume.skills || []} setItems={setList('skills')} jobTitle={resume.personal?.jobTitle} />
                )}
                {step === 4 && <ProjectsStep items={resume.projects || []} setItems={setList('projects')} />}
                {step === 5 && (
                  <SummaryStep
                    value={resume.personal?.summary || ''}
                    onUpdate={(v) => updatePersonal('summary', v)}
                    jobTitle={resume.personal?.jobTitle}
                    personal={resume.personal}
                    experience={resume.experience}
                    skills={resume.skills}
                  />
                )}
                {step === 6 && <FinalizeStep resume={resume} scheduleSave={scheduleSave} />}
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3">
                <button
                  type="button"
                  onClick={() => step > 0 && setStep(step - 1)}
                  disabled={step === 0}
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-40"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSaveNext}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {step === STEPS.length - 1 ? 'Finish' : 'Save & Next'}
                  {step < STEPS.length - 1 && <ArrowRight size={15} className="ml-1 inline" />}
                </button>
              </div>
            </div>
            <div className={`${mobilePreview ? 'block' : 'hidden'} flex-1 overflow-auto bg-slate-200/60 p-4 lg:block lg:p-6`}>
              {preview}
            </div>
          </div>
        </div>
      ) : (
        <CustomizeView resume={resume} scheduleSave={scheduleSave} onBack={() => setView('editor')} />
      )}

      {mountPrint && (
        <div id="print-resume-holder">
          <div ref={printRef}>
            <ResumeRenderer
              resume={resume}
              templateId={resume.templateId}
              accentColor={resume.accentColor}
              fontFamily={resume.fontFamily}
            />
          </div>
        </div>
      )}

      <DownloadModal
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        resume={resume}
        getExportTarget={() => ({
          element: printRef.current,
          html: printRef.current?.innerHTML || '',
        })}
      />
    </div>
  );
}
