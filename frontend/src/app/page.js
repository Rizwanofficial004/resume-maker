import Link from 'next/link';
import {
  Sparkles,
  FileText,
  ShieldCheck,
  LayoutTemplate,
  Zap,
  Download,
  PenLine,
  Star,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Search,
  Award,
  Layers,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import ResumePreviewMock from '@/components/ResumePreviewMock';

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(51,105,252,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.25),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
        <div className="container-app relative grid items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-brand-200">
              <Sparkles size={14} /> ATS-Friendly · AI-Powered
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Create a resume that{' '}
              <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">
                gets you hired
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              Build a professional, ATS-friendly resume in minutes. Choose from modern templates,
              let AI polish your wording, and export to PDF or Word — free to start.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="btn-primary px-7 py-3 text-base">
                Create My Resume <ArrowRight size={18} />
              </Link>
              <Link href="/templates" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3 text-base font-semibold text-white transition hover:bg-white/10">
                Browse Templates
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <span className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
                </span>
                4.9 / 5 from 12,000+ users
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-400" /> Free to start
              </span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -left-6 top-10 z-0 rotate-[-4deg] rounded-2xl border border-white/10 bg-white/5 p-2 opacity-70">
              <ResumePreviewMock templateId="chikorita" accent="#10b981" scale={0.42} className="h-auto" />
            </div>
            <div className="absolute -right-4 bottom-4 z-0 rotate-[5deg] rounded-2xl border border-white/10 bg-white/5 p-2 opacity-70">
              <ResumePreviewMock templateId="rhyhorn" accent="#0ea5e9" scale={0.38} className="h-auto" />
            </div>
            <div className="relative z-10 animate-float rounded-3xl border border-white/15 bg-white p-3 shadow-2xl shadow-brand-900/40">
              <ResumePreviewMock templateId="azurill" accent="#3369fc" scale={0.62} />
            </div>
            <div className="absolute -bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-6 py-3 shadow-lift">
              <p className="text-sm font-semibold text-slate-900">Ready in under 5 minutes ⚡</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container-app relative border-t border-white/10 py-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '5 min', label: 'Average resume build time' },
              { value: '48%', label: 'More likely to get interviews' },
              { value: '15', label: 'Professional templates' },
              { value: '100%', label: 'ATS-friendly formatting' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATES */}
      <section id="templates" className="scroll-mt-20 bg-slate-50 py-20">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">Templates</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              A template for every career stage
            </h2>
            <p className="mt-4 text-slate-600">
              Fifteen Reactive Resume–inspired layouts — fully customizable colors, fonts, and sections.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { templateId: 'onyx', accent: '#1d4ed8', name: 'Onyx', desc: 'Versatile single column — our default for any role.' },
              { templateId: 'azurill', accent: '#1d4ed8', name: 'Azurill', desc: 'Bold colored sidebar with skill bars for tech and creative.' },
              { templateId: 'gengar', accent: '#7c3aed', name: 'Gengar', desc: 'Accent sidebar and clean type for analysts and ops.' },
              { templateId: 'bronzor', accent: '#334155', name: 'Bronzor', desc: 'Clean two-column layout for corporate and finance.' },
              { templateId: 'kakuna', accent: '#db2777', name: 'Kakuna', desc: 'Compact single column with a left accent bar.' },
              { templateId: 'scizor', accent: '#dc2626', name: 'Scizor', desc: 'Uppercase headings — polished for executive roles.' },
            ].map((t) => (
              <Link
                key={t.templateId}
                href="/register"
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="aspect-[210/297] overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/templates/jpg/${t.templateId}.jpg`}
                    alt={`${t.name} template`}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="flex items-center justify-between px-1 py-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{t.name}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">{t.desc}</p>
                  </div>
                  <ArrowRight size={18} className="shrink-0 text-slate-300 transition group-hover:text-brand-600" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/templates" className="btn-secondary">
              <LayoutTemplate size={17} /> View All Templates
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="scroll-mt-20 bg-white py-20">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">Features</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to land the job
            </h2>
            <p className="mt-4 text-slate-600">
              Powerful tools that turn your experience into a resume recruiters can&apos;t ignore.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Sparkles, title: 'AI Writing Assistant', desc: 'Improve bullet points, generate summaries, and get keywords for the role — powered by OpenRouter AI.' },
              { icon: ShieldCheck, title: 'ATS-Friendly by Design', desc: 'Clean, parseable formatting that passes applicant tracking systems with ease.' },
              { icon: LayoutTemplate, title: 'Professional Templates', desc: 'Expertly designed layouts that look great in print and on screen.' },
              { icon: Download, title: 'PDF & Word Export', desc: 'Download your resume as a pixel-perfect PDF or an editable Word document.' },
              { icon: Zap, title: 'Live Editing & Preview', desc: 'See your resume update in real time as you type. No surprises.' },
              { icon: PenLine, title: 'Cover Letter Builder', desc: 'Pair your resume with an AI-generated cover letter in one click.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card group p-6 transition-all hover:-translate-y-1 hover:shadow-lift">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-20 bg-slate-50 py-20">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">How it works</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From blank page to job offer in 3 steps
            </h2>
          </div>

          <div className="relative mt-16 grid gap-10 md:grid-cols-3">
            {[
              { icon: FileText, step: '01', title: 'Pick a template', desc: 'Browse professional templates and choose the one that fits your role and style.' },
              { icon: Sparkles, step: '02', title: 'Let AI help you write', desc: 'Fill in your details or generate bullet points, summaries, and keywords with AI.' },
              { icon: Briefcase, step: '03', title: 'Export & apply', desc: 'Download a perfect PDF or Word file and start applying with confidence.' },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="relative text-center md:text-left">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-card md:mx-0">
                  <Icon size={24} />
                </div>
                <span className="absolute right-0 top-0 text-5xl font-bold text-slate-200 md:left-auto">{step}</span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="scroll-mt-20 bg-white py-20">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">Testimonials</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Loved by job seekers everywhere
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Anna Peterson', role: 'Senior Frontend Developer', quote: 'Finally getting responses! I applied to 20+ jobs with no luck, then made an ATS-friendly resume here and started hearing back.' },
              { name: 'Mark Heighter', role: 'Data Analyst', quote: 'The AI saved me tons of time. My resume sounds professional now, and it was so easy to make.' },
              { name: 'Byron Moreno', role: 'Career Changer', quote: 'I had no idea my resume needed to be optimized for hiring software. This tool fixed it, and I landed a job.' },
              { name: 'Sophia Miller', role: 'Product Marketer', quote: 'AI suggestions with relevant keywords made my bullet points much more persuasive. Three interviews this week!' },
              { name: 'Jason Miller', role: 'Backend Engineer', quote: 'Created my resume in 10 minutes and got two callbacks the same week. Super easy to use.' },
              { name: 'Laura Nguyen', role: 'Recent Graduate', quote: 'I didn\'t know anything about ATS rules before this. Now my resume is created the right way, every time.' },
            ].map((t) => (
              <figure key={t.name} className="card flex flex-col p-6">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">“{t.quote}”</blockquote>
                <figcaption className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* AI + JOBS BANNER */}
      <section className="bg-slate-950 py-20">
        <div className="container-app grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-brand-200">
              <Award size={14} /> Beyond the resume
            </span>
            <h2 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl">
              From resume to job offer — all in one place
            </h2>
            <p className="mt-4 max-w-lg text-slate-300">
              Write cover letters with AI, search and save jobs that match your skills, and track
              every application. ResumeMaster supports your whole job search, not just the resume.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/cover-letters" className="btn-primary">
                <PenLine size={16} /> Write a Cover Letter
              </Link>
              <Link href="/jobs" className="btn border border-white/20 bg-white/5 text-white hover:bg-white/10">
                <Search size={16} /> Find Jobs
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Layers, title: 'Resume Builder', desc: 'Professional templates with AI writing help.' },
              { icon: PenLine, title: 'Cover Letters', desc: 'Generate a tailored letter in seconds.' },
              { icon: Briefcase, title: 'Job Search', desc: 'Browse roles and filter by your skills.' },
              { icon: ShieldCheck, title: 'Privacy First', desc: 'Your data stays secure and private.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <Icon size={20} className="text-brand-300" />
                <h3 className="mt-3 text-sm font-semibold text-white">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-white py-20">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">FAQ</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="mt-12">
            <FAQ />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-brand-600 to-violet-700 py-20">
        <div className="container-app text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
            Get noticed, get hired faster
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">
            Join thousands of job seekers who landed interviews with a ResumeMaster resume. It only
            takes five minutes.
          </p>
          <div className="mt-8">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-brand-700 shadow-lg transition hover:bg-brand-50"
            >
              Build My Resume Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
