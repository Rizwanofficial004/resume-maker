'use client';
import { useState } from 'react';
import { ChevronDown, Lightbulb } from 'lucide-react';

const TIPS = {
  contacts: [
    'Use a professional email address (firstname.lastname@email.com)',
    'Add a professional phone number with country code',
    'Include your city and country — full address is not needed',
    'A professional photo is optional but recommended for some industries',
  ],
  experience: [
    'Start with your most recent position',
    'Use action verbs: Led, Built, Improved, Delivered, Collaborated',
    'Quantify achievements: percentages, numbers, and metrics stand out',
    'Focus on impact, not just responsibilities',
    'Keep bullet points concise — 1-2 lines each',
  ],
  education: [
    'Include your degree, institution, and dates',
    'Add GPA if it\'s 3.5 or higher',
    'Mention relevant coursework or honors',
    'If recently graduated, education can come before experience',
  ],
  skills: [
    'Match skills to the job description for ATS optimization',
    'Include both technical and soft skills',
    'List your strongest skills first',
    'Be specific: "React.js" beats "JavaScript frameworks"',
  ],
  summary: [
    'Keep it to 3-5 sentences',
    'Highlight your years of experience and key skills',
    'Mention your career goals or value proposition',
    'Avoid generic phrases — be specific about what you offer',
  ],
  finalize: [
    'Languages can set you apart — include proficiency levels',
    'Awards and honors add credibility',
    'Relevant hobbies can show cultural fit',
    'Custom sections let you add anything unique',
  ],
};

export default function TipsDropdown({ section }) {
  const [open, setOpen] = useState(false);
  const tips = TIPS[section] || [];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
      >
        <Lightbulb size={13} />
        {section.charAt(0).toUpperCase() + section.slice(1)} tips
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Tips for your {section}</h4>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
