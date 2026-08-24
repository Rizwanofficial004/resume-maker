'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Loader2, Sparkles, ArrowRight, CheckCircle2, Circle, Briefcase, Clock, Eye, Download, MoreHorizontal, PenLine } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const CHECKLIST = [
  { key: 'contact', label: 'Contact information', desc: 'Add your name, phone, email' },
  { key: 'experience', label: 'Work experience', desc: 'Add at least one position' },
  { key: 'education', label: 'Education', desc: 'Include your degree' },
  { key: 'skills', label: 'Skills', desc: 'Add 3 or more skills' },
];

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [docTab, setDocTab] = useState('resumes');

  const load = useCallback(async () => {
    try {
      const data = await apiFetch('/api/resumes');
      setResumes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const createResume = async () => {
    setCreating(true);
    try {
      const created = await apiFetch('/api/resumes', {
        method: 'POST',
        body: { title: 'Untitled Resume' },
      });
      router.push(`/editor/${created._id}`);
    } catch (err) {
      alert(err.message);
      setCreating(false);
    }
  };

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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Welcome back, {user?.firstName || 'there'}</p>
          </div>
          <button onClick={createResume} disabled={creating}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50">
            {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Create new resume
          </button>
        </div>

        {/* Job-winning resume checklist */}
        {latestResume && (
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">Job-winning resume checklist</h2>
              <span className="text-xs font-medium text-slate-500">{completedCount}/{CHECKLIST.length} completed</span>
            </div>
            <div className="space-y-2">
              {CHECKLIST.map(item => (
                <button key={item.key} onClick={() => router.push(`/editor/${latestResume._id}`)}
                  className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-slate-50 transition">
                  {checklistStatus[item.key] ? (
                    <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
                  ) : (
                    <Circle size={18} className="shrink-0 text-slate-300" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${checklistStatus[item.key] ? 'text-emerald-700' : 'text-slate-700'}`}>{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  {!checklistStatus[item.key] && (
                    <ArrowRight size={14} className="text-slate-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Documents section */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-4 border-b border-slate-200 px-5 py-3">
            <button onClick={() => setDocTab('resumes')}
              className={`text-sm font-semibold transition ${docTab === 'resumes' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
              Resumes
            </button>
            <button onClick={() => setDocTab('cover-letters')}
              className={`text-sm font-semibold transition ${docTab === 'cover-letters' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
              Cover Letters
            </button>
          </div>

          {docTab === 'resumes' ? (
            <>
              <div className="grid grid-cols-12 gap-4 border-b border-slate-100 px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <div className="col-span-5">Resume</div>
                <div className="col-span-2">ATS Score</div>
                <div className="col-span-2">Review Status</div>
                <div className="col-span-2">Attachments</div>
                <div className="col-span-1" />
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-12"><Loader2 size={20} className="animate-spin text-slate-400" /></div>
              ) : resumes.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <FileText size={32} className="text-slate-300" />
                  <p className="mt-3 text-sm text-slate-500">No resumes yet. Create your first one!</p>
                </div>
              ) : (
                resumes.map(r => (
                  <div key={r._id} className="grid grid-cols-12 items-center gap-4 border-b border-slate-50 px-5 py-3 hover:bg-slate-50 transition">
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="flex h-10 w-8 items-center justify-center rounded bg-blue-50 text-blue-600">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{r.title || 'Untitled Resume'}</p>
                        <p className="text-xs text-slate-400">{r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Not saved'}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        {r.atsScore || 85}%
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                        <Clock size={11} /> {r.reviewStatus || 'Pending'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-slate-500">PDF</span>
                    </div>
                    <div className="col-span-1 flex items-center justify-end gap-1">
                      <button onClick={() => router.push(`/editor/${r._id}`)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Edit">
                        <PenLine size={14} />
                      </button>
                      <button className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="More">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <div className="flex flex-col items-center py-12 text-center">
              <PenLine size={32} className="text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No cover letters yet.</p>
              <button onClick={() => router.push('/cover-letters')} className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700">
                Create a cover letter →
              </button>
            </div>
          )}
        </div>

        {/* Recommended Jobs & Promos */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">Recommended Jobs</h2>
              <button onClick={() => router.push('/jobs')} className="text-xs font-medium text-blue-600 hover:text-blue-700">View all →</button>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Senior Frontend Developer', company: 'TechCorp', location: 'Remote', salary: '$120k - $160k' },
                { title: 'Full Stack Engineer', company: 'StartupXYZ', location: 'Hybrid', salary: '$100k - $140k' },
                { title: 'React Developer', company: 'InnovateCo', location: 'Remote', salary: '$90k - $130k' },
              ].map((job, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition cursor-pointer">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Briefcase size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{job.title}</p>
                    <p className="text-xs text-slate-500">{job.company} · {job.location}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{job.salary}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-blue-900">Get Interview Guide</h3>
              </div>
              <p className="text-xs text-blue-700 mb-3">Master your next interview with our comprehensive guide.</p>
              <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition">
                Learn More
              </button>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">
              <div className="flex items-center gap-2 mb-2">
                <PenLine size={18} className="text-purple-600" />
                <h3 className="text-sm font-bold text-purple-900">LinkedIn Profile Boosting</h3>
              </div>
              <p className="text-xs text-purple-700 mb-3">Optimize your LinkedIn profile to attract recruiters.</p>
              <button className="w-full rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 transition">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
