'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function AIButton({ endpoint, payload, label = 'Improve with AI', onResult, small = false, disabled }) {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if ((user?.aiCredits ?? 0) <= 0) {
      alert('You have no AI credits left. Each suggestion uses one credit.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch(`/api/ai/${endpoint}`, {
        method: 'POST',
        body: typeof payload === 'function' ? payload() : payload,
      });
      updateUser({ ...user, aiCredits: (user?.aiCredits ?? 1) - 1 });
      onResult(data.result);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={loading || disabled}
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
