'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Settings, Crown, MessageCircle } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '@/lib/auth-context';

const AUTH_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/documents', label: 'Documents' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/contact', label: 'Contact us' },
];

export default function Navbar({ transparent = false, hidden = false }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');
  if (isAuthPage || hidden) return null;

  return (
    <header className={`sticky top-0 z-50 ${transparent ? 'bg-transparent' : 'border-b border-slate-200 bg-white'}`}>
      <nav className="container-app flex h-[52px] items-center justify-between">
        <Logo />

        {user && (
          <div className="hidden items-center gap-1 md:flex">
            {AUTH_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${
                  pathname === link.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className="hidden items-center gap-3 md:flex">
          {loading ? null : user ? (
            <>
              <Link href="/account" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-100">
                <Settings size={15} /> My Account
              </Link>
              <Link href="/account" className="rounded-lg bg-slate-900 px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-slate-800">
                <Crown size={14} className="mr-1 inline" /> Account
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[13px] font-medium text-slate-600 hover:text-slate-900">
                Log in
              </Link>
              <Link href="/register" className="rounded-lg bg-blue-600 px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-blue-700">
                Create My Resume
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {user && AUTH_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${pathname === link.href ? 'bg-blue-50 text-blue-600' : 'text-slate-700'}`}>
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
              {user ? (
                <>
                  <Link href="/account" onClick={() => setOpen(false)} className="btn-secondary text-sm">My Account</Link>
                  <button onClick={() => { setOpen(false); logout(); }} className="text-sm text-slate-600 hover:text-slate-900">Log out</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary text-sm">Log in</Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="btn-primary text-sm">Create My Resume</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
