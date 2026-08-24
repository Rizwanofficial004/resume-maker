'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Copy, Trash2, Download, Pencil, MoreVertical, Loader2, Plus } from 'lucide-react';
import ResumePreviewMock from '@/components/ResumePreviewMock';
import { apiFetch } from '@/lib/api';

export default function ResumeCard({ resume, onDelete, onRefresh }) {
  const router = useRouter();
  const [busy, setBusy] = useState('');
  const [confirm, setConfirm] = useState(false);

  const act = async (action) => {
    setBusy(action);
    try {
      if (action === 'edit') {
        router.push(`/editor/${resume._id}`);
        return;
      }
      if (action === 'duplicate') {
        await apiFetch(`/api/resumes/${resume._id}/duplicate`, { method: 'POST' });
        onRefresh();
      }
      if (action === 'delete') {
        await apiFetch(`/api/resumes/${resume._id}`, { method: 'DELETE' });
        onDelete(resume._id);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy('');
    }
  };

  const download = () => {
    router.push(`/editor/${resume._id}?print=1`);
  };

  return (
    <div className="card group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lift">
      <button onClick={() => router.push(`/editor/${resume._id}`)} className="block w-full cursor-pointer p-4 text-left">
        <div className="pointer-events-none overflow-hidden rounded-xl border border-slate-100">
          <ResumePreviewMock
            templateId={resume.templateId}
            accent={resume.accentColor}
            scale={0.24}
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 px-1">
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{resume.title}</p>
            <p className="mt-0.5 text-xs capitalize text-slate-500">
              {resume.templateId} · Updated {new Date(resume.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
            <Pencil size={15} />
          </span>
        </div>
      </button>

      <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
        <div className="flex items-center gap-1">
          <button title="Edit" onClick={() => act('edit')} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-brand-600">
            <Pencil size={16} />
          </button>
          <button title="Download PDF" onClick={download} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-brand-600">
            <Download size={16} />
          </button>
          <button title="Duplicate" onClick={() => act('duplicate')} disabled={busy === 'duplicate'} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-brand-600">
            {busy === 'duplicate' ? <Loader2 size={16} className="animate-spin" /> : <Copy size={16} />}
          </button>
        </div>
        {confirm ? (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500">Delete?</span>
            <button onClick={() => act('delete')} className="rounded bg-red-600 px-2 py-1 font-semibold text-white hover:bg-red-700">
              Yes
            </button>
            <button onClick={() => setConfirm(false)} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100">
              No
            </button>
          </div>
        ) : (
          <button title="Delete" onClick={() => setConfirm(true)} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
