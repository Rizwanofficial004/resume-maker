'use client';

import { useState, useCallback } from 'react';
import { Plus, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { newSkill } from '@/lib/resume-data';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast';
import TipsDropdown from './TipsDropdown';
import { MuiProvider, TextField } from './MuiFields';
import { Switch, Box, Chip } from '@mui/material';

const SKILL_SUGGESTIONS = {
  frontend: ['React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Next.js', 'SASS', 'Webpack', 'Vite', 'Redux', 'Zustand', 'Figma', 'Responsive Design', 'Web Accessibility', 'SEO'],
  backend: ['Node.js', 'Express.js', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'Go', 'Rust', 'REST APIs', 'GraphQL', 'gRPC', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Microservices'],
  fullstack: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'REST APIs', 'Git', 'CI/CD', 'Next.js', 'Express.js', 'Tailwind CSS', 'Redis', 'GraphQL', 'Kubernetes', 'Linux', 'Nginx'],
  design: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign', 'Wireframing', 'Prototyping', 'User Research', 'Usability Testing', 'Design Systems', 'Typography', 'Color Theory', 'UI/UX Design', 'Motion Design'],
  data: ['Python', 'SQL', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Data Analysis', 'Statistics', 'Tableau', 'Power BI', 'Apache Spark', 'ETL', 'Data Modeling', 'R', 'Jupyter'],
  marketing: ['SEO', 'Google Analytics', 'Content Strategy', 'Social Media Marketing', 'PPC', 'Google Ads', 'Facebook Ads', 'Email Marketing', 'Copywriting', 'A/B Testing', 'Marketing Automation', 'HubSpot', 'Salesforce', 'Brand Strategy'],
};

function matchJobTitle(jobTitle) {
  if (!jobTitle) return 'fullstack';
  const t = jobTitle.toLowerCase();
  if (t.includes('design') || t.includes('ui') || t.includes('ux')) return 'design';
  if (t.includes('data') || t.includes('ml') || t.includes('ai') || t.includes('analyst')) return 'data';
  if (t.includes('market') || t.includes('seo') || t.includes('growth')) return 'marketing';
  if (t.includes('front') || t.includes('react') || t.includes('vue') || t.includes('angular')) return 'frontend';
  if (t.includes('back') || t.includes('api') || t.includes('server') || t.includes('node')) return 'backend';
  return 'fullstack';
}

export default function SkillsStep({ items: rawItems, setItems, jobTitle }) {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const items = Array.isArray(rawItems) ? rawItems : [];
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [showLevels, setShowLevels] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [usedAi, setUsedAi] = useState(false);

  const category = matchJobTitle(jobTitle);
  const maxRegenerations = 5;

  const loadLocalSuggestions = useCallback(() => {
    const base = SKILL_SUGGESTIONS[category] || SKILL_SUGGESTIONS.fullstack;
    const existing = items.map((s) => s.name.toLowerCase());
    const filtered = base.filter((s) => !existing.includes(s.toLowerCase()));
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 8);
    setSuggestions(shuffled);
    setUsedAi(false);
  }, [category, items]);

  const fetchAiSuggestions = useCallback(async () => {
    if ((user?.aiCredits ?? 0) <= 0) {
      toast.error('You have no AI credits left.');
      return;
    }
    setLoadingSuggestions(true);
    try {
      const data = await apiFetch('/api/ai/keywords', {
        method: 'POST',
        body: { jobTitle: jobTitle || 'Software Developer', existingSkills: items.map((s) => s.name) },
      });
      if (Array.isArray(data.result)) setSuggestions(data.result);
      if (typeof data.aiCredits === 'number') {
        updateUser({ ...user, aiCredits: data.aiCredits });
      }
      setRegenerateCount((c) => c + 1);
      setUsedAi(true);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch AI skills');
    } finally {
      setLoadingSuggestions(false);
    }
  }, [items, jobTitle, user, updateUser, toast]);

  const addSkill = (name) => {
    if (!name.trim()) return;
    if (items.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    setItems([...items, { ...newSkill(), name: name.trim() }]);
    setInputValue('');
  };

  return (
    <MuiProvider>
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[22px] font-bold text-slate-900">Skills</h2>
            <p className="mt-1 text-sm text-slate-500">Add skills that match the job you&apos;re applying for.</p>
          </div>
          <TipsDropdown section="skills" />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Switch checked={showLevels} onChange={(e) => setShowLevels(e.target.checked)} size="small" color="primary" />
          <span className="text-sm text-slate-600">Show experience level</span>
        </div>

        {items.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {items.map((skill) => (
              <Chip
                key={skill.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <span className="font-medium">{skill.name}</span>
                    {showLevels && (
                      <Box sx={{ display: 'flex', gap: '2px', ml: 1 }}>
                        {[1, 2, 3, 4, 5].map((l) => (
                          <Box
                            key={l}
                            onClick={() => setItems(items.map((s) => (s.id === skill.id ? { ...s, level: l } : s)))}
                            sx={{
                              width: 12,
                              height: 5,
                              borderRadius: 1,
                              cursor: 'pointer',
                              bgcolor: l <= skill.level ? 'primary.main' : 'grey.300',
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                }
                onDelete={() => setItems(items.filter((s) => s.id !== skill.id))}
                variant="outlined"
                sx={{ borderRadius: 2, height: 36 }}
              />
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
          <TextField
            value={inputValue}
            onChange={setInputValue}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (inputValue.trim()) addSkill(inputValue);
              }
            }}
            placeholder="Type a skill and press Enter…"
          />
          <button
            type="button"
            onClick={() => inputValue.trim() && addSkill(inputValue)}
            disabled={!inputValue.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
          >
            <Plus size={15} />
          </button>
        </Box>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">
              <Sparkles size={14} className="mr-1 inline text-amber-500" />
              Suggested skills
            </h3>
            {suggestions.length > 0 && regenerateCount < maxRegenerations && (
              <button
                type="button"
                onClick={fetchAiSuggestions}
                disabled={loadingSuggestions}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                {loadingSuggestions ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                AI regenerate ({regenerateCount}/{maxRegenerations})
              </button>
            )}
          </div>
          {suggestions.length === 0 && !loadingSuggestions ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={loadLocalSuggestions}
                className="rounded-xl border-2 border-dashed border-slate-200 py-5 text-sm font-medium text-slate-500 hover:border-blue-300 hover:text-blue-600 transition"
              >
                Quick suggestions (free)
              </button>
              <button
                type="button"
                onClick={fetchAiSuggestions}
                disabled={loadingSuggestions}
                className="rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/50 py-5 text-sm font-medium text-amber-800 hover:border-amber-400 transition disabled:opacity-50"
              >
                <Sparkles size={14} className="mr-1 inline" />
                AI suggestions (1 credit)
              </button>
            </div>
          ) : (
            <>
              {usedAi && <p className="mb-2 text-[11px] text-slate-400">AI-generated for this role</p>}
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={`${s}-${i}`}
                    type="button"
                    onClick={() => addSkill(s)}
                    className="flex items-center gap-1 rounded-lg border border-dashed border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:border-blue-400 hover:bg-blue-100"
                  >
                    <Plus size={12} /> {s}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </MuiProvider>
  );
}
