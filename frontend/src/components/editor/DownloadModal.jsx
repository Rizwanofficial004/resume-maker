'use client';

import { useEffect, useState } from 'react';
import { X, FileText, FileType2, Files, Loader2, Check } from 'lucide-react';
import { downloadResume } from '@/lib/export';
import { useToast } from '@/components/Toast';

const FORMATS = [
  {
    id: 'pdf',
    label: 'PDF',
    ext: '.pdf',
    description: 'Best for applications and ATS uploads',
    icon: FileText,
  },
  {
    id: 'word',
    label: 'Word',
    ext: '.doc',
    description: 'Opens in Microsoft Word and LibreOffice',
    icon: FileType2,
  },
  {
    id: 'docs',
    label: 'Docs',
    ext: '.docx',
    description: 'Editable DOCX for Google Docs and Word',
    icon: Files,
  },
];

export default function DownloadModal({ open, onClose, resume, getExportTarget }) {
  const toast = useToast();
  const [selected, setSelected] = useState('pdf');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape' && !downloading) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, downloading, onClose]);

  if (!open) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const target = typeof getExportTarget === 'function' ? getExportTarget() : {};
      await downloadResume(selected, {
        resume,
        element: target.element,
        html: target.html,
      });
      const label = FORMATS.find((f) => f.id === selected)?.label || selected;
      toast.success(`${label} downloaded successfully`);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        aria-label="Close download dialog"
        disabled={downloading}
        onClick={() => !downloading && onClose()}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-modal-title"
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="download-modal-title" className="text-lg font-bold text-slate-900">
              Download resume
            </h2>
            <p className="mt-1 text-sm text-slate-500">Choose a format, then download.</p>
          </div>
          <button
            type="button"
            onClick={() => !downloading && onClose()}
            disabled={downloading}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-2">
          {FORMATS.map((format) => {
            const Icon = format.icon;
            const active = selected === format.id;
            return (
              <button
                key={format.id}
                type="button"
                onClick={() => setSelected(format.id)}
                disabled={downloading}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                  active
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{format.label}</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-slate-500">
                      {format.ext}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">{format.description}</span>
                </span>
                {active && (
                  <Check size={18} className="shrink-0 text-blue-600" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => !downloading && onClose()}
            disabled={downloading}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {downloading ? <Loader2 size={16} className="animate-spin" /> : null}
            {downloading ? 'Downloading…' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
}
