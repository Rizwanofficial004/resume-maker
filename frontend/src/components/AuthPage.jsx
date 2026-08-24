'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/lib/auth-context';

export default function AuthPage({ mode }) {
  const router = useRouter();
  const { login, register } = useAuth();
  const isLogin = mode === 'login';

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Form side */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Logo />
          <h1 className="mt-10 text-3xl font-bold tracking-tight text-slate-900">
            {isLogin ? 'Welcome back' : 'Create your free account'}
          </h1>
          <p className="mt-2 text-slate-500">
            {isLogin
              ? 'Log in to continue building your resume.'
              : 'Build a job-winning resume in minutes. No credit card required.'}
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="firstName" value={form.firstName} onChange={update} required className="input pl-9" placeholder="Anna" />
                  </div>
                </div>
                <div>
                  <label className="label">Last name</label>
                  <input name="lastName" value={form.lastName} onChange={update} required className="input" placeholder="Peterson" />
                </div>
              </div>
            )}

            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="email" type="email" value={form.email} onChange={update} required className="input pl-9" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={update}
                  required
                  minLength={6}
                  className="input pl-9 pr-10"
                  placeholder={isLogin ? 'Your password' : 'At least 6 characters'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  {isLogin ? 'Log in' : 'Create Account'} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? (
              <>
                New to ResumeMaster?{' '}
                <Link href="/register" className="font-semibold text-brand-600 hover:underline">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-brand-600 hover:underline">
                  Log in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Visual side */}
      <div className="relative hidden overflow-hidden bg-slate-950 lg:block lg:w-1/2">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(51,105,252,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.3),transparent_55%)]" />
        <div className="relative flex h-full flex-col justify-center px-16">
          <h2 className="text-3xl font-bold leading-tight text-white">
            Land interviews with a resume that stands out.
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              'Professional, ATS-friendly templates',
              'AI writing help for every section',
              'Instant PDF & Word export',
              'Free to start — no card required',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-200">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-brand-300">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm italic leading-relaxed text-slate-300">
              “Once I made an ATS-friendly resume with ResumeMaster, I started getting a lot more
              responses from recruiters.”
            </p>
            <p className="mt-3 text-sm font-semibold text-white">Anna Peterson</p>
            <p className="text-xs text-slate-400">Senior Frontend Developer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
