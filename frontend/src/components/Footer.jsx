import Link from 'next/link';
import Logo from './Logo';

const FOOTER_LINKS = {
  Product: [
    { label: 'Resume Templates', href: '/templates' },
    { label: 'Resume Builder', href: '/dashboard' },
    { label: 'Cover Letter Builder', href: '/cover-letters' },
    { label: 'AI Writing Assistant', href: '/#features' },
    { label: 'Find Jobs', href: '/jobs' },
  ],
  Resources: [
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'ATS-Friendly Guide', href: '/#faq' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'FAQ', href: '/#faq' },
  ],
  Company: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Contact Us', href: '/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-app grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
            Build a professional, ATS-friendly resume in minutes. Templates, AI writing help, and
            instant PDF &amp; Word export — all in one place.
          </p>
        </div>
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="text-sm font-semibold text-slate-900">{heading}</h4>
            <ul className="mt-4 space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-500 transition hover:text-brand-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100">
        <div className="container-app flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} ResumeMaster. All rights reserved.</p>
          <p>Built for job seekers everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
