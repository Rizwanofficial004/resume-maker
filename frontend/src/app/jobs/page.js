'use client';

import { useEffect, useState, useCallback } from 'react';
import { Briefcase, MapPin, Search, Loader2, Bookmark, BookmarkCheck, ExternalLink, Filter } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { apiFetch } from '@/lib/api';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('Anywhere');
  const [type, setType] = useState('All');
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('saved_jobs');
    if (stored) setSaved(JSON.parse(stored));
  }, []);

  const fetchJobs = useCallback(async (query = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.q) params.set('q', query.q);
      if (query.location && query.location !== 'Anywhere') params.set('location', query.location);
      if (query.type && query.type !== 'All') params.set('type', query.type);
      const data = await apiFetch(`/api/jobs${params.toString() ? `?${params}` : ''}`, { auth: false });
      setJobs(data.jobs || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const toggleSave = (id) => {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('saved_jobs', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AppShell>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Find your dream job</h1>
        <p className="mt-1 text-sm text-slate-500">
          Browse roles, save the ones you like, and apply with your ResumeMaster resume.
        </p>
      </div>

      <div className="card mt-6 flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchJobs({ q, location, type })}
            placeholder="Job title, skill, or company…"
            className="input pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="shrink-0 text-slate-400" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchJobs({ q, location, type })}
            placeholder="Location"
            className="input lg:w-40"
          />
          <select value={type} onChange={(e) => { setType(e.target.value); fetchJobs({ q, location, type: e.target.value }); }} className="input lg:w-36">
            <option>All</option>
            <option>Full-time</option>
            <option>Contract</option>
          </select>
          <button onClick={() => fetchJobs({ q, location, type })} className="btn-primary">
            <Filter size={15} /> Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 size={26} className="animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
          <Briefcase size={36} className="text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No jobs found</h3>
          <p className="mt-1 text-sm text-slate-500">Try different keywords or clear your filters.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {jobs.map((job) => {
            const isSaved = saved.includes(job.id);
            return (
              <div key={job.id} className="card flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white"
                    style={{ background: job.logoColor }}
                  >
                    {job.company[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-900">{job.title}</h3>
                      <button
                        onClick={() => toggleSave(job.id)}
                        className={`shrink-0 rounded-lg p-1.5 transition ${isSaved ? 'text-brand-600' : 'text-slate-300 hover:text-brand-500'}`}
                        title={isSaved ? 'Saved' : 'Save job'}
                      >
                        {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                      </button>
                    </div>
                    <p className="text-sm text-slate-600">{job.company}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium">{job.type}</span>
                      <span>{job.salary}</span>
                      <span>· {job.posted}</span>
                    </div>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">{job.description}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-400">{saved.length} saved</span>
                  <button className="btn-secondary !py-2 text-xs">
                    Apply Now <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
