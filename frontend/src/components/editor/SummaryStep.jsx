'use client';
import { Sparkles } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import AIButton from './AIButton';
import TipsDropdown from './TipsDropdown';

const SUMMARY_TEMPLATES = [
  {
    label: 'Experienced Professional',
    content: 'Results-driven professional with [X] years of experience in [industry/field]. Proven track record of [key achievement]. Skilled in [top 2-3 skills] with a passion for [relevant area]. Seeking to leverage expertise in [skill] to drive [impact] at [type of company].',
  },
  {
    label: 'Career Changer',
    content: 'Dynamic professional transitioning from [previous field] to [new field]. Bringing [X] years of transferable skills including [skill 1], [skill 2], and [skill 3]. Eager to apply [previous experience] to [new role] and deliver [value proposition].',
  },
  {
    label: 'Recent Graduate',
    content: 'Motivated [degree] graduate with a strong foundation in [relevant coursework/skills]. Completed [internship/project] at [organization], gaining hands-on experience in [key area]. Passionate about [field] and committed to continuous learning and professional growth.',
  },
  {
    label: 'Leadership Focus',
    content: 'Strategic leader with [X] years of experience driving [business outcome] through [approach]. Led cross-functional teams of [X] members to deliver [result]. Expertise in [domain] with a proven ability to [key strength]. Committed to [leadership philosophy].',
  },
];

export default function SummaryStep({ value, onUpdate, jobTitle }) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Professional Summary</h2>
          <p className="mt-1 text-sm text-slate-500">Write a compelling summary that highlights your strengths and career goals.</p>
        </div>
        <TipsDropdown section="summary" />
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Your summary</span>
          <AIButton endpoint="summary"
            payload={{ jobTitle: jobTitle || 'Professional', experience: '', skills: '' }}
            label="Generate with AI"
            onResult={(r) => onUpdate(r)} />
        </div>
        <RichTextEditor
          value={value}
          onChange={onUpdate}
          placeholder="Write 2-4 sentences about your professional background, key skills, and career goals…"
          rows={6}
        />
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          <Sparkles size={14} className="mr-1 inline text-amber-500" />
          Suggested summary structure
        </h3>
        <div className="space-y-2">
          {SUMMARY_TEMPLATES.map((tmpl, i) => (
            <button key={i} onClick={() => onUpdate(tmpl.content)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-blue-300 hover:bg-blue-50 group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600">{tmpl.label}</span>
                <span className="text-[11px] text-slate-400 group-hover:text-blue-500">Click to use →</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 line-clamp-2">{tmpl.content}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
