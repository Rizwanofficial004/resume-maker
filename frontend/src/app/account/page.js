'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, LogOut, Shield } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast';

export default function AccountPage() {
  const { user, updateUser, logout, loading: authLoading } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await apiFetch('/api/auth/me', {
        method: 'PUT',
        body: { firstName, lastName },
      });
      updateUser(updated);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await apiFetch('/api/auth/password', {
        method: 'PUT',
        body: { currentPassword, newPassword },
      });
      setCurrentPassword('');
      setNewPassword('');
      toast.success('Password updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (authLoading || !user) {
    return (
      <AppShell>
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-slate-400" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Account</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your profile, password, and plan.</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
              {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
            </span>
            <div>
              <p className="font-semibold text-slate-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
              <Shield size={12} /> {user.plan || 'free'} plan
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              <Sparkles size={12} /> {user.aiCredits ?? 0} AI credits
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Paid plans and credit top-ups are coming soon. Your free credits refresh with your account defaults for now.
          </p>
        </div>

        <form onSubmit={saveProfile} className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900">Profile</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">First name</span>
              <input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Last name</span>
              <input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-medium text-slate-700">Email</span>
              <input className="input bg-slate-50" value={user.email || ''} disabled />
            </label>
          </div>
          <button type="submit" disabled={savingProfile} className="btn-primary mt-4">
            {savingProfile ? <Loader2 size={16} className="animate-spin" /> : null}
            Save profile
          </button>
        </form>

        <form onSubmit={savePassword} className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900">Change password</h2>
          <div className="mt-4 grid gap-4">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Current password</span>
              <input
                type="password"
                className="input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                minLength={6}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">New password</span>
              <input
                type="password"
                className="input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </label>
          </div>
          <button type="submit" disabled={savingPassword} className="btn-primary mt-4">
            {savingPassword ? <Loader2 size={16} className="animate-spin" /> : null}
            Update password
          </button>
        </form>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </AppShell>
  );
}
