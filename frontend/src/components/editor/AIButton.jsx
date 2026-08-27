'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast';

export default function AIButton({ endpoint, payload, label = 'Improve with AI', onResult, small = false, disabled }) {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if ((user?.aiCredits ?? 0) <= 0) {
      toast.error('You have no AI credits left.');
      return;
    }
    setLoading(true);
    try {
      const body = typeof payload === 'function' ? payload() : payload;
      const data = await apiFetch(`/api/ai/${endpoint}`, {
        method: 'POST',
        body,
      });
      if (typeof data.aiCredits === 'number') {
        updateUser({ ...user, aiCredits: data.aiCredits });
      }
      if (typeof onResult === 'function') {
        onResult(data.result);
      }
    } catch (err) {
      const status = err.status;
      if (status === 402) {
        toast.error('No AI credits left. Upgrade your plan to continue.');
      } else if (status === 503) {
        toast.error(err.message || 'AI is not configured. Check the API key.');
      } else if (status === 502) {
        toast.error(err.message || 'AI provider failed. Please try again.');
      } else {
        toast.error(err.message || 'AI request failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={loading || disabled || (user?.aiCredits ?? 0) <= 0}
      className={`inline-flex items-center gap-1.5 rounded-lg font-semibold transition ${
        small
          ? 'px-2 py-1 text-[11px] text-brand-600 hover:bg-brand-50'
          : 'px-3 py-1.5 text-xs text-brand-600 hover:bg-brand-50'
      } disabled:cursor-not-allowed disabled:opacity-50`}
      title="Uses 1 AI credit"
    >
      {loading ? <Loader2 size={small ? 12 : 14} className="animate-spin" /> : <Sparkles size={small ? 12 : 14} />}
      {loading ? 'Working…' : label}
    </button>
  );
}
