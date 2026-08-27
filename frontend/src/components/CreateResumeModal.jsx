'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FilePlus2, Upload, X, Loader2, FileText } from 'lucide-react';
import { apiFetch, apiUpload } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast';

const ACCEPT = '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export default function CreateResumeModal({ open, onClose }) {
  const router = useRouter();
  const toast = useToast();
  const { updateUser, user, refreshUser } = useAuth();
  const inputRef = useRef(null);
  const [step, setStep] = useState('choose'); // choose | upload
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const resetAndClose = useCallback(() => {
    if (busy) return;
    setStep('choose');
    setDragOver(false);
    onClose?.();
  }, [busy, onClose]);

  const createBlank = async () => {
    setBusy(true);
    try {
      const created = await apiFetch('/api/resumes', {
        method: 'POST',
        body: { title: 'Untitled Resume' },
      });
      toast.success('Resume created');
      onClose?.();
      router.push(`/editor/${created._id}`);
    } catch (err) {
      toast.error(err.message || 'Could not create resume');
      setBusy(false);
    }
  };

  const importFile = async (file) => {
    if (!file) return;
    const name = file.name?.toLowerCase() || '';
    const ok =
      name.endsWith('.pdf') ||
      name.endsWith('.docx') ||
      file.type === 'application/pdf' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (!ok) {
      toast.error('Please upload a PDF or DOCX file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large (max 5MB).');
      return;
    }

    setBusy(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const created = await apiUpload('/api/resumes/import', form);
      if (typeof created.aiCredits === 'number' && user) {
        updateUser({ ...user, aiCredits: created.aiCredits });
      } else {
        try {
          await refreshUser();
        } catch {
          /* ignore */
        }
      }
      toast.success('Resume imported — review and edit the details');
      onClose?.();
      router.push(`/editor/${created._id}`);
    } catch (err) {
      toast.error(err.message || 'Import failed');
      setBusy(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) importFile(file);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={resetAndClose}
        disabled={busy}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-resume-title"
        className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id="create-resume-title" className="text-lg font-bold text-slate-900">
            {step === 'choose' ? 'Create a resume' : 'Upload existing resume'}
          </h2>
          <button
            type="button"
            onClick={resetAndClose}
            disabled={busy}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {step === 'choose' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={createBlank}
                disabled={busy}
                className="flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-left transition hover:border-blue-400 hover:bg-blue-50/50 disabled:opacity-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                  {busy ? <Loader2 size={18} className="animate-spin" /> : <FilePlus2 size={18} />}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">Start from scratch</span>
                  <span className="mt-1 block text-xs text-slate-500">
                    Blank resume — fill sections in the editor.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStep('upload')}
                disabled={busy}
                className="flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-left transition hover:border-blue-400 hover:bg-blue-50/50 disabled:opacity-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <Upload size={18} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">Upload existing</span>
                  <span className="mt-1 block text-xs text-slate-500">
                    PDF or Word — we extract your content with AI (1 credit).
                  </span>
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Upload a text-based PDF or DOCX. Scanned image-only PDFs may not work.
              </p>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 transition ${
                  dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'
                }`}
              >
                {busy ? (
                  <>
                    <Loader2 size={28} className="animate-spin text-blue-600" />
                    <p className="mt-3 text-sm font-medium text-slate-800">Reading resume…</p>
                    <p className="mt-1 text-xs text-slate-500">This can take up to a minute</p>
                  </>
                ) : (
                  <>
                    <FileText size={28} className="text-slate-400" />
                    <p className="mt-3 text-sm font-medium text-slate-800">Drop your file here</p>
                    <p className="mt-1 text-xs text-slate-500">PDF or DOCX, max 5MB</p>
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Choose file
                    </button>
                    <input
                      ref={inputRef}
                      type="file"
                      accept={ACCEPT}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        if (file) importFile(file);
                      }}
                    />
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => !busy && setStep('choose')}
                disabled={busy}
                className="text-sm font-medium text-slate-500 hover:text-slate-800 disabled:opacity-50"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
