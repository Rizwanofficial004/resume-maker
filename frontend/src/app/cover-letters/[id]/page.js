'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Sparkles, Check, Save, Printer, FileDown } from 'lucide-react';
import AppShell from '@/components/AppShell';
import AIButton from '@/components/editor/AIButton';
import { Field } from '@/components/editor/fields';
import { apiFetch } from '@/lib/api';

export default function CoverLetterEditor() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const previewRef = useRef(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch(`/api/cover-letters/${id}`);
        setLetter(data);
      } catch (err) {
        alert(err.message);
        router.push('/cover-letters');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, router]);

  const save = useCallback(
    async (next) => {
      setSaving(true);
      try {
        const saved = await apiFetch(`/api/cover-letters/${id}`, {
          method: 'PUT',
          body: { title: next.title, data: next },
        });
        setLetter(saved);
        setSavedAt(new Date());
      } catch (err) {
        alert(err.message);
      } finally {
        setSaving(false);
      }
    },
    [id]
  );

  const update = (key) => (value) => {
    setLetter((prev) => {
      const next = { ...prev, [key]: value };
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => save(next), 900);
      return next;
    });
  };

  const handlePrint = () => {
    const w = window.open('', '_blank', 'width=800,height=1000');
    if (!w) return;
    const content = previewRef.current.innerHTML;
    w.document.write(`<html><head><title>${letter.title || 'Cover Letter'}</title>
      <style>body{font-family:Georgia,serif;margin:60px;font-size:15px;line-height:1.7;color:#1f2937;} @media print{body{margin:40px;}}</style>
      </head><body>${content}</body></html>`);
    w.document.close();
    setTimeout(() => {
      w.focus();
      w.print();
    }, 300);
  };

  const handleWord = () => {
    const content = previewRef.current.innerHTML;
    const blob = new Blob(['\ufeff<html><body>' + content + '</body></html>'], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(letter.title || 'cover-letter').toLowerCase().replace(/\s+/g, '-')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !letter) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 size={26} className="animate-spin" />
        </div>
      </AppShell>
    );
  }

  const bodyLines = (letter.body || '').split('\n');

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/cover-letters" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-200/60 hover:text-slate-900">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <input
              value={letter.title}
              onChange={(e) => update('title')(e.target.value)}
              className="w-64 rounded-lg border border-transparent bg-transparent px-2 py-1 text-lg font-bold text-slate-900 transition hover:border-slate-300 focus:border-brand-500 focus:outline-none"
            />
            <div className="flex items-center gap-1.5 px-2 text-xs text-slate-400">
              {saving ? (
                <><Loader2 size={12} className="animate-spin" /> Saving…</>
              ) : savedAt ? (
                <><Check size={12} className="text-emerald-500" /> Saved {savedAt.toLocaleTimeString()}</>
              ) : (
                <><Save size={12} /> Auto-save on</>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleWord} className="btn-secondary !px-3.5">
            <FileDown size={16} /> Word
          </button>
          <button onClick={handlePrint} className="btn-primary !px-3.5">
            <Printer size={16} /> Print / PDF
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="max-h-[calc(100vh-190px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Letter details</h3>
            <AIButton
              endpoint="cover-letter"
              payload={{ recipientName: letter.recipientName, companyName: letter.companyName, jobTitle: letter.jobTitle, body: letter.body }}
              label="Generate with AI"
              onResult={(r) => update('body')(r)}
            />
          </div>
          <div className="space-y-4">
            <Field label="Hiring manager / recipient" value={letter.recipientName} onChange={update('recipientName')} placeholder="Hiring Manager" />
            <Field label="Company name" value={letter.companyName} onChange={update('companyName')} placeholder="TechNova" />
            <Field label="Job title" value={letter.jobTitle} onChange={update('jobTitle')} placeholder="Senior Frontend Developer" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Your name" value={letter.senderName} onChange={update('senderName')} placeholder="Anna Peterson" />
              <Field label="Date" value={letter.date} onChange={update('date')} placeholder="Aug 4, 2026" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Your email" value={letter.senderEmail} onChange={update('senderEmail')} placeholder="you@email.com" />
              <Field label="Your phone" value={letter.senderPhone} onChange={update('senderPhone')} placeholder="+1 555 000 0000" />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="label !mb-0">Letter body</label>
                <span className="text-[11px] text-slate-400">{bodyLines.length} paragraphs</span>
              </div>
              <textarea
                value={letter.body}
                onChange={(e) => update('body')(e.target.value)}
                rows={16}
                placeholder={"Dear Hiring Manager,\n\nI'm writing to express my interest in…\n\nSincerely,\nAnna"}
                className="input resize-y font-serif text-[13px]"
              />
            </div>
            <Field label="Closing" value={letter.closing} onChange={update('closing')} placeholder="Sincerely" />
          </div>
        </div>

        <div>
          <div className="pointer-events-none absolute z-10 hidden" />
          <div className="overflow-auto rounded-2xl border border-slate-200 bg-slate-200/60 p-6" style={{ maxHeight: 'calc(100vh - 190px)' }}>
            <div ref={previewRef} className="mx-auto max-w-[210mm] bg-white p-12 shadow-lift" style={{ fontFamily: 'Georgia, serif' }}>
              {letter.date && <p className="text-sm text-slate-600">{letter.date}</p>}
              <div className="mt-8 space-y-1 text-sm">
                {letter.senderName && <p className="font-semibold text-slate-900">{letter.senderName}</p>}
                {letter.senderEmail && <p>{letter.senderEmail}</p>}
                {letter.senderPhone && <p>{letter.senderPhone}</p>}
              </div>
              <p className="mt-8 text-sm">
                {letter.recipientName || 'Dear Hiring Manager'},
                {letter.companyName && (
                  <>
                    <br />
                    {letter.companyName}
                  </>
                )}
              </p>
              <div className="mt-6 whitespace-pre-wrap text-[15px] leading-7 text-slate-800">
                {letter.body || <span className="text-slate-300">Your letter will appear here…</span>}
              </div>
              {letter.closing && (
                <div className="mt-8 text-[15px] text-slate-800">
                  <p>{letter.closing},</p>
                  <p className="mt-6 font-semibold">{letter.senderName || 'Your Name'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
