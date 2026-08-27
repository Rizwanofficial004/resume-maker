'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, PenLine, Loader2, Plus, Trash2, Copy } from 'lucide-react';
import AppShell from '@/components/AppShell';
import CreateResumeModal from '@/components/CreateResumeModal';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/components/Toast';

export default function DocumentsPage() {
  const router = useRouter();
  const toast = useToast();
  const [tab, setTab] = useState('resumes');
  const [resumes, setResumes] = useState([]);
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [r, c] = await Promise.all([
        apiFetch('/api/resumes'),
        apiFetch('/api/cover-letters'),
      ]);
      setResumes(r);
      setLetters(c);
    } catch (err) {
      toast.error(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const createLetter = async () => {
    setCreating(true);
    try {
      const created = await apiFetch('/api/cover-letters', {
        method: 'POST',
        body: { title: 'Untitled Cover Letter' },
      });
      router.push(`/cover-letters/${created._id}`);
    } catch (err) {
      toast.error(err.message);
      setCreating(false);
    }
  };

  const deleteResume = async (id) => {
    if (!confirm('Delete this resume?')) return;
    try {
      await apiFetch(`/api/resumes/${id}`, { method: 'DELETE' });
      setResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success('Resume deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const duplicateResume = async (id) => {
    try {
      const created = await apiFetch(`/api/resumes/${id}/duplicate`, { method: 'POST' });
      setResumes((prev) => [created, ...prev]);
      toast.success('Resume duplicated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteLetter = async (id) => {
    if (!confirm('Delete this cover letter?')) return;
    try {
      await apiFetch(`/api/cover-letters/${id}`, { method: 'DELETE' });
      setLetters((prev) => prev.filter((l) => l._id !== id));
      toast.success('Cover letter deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
            <p className="mt-1 text-sm text-slate-500">All your resumes and cover letters in one place.</p>
          </div>
          <button
            type="button"
            onClick={tab === 'resumes' ? () => setShowCreate(true) : createLetter}
            disabled={creating}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {tab === 'resumes' ? 'New resume' : 'New cover letter'}
          </button>
        </div>

        <div className="mt-6 flex gap-4 border-b border-slate-200">
          {[
            { id: 'resumes', label: `Resumes (${resumes.length})` },
            { id: 'letters', label: `Cover letters (${letters.length})` },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={24} className="animate-spin text-slate-400" />
          </div>
        ) : tab === 'resumes' ? (
          resumes.length === 0 ? (
            <Empty
              icon={FileText}
              title="No resumes yet"
              actionLabel="Create your first resume"
              onAction={() => setShowCreate(true)}
            />
          ) : (
            <ul className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
              {resumes.map((r) => (
                <li key={r._id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => router.push(`/editor/${r._id}`)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <FileText size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-900">{r.title || 'Untitled Resume'}</span>
                      <span className="block text-xs text-slate-400">
                        Updated {r.updatedAt ? new Date(r.updatedAt).toLocaleString() : '—'}
                        {typeof r.atsScore === 'number' ? ` · ATS ${r.atsScore}%` : ''}
                      </span>
                    </span>
                  </button>
                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    <button type="button" onClick={() => duplicateResume(r._id)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Duplicate">
                      <Copy size={16} />
                    </button>
                    <button type="button" onClick={() => deleteResume(r._id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : letters.length === 0 ? (
          <Empty
            icon={PenLine}
            title="No cover letters yet"
            actionLabel="Create a cover letter"
            onAction={createLetter}
          />
        ) : (
          <ul className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {letters.map((l) => (
              <li key={l._id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => router.push(`/cover-letters/${l._id}`)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <PenLine size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-900">{l.title || 'Untitled Cover Letter'}</span>
                    <span className="block text-xs text-slate-400">
                      {l.companyName || 'No company'} · Updated {l.updatedAt ? new Date(l.updatedAt).toLocaleString() : '—'}
                    </span>
                  </span>
                </button>
                <button type="button" onClick={() => deleteLetter(l._id)} className="self-end rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 sm:self-auto" title="Delete">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <CreateResumeModal open={showCreate} onClose={() => setShowCreate(false)} />
    </AppShell>
  );
}

function Empty({ icon: Icon, title, actionLabel, onAction }) {
  return (
    <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <Icon size={36} className="text-slate-300" />
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <button type="button" onClick={onAction} className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700">
        {actionLabel} →
      </button>
    </div>
  );
}
