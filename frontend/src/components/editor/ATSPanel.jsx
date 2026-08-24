'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';
import { analyzeATS } from '@/lib/ats';
import AIButton from './AIButton';

export default function ATSPanel({ resume, onRefresh }) {
  const [target, setTarget] = useState(resume.personal?.jobTitle || '');

  const result = useMemo(() => analyzeATS(resume, target), [resume, target]);

  const addMissingKeywords = (autoKeywords) => {
    const current = new Set((resume.skills || []).map((s) => s.name.toLowerCase().trim()));
    const toAdd = result.missingKeywords
      .concat(autoKeywords || [])
      .filter((k) => !current.has(k.toLowerCase()))
      .slice(0, 10);
    if (toAdd.length === 0) {
      onRefresh({ ...resume, skills: resume.skills || [], atsAdded: true });
      return;
    }
    const newSkills = [
      ...(resume.skills || []),
      ...toAdd.map((k) => ({ id: `ats_${k.replace(/\s+/g, '_')}_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`, name: k, level: 3 })),
    ];
    onRefresh({ ...resume, skills: newSkills });
  };

  const ringStyle = {
    stroke: result.color,
    strokeDasharray: `${result.score} ${100 - result.score}`,
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <ShieldCheck size={16} className="text-brand-600" /> ATS Score
        </h3>
        <AIButton
          endpoint="keywords"
          payload={{ jobTitle: target || resume.personal?.jobTitle || 'professional' }}
          label="AI keywords"
          small
          onResult={(kws) => addMissingKeywords(kws)}
        />
      </div>

      <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-4">
        {/* Score gauge */}
        <div className="relative h-24 w-24">
          <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" strokeWidth="10" className="stroke-slate-100" />
            <circle cx="50" cy="50" r="42" fill="none" strokeWidth="10" strokeLinecap="round" style={ringStyle} transition="stroke-dasharray 0.6s" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: result.color }}>{result.score}</span>
            <span className="text-[10px] uppercase tracking-wide text-slate-400">/100</span>
          </div>
        </div>

        <div>
          <p className="text-lg font-bold" style={{ color: result.color }}>{result.grade}</p>
          <p className="text-xs text-slate-500">Target role: <span className="font-medium text-slate-700">{target || '— not set —'}</span></p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {result.score >= 70
              ? 'Great — your resume should pass most ATS scanners. See the checklist below to polish further.'
              : 'Your resume may be filtered out by ATS software. Fix the flagged items to boost your chances.'}
          </p>
        </div>
      </div>

      {/* Target role input */}
      <div className="mt-3 flex items-center gap-2">
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target job title (e.g. Senior Frontend Developer)"
          className="input text-xs"
        />
        <span className="shrink-0 text-[10px] text-slate-400">
          Matching: <span className="font-semibold capitalize text-brand-600">{result.roleKey}</span>
        </span>
      </div>

      {/* Checklist */}
      <div className="mt-4 space-y-1.5">
        {result.checks.map((c) => (
          <div key={c.label} className="flex items-start gap-2 text-xs text-slate-700">
            {c.pass ? (
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
            ) : (
              <XCircle size={14} className="mt-0.5 shrink-0 text-red-400" />
            )}
            <span className={c.pass ? '' : 'font-medium text-red-600'}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Missing keywords */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1 text-xs font-semibold text-slate-900">
            <AlertTriangle size={13} className="text-amber-500" /> Missing {result.missingKeywords.length} keyword(s)
          </p>
          {result.missingKeywords.length > 0 && (
            <button onClick={() => addMissingKeywords()} className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2 py-1 text-[11px] font-semibold text-brand-700 hover:bg-brand-100">
              <Sparkles size={11} /> Add all as skills
            </button>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {result.missingKeywords.map((k) => (
            <span key={k} className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
              {k}
            </span>
          ))}
          {result.missingKeywords.length === 0 && (
            <span className="text-xs text-emerald-600">No missing keywords — nice keyword coverage!</span>
          )}
        </div>
      </div>

      <button
        onClick={() => setTarget(resume.personal?.jobTitle || '')}
        className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-600"
      >
        <RefreshCw size={11} /> Reset to resume job title
      </button>
    </div>
  );
}