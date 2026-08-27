'use client';

import { useState } from 'react';
import { Loader2, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/components/Toast';

export default function ContactPage() {
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await apiFetch('/api/contact', {
        method: 'POST',
        auth: false,
        body: { name, email, message },
      });
      toast.success(res.message || 'Message sent');
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container-app py-12 lg:py-16">
        <div className="mx-auto max-w-xl">
          <div className="mb-8 text-center">
            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Mail size={22} />
            </span>
            <h1 className="text-3xl font-bold text-slate-900">Contact us</h1>
            <p className="mt-2 text-sm text-slate-500">
              Questions, feedback, or support — we typically reply within 24 hours.
            </p>
          </div>

          {sent ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
              <p className="font-semibold text-emerald-900">Thanks — your message was received.</p>
              <button type="button" onClick={() => setSent(false)} className="mt-4 text-sm font-medium text-emerald-700 underline">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">Name</span>
                <input className="input" required value={name} onChange={(e) => setName(e.target.value)} maxLength={200} />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">Email</span>
                <input type="email" className="input" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">Message</span>
                <textarea
                  className="input min-h-[140px]"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={5000}
                />
              </label>
              <button type="submit" disabled={sending} className="btn-primary w-full justify-center">
                {sending ? <Loader2 size={16} className="animate-spin" /> : null}
                Send message
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
