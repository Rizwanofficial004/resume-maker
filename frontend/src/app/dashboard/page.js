'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Loader2, Sparkles, ArrowRight, CheckCircle2, Circle, Briefcase, Clock, PenLine } from 'lucide-react';
import AppShell from '@/components/AppShell';
import CreateResumeModal from '@/components/CreateResumeModal';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast';

const CHECKLIST = [
  { key: 'contact', label: 'Contact information', desc: 'Add your name, phone, email' },
  { key: 'experience', label: 'Work experience', desc: 'Add at least one position' },
  { key: 'education', label: 'Education', desc: 'Include your degree' },
  { key: 'skills', label: 'Skills', desc: 'Add 3 or more skills' },
];

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch('/api/resumes');
      setResumes(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load resumes');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const latestResume = resumes[0];

  const getChecklistStatus = (r) => {
    if (!r) return {};
    return {
      contact: !!(r.personal?.firstName && r.personal?.email),
      experience: (r.experience?.length || 0) > 0,
      education: (r.education?.length || 0) > 0,
      skills: (r.skills?.length || 0) >= 3,
    };
  };

  const checklistStatus = getChecklistStatus(latestResume);
  const completedCount = Object.values(checklistStatus).filter(Boolean).length;

  return (
    <AppShell>
    <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Welcome back, {user?.firstName || 'there'}</p>
          </div>
          <button type="button" onClick={() => setShowCreate(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition">
            <Plus size={16} />
            Create new resume
          </button>
        </div>

        {latestResume && (
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Job-winning resume checklist</h2>
              <span className="text-xs font-medium text-slate-500">{completedCount}/{CHECKLIST.length} completed</span>
            </div>
            <div className="space-y-2">
              {CHECKLIST.map((item) => (
                <button key={item.key} type="button" onClick={() => router.push(`/editor/${latestResume._id}`)}
                  className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-slate-50">
                  {checklistStatus[item.key] ? (
                    <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
                  ) : (
                    <Circle size={18} className="shrink-0 text-slate-300" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${checklistStatus[item.key] ? 'text-emerald-700' : 'text-slate-700'}`}>{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  {!checklistStatus[item.key] && <ArrowRight size={14} className="text-slate-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
            <h2 className="text-sm font-bold text-slate-900">Recent resumes</h2>
            <button type="button" onClick={() => router.push('/documents')} className="text-xs font-medium text-blue-600 hover:text-blue-700">
              View all documents →
            </button>
          </div>

          <div className="hidden grid-cols-12 gap-4 border-b border-slate-100 px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:grid">
            <div className="col-span-6">Resume</div>
            <div className="col-span-2">ATS Score</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2" />
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 size={20} className="animate-spin text-slate-400" /></div>
          ) : resumes.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <FileText size={32} className="text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No resumes yet. Create your first one!</p>
            </div>
          ) : (
            resumes.slice(0, 5).map((r) => (
              <div key={r._id} className="flex flex-col gap-3 border-b border-slate-50 px-5 py-3 transition hover:bg-slate-50 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4">
                <div className="flex items-center gap-3 sm:col-span-6">
                  <div className="flex h-10 w-8 items-center justify-center rounded bg-blue-50 text-blue-600">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{r.title || 'Untitled Resume'}</p>
                    <p className="text-xs text-slate-400">{r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Not saved'}</p>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  {typeof r.atsScore === 'number' && r.atsScore > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      {r.atsScore}%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Not scored</span>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                    <Clock size={11} /> {r.reviewStatus && r.reviewStatus !== 'none' ? r.reviewStatus : 'Draft'}
                  </span>
                </div>
                <div className="flex justify-end sm:col-span-2">
                  <button type="button" onClick={() => router.push(`/editor/${r._id}`)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Edit">
                    <PenLine size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Find jobs</h2>
              <button type="button" onClick={() => router.push('/jobs')} className="text-xs font-medium text-blue-600 hover:text-blue-700">Browse jobs →</button>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4">
              <Briefcase size={18} className="mt-0.5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-800">Explore sample listings</p>
                <p className="mt-1 text-xs text-slate-500">Browse demo roles and save ones you like while you finish your resume.</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">AI credits</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">{user?.aiCredits ?? 0}</p>
            <p className="mt-1 text-xs text-slate-500">Used for import, summary, bullets, and spell check. Plan: {user?.plan || 'free'}.</p>
            <button type="button" onClick={() => router.push('/account')} className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Account settings
            </button>
          </div>
        </div>
      </div>
      <CreateResumeModal open={showCreate} onClose={() => setShowCreate(false)} />
    </AppShell>
  );
}
