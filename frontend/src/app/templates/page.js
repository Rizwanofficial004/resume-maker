'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Check, ArrowRight, LayoutGrid, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import AppShell from '@/components/AppShell';
import ResumePreviewMock from '@/components/ResumePreviewMock';
import { apiFetch } from '@/lib/api';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'modern', label: 'Modern', icon: Sparkles },
  { id: 'classic', label: 'Classic', icon: ShieldCheck },
  { id: 'minimal', label: 'Minimal', icon: Zap },
  { id: 'creative', label: 'Creative', icon: Sparkles },
  { id: 'executive', label: 'Executive', icon: ShieldCheck },
];

const DEFAULT_ACCENTS = {
  modern: '#1d4ed8',
  classic: '#1f2937',
  minimal: '#2563eb',
  professional: '#1e3a8a',
  creative: '#8b5cf6',
  executive: '#0f766e',
};

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    apiFetch('/api/templates', { auth: false })
      .then((data) => {
        setTemplates(data);
        setSelected(data[0]?.id || null);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (filter === 'all' ? templates : templates.filter((t) => t.category === filter || t.id === filter)),
    [templates, filter]
  );

  const createWithTemplate = async () => {
    setCreating(true);
    try {
      const created = await apiFetch('/api/resumes', {
        method: 'POST',
        body: {
          title: `${templates.find((t) => t.id === selected)?.name || 'New'} Resume`,
          templateId: selected,
          accentColor: DEFAULT_ACCENTS[selected] || '#1d4ed8',
        },
      });
      router.push(`/editor/${created._id}`);
    } catch (err) {
      alert(err.message);
      setCreating(false);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Choose a template</h1>
        <p className="text-sm text-slate-500">
          Pick a starting point — you can customize colors, fonts, and content in the editor.
        </p>
      </div>

      {/* Category filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map(({ id, label, icon: Icon }) => {
          const active = filter === id;
          return (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 size={26} className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => {
              const active = selected === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className={`relative rounded-2xl border bg-white p-4 text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-lift ${
                    active ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-slate-200'
                  }`}
                >
                  {active && (
                    <span className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white shadow">
                      <Check size={15} strokeWidth={3} />
                    </span>
                  )}
                  <div className="overflow-hidden rounded-xl border border-slate-100">
                    <ResumePreviewMock templateId={t.id} accent={DEFAULT_ACCENTS[t.id]} scale={0.3} />
                  </div>
                  <div className="px-1 pt-3">
                    <h3 className="font-semibold text-slate-900">{t.name}</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{t.description}</p>
                    <span className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 capitalize">
                      {t.category || 'modern'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="mt-8 text-center text-sm text-slate-400">No templates in this category yet.</div>
          )}

          <div className="mt-10 flex justify-end">
            <button onClick={createWithTemplate} disabled={!selected || creating} className="btn-primary px-7 py-3 text-base">
              {creating ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  Use This Template <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </>
      )}
    </AppShell>
  );
}
