'use client';

export default function ResumeScore({ score }) {
  const getColor = (s) => {
    if (s >= 80) return 'bg-emerald-500';
    if (s >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getFire = (s) => {
    if (s >= 90) return '🔥';
    if (s >= 70) return '✨';
    return '📝';
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${getColor(score)}`}>
        {score}%
      </span>
      <span className="text-sm font-medium text-slate-700">Your resume score {getFire(score)}</span>
    </div>
  );
}
