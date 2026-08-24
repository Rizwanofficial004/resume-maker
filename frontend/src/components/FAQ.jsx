'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'What is ResumeMaster?',
    a: 'ResumeMaster is a modern online resume builder that helps you create a professional, ATS-friendly resume in minutes. Choose a template, fill in your details, and let AI help you write stronger bullet points.',
  },
  {
    q: 'What does ATS-friendly mean?',
    a: 'ATS stands for Applicant Tracking System — software that recruiters use to screen resumes before a human sees them. An ATS-friendly resume uses clean formatting, standard section headings, and keyword-rich content so the software can read it correctly.',
  },
  {
    q: 'Do I need design or writing experience?',
    a: 'Not at all. Every template is professionally designed and print-ready. For writing, our AI assistant rewrites and improves your bullets, generates summaries, and suggests keywords for the role you want.',
  },
  {
    q: 'Can I customize the templates?',
    a: 'Yes. Change accent colors, fonts, and rearrange sections. Each template works with your content so it always looks polished.',
  },
  {
    q: 'Can I download my resume?',
    a: 'Absolutely. Export your resume as a PDF for job applications, or download a Word-compatible version to edit in Microsoft Word or Google Docs.',
  },
  {
    q: 'Is my data safe?',
    a: 'Your resumes are stored securely and are private to your account. We never share your personal information.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-3xl">
      {FAQS.map((faq, i) => (
        <div key={i} className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
          >
            <span className="text-sm font-semibold text-slate-900 sm:text-base">{faq.q}</span>
            <ChevronDown
              size={18}
              className={`shrink-0 text-slate-400 transition-transform ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          {open === i && (
            <p className="animate-fade-up px-6 pb-5 text-sm leading-relaxed text-slate-600">{faq.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
