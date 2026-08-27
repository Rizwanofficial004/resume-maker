'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileText, PenLine, Briefcase, LogOut, Menu, X, Sparkles, FolderOpen, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import Logo from '@/components/Logo';
import { useAuth } from '@/lib/auth-context';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/documents', label: 'Documents', icon: FolderOpen },
  { href: '/templates', label: 'Templates', icon: FileText },
  { href: '/cover-letters', label: 'Cover Letters', icon: PenLine },
  { href: '/jobs', label: 'Find Jobs', icon: Briefcase },
  { href: '/account', label: 'Account', icon: UserIcon },
];

export default function AppShell({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-500">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-slate-100 px-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href === '/dashboard' && pathname === '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
              {user.firstName?.[0] || 'U'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                {user.aiCredits ?? 0} <Sparkles size={11} className="text-amber-500" /> AI credits
              </p>
            </div>
          </div>
          <button onClick={logout} className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            <LogOut size={18} /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Logo />
        <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white p-4 transition-transform lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="mt-16 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                pathname === href ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
          <button onClick={() => { setOpen(false); logout(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
            <LogOut size={18} /> Log out
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 pt-16 lg:pl-64 lg:pt-0">
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
