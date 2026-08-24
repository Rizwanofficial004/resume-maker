export function joinPersonal(p) {
  return [p.city, p.state, p.zip, p.country].filter(Boolean).join(', ');
}

export function hasAny(obj, keys) {
  return keys.some((k) => obj && obj[k] && String(obj[k]).trim() !== '');
}

export function ContactItem({ icon, children, style }) {
  if (!children) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, ...style }}>
      <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>
      <span style={{ overflowWrap: 'anywhere' }}>{children}</span>
    </div>
  );
}

export function SkillDots({ level, color }) {
  const dots = Array.from({ length: 5 }, (_, i) => i < (level || 0));
  return (
    <span style={{ display: 'inline-flex', gap: 3 }}>
      {dots.map((filled, i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: filled ? color : 'rgba(148,163,184,0.5)',
          }}
        />
      ))}
    </span>
  );
}
