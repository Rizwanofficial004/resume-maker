'use client';

import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Field, TextArea } from './fields';
import AIButton from './AIButton';

export default function PersonalEditor({ personal, update, summary, setSummary }) {
  const set = (key) => (value) => update('personal', key, value);
  const fileRef = useRef(null);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set('photo')(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Photo upload */}
      <div className="flex items-center gap-3">
        {personal.photo ? (
          <div className="relative">
            <img src={personal.photo} alt="Profile" className="h-16 w-16 rounded-full object-cover" />
            <button
              onClick={() => set('photo')('')}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-red-600"
              title="Remove photo"
            >
              <X size={11} />
            </button>
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-slate-300">
            <ImagePlus size={20} />
          </div>
        )}
        <div>
          <button onClick={() => fileRef.current?.click()} className="btn-secondary !py-1.5 text-xs">
            <ImagePlus size={14} /> Upload photo
          </button>
          <p className="mt-1 text-[11px] text-slate-400">Optional · JPEG/PNG, under 2MB</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" value={personal.firstName} onChange={set('firstName')} placeholder="Anna" />
        <Field label="Last name" value={personal.lastName} onChange={set('lastName')} placeholder="Peterson" />
      </div>
      <Field label="Job title" value={personal.jobTitle} onChange={set('jobTitle')} placeholder="Senior Frontend Developer" />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email" value={personal.email} onChange={set('email')} placeholder="you@example.com" type="email" />
        <Field label="Phone" value={personal.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="City" value={personal.city} onChange={set('city')} placeholder="San Francisco" />
        <Field label="State" value={personal.state} onChange={set('state')} placeholder="CA" />
        <Field label="Country" value={personal.country} onChange={set('country')} placeholder="United States" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Website" value={personal.website} onChange={set('website')} placeholder="yourwebsite.com" />
        <Field label="LinkedIn" value={personal.linkedin} onChange={set('linkedin')} placeholder="linkedin.com/in/you" />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="label !mb-0">Professional summary</label>
          <AIButton
            endpoint="summary"
            payload={{ personal, jobTitle: personal.jobTitle, experience: [] }}
            label="Generate with AI"
            small
            onResult={(r) => setSummary(r)}
          />
        </div>
        <textarea
          value={personal.summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={5}
          placeholder="Write a short summary of your professional background and top strengths…"
          className="input resize-y"
        />
        {summary && (
          <p className="mt-2 rounded-lg border border-brand-100 bg-brand-50 p-3 text-xs leading-relaxed text-slate-600">
            💡 Tip: keep your summary 3–5 sentences and include keywords from the job description.
          </p>
        )}
      </div>
    </div>
  );
}
