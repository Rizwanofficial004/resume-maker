'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PenLine, Plus, Loader2, Trash2, Pencil } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { apiFetch } from '@/lib/api';

export default function CoverLettersPage() {
  const router = useRouter();
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch('/api/cover-letters');
      setLetters(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    setCreating(true);
    try {
      const created = await apiFetch('/api/cover-letters', {
        method: 'POST',
        body: { title: 'New Cover Letter' },
      });
      router.push(`/cover-letters/${created._id}`);
    } catch (err) {
      alert(err.message);
      setCreating(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this cover letter?')) return;
    try {
      await apiFetch(`/api/cover-letters/${id}`, { method: 'DELETE' });
      setLetters((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cover Letters</h1>
          <p className="mt-1 text-sm text-slate-500">Write a compelling intro that makes a great first impression.</p>
        </div>
        <button onClick={create} disabled={creating} className="btn-primary">
          {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          New Cover Letter
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 size={26} className="animate-spin" />
        </div>
      ) : letters.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <PenLine size={30} />
          </span>
          <h3 className="mt-5 text-lg font-semibold text-slate-900">No cover letters yet</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Write your first cover letter — or let AI draft one for you in seconds.
          </p>
          <button onClick={create} className="btn-primary mt-6">
            <Plus size={16} /> Create Cover Letter
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {letters.map((letter) => (
            <div key={letter._id} className="card group cursor-pointer p-5 transition-all hover:-translate-y-1 hover:shadow-lift" onClick={() => router.push(`/cover-letters/${letter._id}`)}>
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <PenLine size={20} />
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); remove(letter._id); }}
                  className="text-slate-300 transition hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{letter.title}</h3>
              <p className="mt-1 text-xs text-slate-500">
                {letter.companyName ? `To ${letter.companyName}` : 'Draft'} · Updated {new Date(letter.updatedAt).toLocaleDateString()}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                <Pencil size={13} /> Continue editing
              </span>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
