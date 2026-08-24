'use client';

export function Field({ label, value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
      />
    </div>
  );
}

export function TextArea({ label, value, onChange, placeholder, rows = 3, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="input resize-y"
      />
    </div>
  );
}

export function SectionHeader({ title, onAdd, addLabel }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {onAdd && (
        <button onClick={onAdd} className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-100">
          + {addLabel || 'Add'}
        </button>
      )}
    </div>
  );
}

export function RemoveButton({ onClick, label = 'Remove' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md px-2 py-1 text-[11px] font-medium text-red-600 transition hover:bg-red-50"
    >
      {label}
    </button>
  );
}

export function EntryCard({ children }) {
  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      {children}
    </div>
  );
}
