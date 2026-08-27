'use client';

import { useRef, useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import TipsDropdown from './TipsDropdown';
import { MuiProvider, TextField, PhoneField } from './MuiFields';
import { useToast } from '@/components/Toast';

const CODES = ['+92', '+1', '+44', '+91', '+61', '+49', '+33', '+81', '+86', '+971'];
const MAX_PHOTO_BYTES = 800 * 1024;

export default function ContactsStep({ resume, updatePersonal }) {
  const p = resume.personal;
  const toast = useToast();
  const fileRef = useRef(null);
  const upd = (k) => (e) => updatePersonal(k, typeof e === 'object' && e?.target ? e.target.value : e);

  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error('Photo must be under 800KB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updatePersonal('photo', reader.result);
    reader.onerror = () => toast.error('Could not read image');
    reader.readAsDataURL(file);
  };

  return (
    <MuiProvider>
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[22px] font-bold text-slate-900">Contacts</h2>
            <p className="mt-1 text-sm text-slate-500">Add your up-to-date contact information so employers and recruiters can easily reach you.</p>
          </div>
          <TipsDropdown section="contacts" />
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-400">
            {p.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.photo} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <Camera size={24} />
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              {p.photo ? 'Change photo' : 'Upload photo'}
            </button>
            {p.photo && (
              <button
                type="button"
                onClick={() => updatePersonal('photo', '')}
                className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-red-500"
              >
                <Trash2 size={14} /> Remove
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhoto} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <TextField label="First name" value={p.firstName} onChange={upd('firstName')} />
          <TextField label="Last name" value={p.lastName} onChange={upd('lastName')} />
        </div>
        <div className="mt-4">
          <TextField label="Desired job title" value={p.jobTitle} onChange={upd('jobTitle')} placeholder="e.g. Frontend React Js Developer" />
        </div>
        <div className="mt-4">
          <PhoneField
            label="Phone"
            value={p.phone}
            onChange={upd('phone')}
            code={p.phoneCode || '+92'}
            onCodeChange={(v) => updatePersonal('phoneCode', v)}
            codes={CODES}
            placeholder="300-1234567"
          />
        </div>
        <div className="mt-4">
          <TextField label="Email" value={p.email} onChange={upd('email')} type="email" placeholder="you@email.com" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <TextField label="City" value={p.city} onChange={upd('city')} placeholder="City" />
          <TextField label="Country" value={p.country} onChange={upd('country')} placeholder="Country" />
        </div>

        <details className="mt-5 group">
          <summary className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-700">Additional information ▾</summary>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <TextField label="Address" value={p.address} onChange={upd('address')} placeholder="Street address" />
            <TextField label="State / Province" value={p.state} onChange={upd('state')} />
            <TextField label="ZIP / Postal code" value={p.zip} onChange={upd('zip')} />
            <TextField label="LinkedIn" value={p.linkedin} onChange={upd('linkedin')} placeholder="linkedin.com/in/you" />
            <TextField label="Website / Portfolio" value={p.website} onChange={upd('website')} placeholder="yourwebsite.com" />
          </div>
        </details>
      </div>
    </MuiProvider>
  );
}
