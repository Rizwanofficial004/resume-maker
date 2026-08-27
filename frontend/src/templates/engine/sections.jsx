'use client';

import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { joinPersonal, ContactItem, SkillDots } from '../shared';

const ic = (accent) => ({ width: 11, height: 11, color: accent });

export function ContactRow({ personal: p, accent, light, mode = 'row' }) {
  const color = light ? 'rgba(255,255,255,0.95)' : '#334155';
  const items = [];
  if (p.email) items.push({ key: 'email', icon: <Mail style={ic(accent)} />, text: p.email });
  if (p.phone) items.push({ key: 'phone', icon: <Phone style={ic(accent)} />, text: p.phone });
  const loc = joinPersonal(p);
  if (loc) items.push({ key: 'loc', icon: <MapPin style={ic(accent)} />, text: loc });
  if (p.website) items.push({ key: 'web', icon: <Globe style={ic(accent)} />, text: p.website });
  if (p.linkedin) items.push({ key: 'lin', icon: <Linkedin style={ic(accent)} />, text: p.linkedin });

  if (mode === 'pipes') {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', fontSize: 10, color }}>
        {items.map((it, i) => (
          <span key={it.key} style={{ display: 'inline-flex', alignItems: 'center' }}>
            {i > 0 && <span style={{ width: 1, height: 12, background: accent, margin: '0 8px' }} />}
            {it.text}
          </span>
        ))}
      </div>
    );
  }

  const wrap = mode === 'column'
    ? { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 10, color }
    : { display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 10, color };

  return (
    <div style={wrap}>
      {items.map((it) => (
        <ContactItem key={it.key} icon={it.icon}>{it.text}</ContactItem>
      ))}
    </div>
  );
}

export function Photo({ src, size = 68, radius = 8, border }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      style={{
        width: size,
        height: size,
        objectFit: 'cover',
        borderRadius: radius,
        border: border || 'none',
        display: 'block',
        flexShrink: 0,
      }}
    />
  );
}

export function SectionHeading({ title, accent, style = 'left-underline', light }) {
  const base = {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 6,
    letterSpacing: '0.04em',
    color: light ? '#fff' : accent,
  };
  if (style === 'center-underline') {
    return (
      <h3 style={{
        ...base,
        textAlign: 'center',
        fontSize: 12,
        borderBottom: `1px solid ${light ? 'rgba(255,255,255,0.45)' : accent}`,
        paddingBottom: 4,
      }}>{title}</h3>
    );
  }
  if (style === 'uppercase') {
    return (
      <h3 style={{
        ...base,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        borderBottom: `1px solid ${light ? 'rgba(255,255,255,0.35)' : accent}`,
        paddingBottom: 3,
      }}>{title}</h3>
    );
  }
  if (style === 'scizor') {
    return (
      <h3 style={{
        ...base,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: light ? '#fff' : '#111827',
        borderTop: '1px solid #D8DCE2',
        paddingTop: 8,
        marginTop: 4,
      }}>{title}</h3>
    );
  }
  if (style === 'plain') {
    return <h3 style={{ ...base, color: light ? '#fff' : '#111827' }}>{title}</h3>;
  }
  return (
    <h3 style={{
      ...base,
      borderBottom: `1px solid ${light ? 'rgba(255,255,255,0.35)' : accent}`,
      paddingBottom: 3,
    }}>{title}</h3>
  );
}

function Bullets({ items }) {
  if (!items?.length) return null;
  return (
    <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
      {items.filter((b) => b.text?.trim()).map((b, i) => (
        <li key={i} style={{ fontSize: 10.5, marginBottom: 2, lineHeight: 1.5 }}>{b.text}</li>
      ))}
    </ul>
  );
}

export function renderSectionContent(id, resume, accent, opts = {}) {
  const { light, skillsDisplay = 'dots', experienceHeader = 'stacked' } = opts;
  const p = resume.personal || {};

  if (id === 'summary') {
    if (!p.summary?.trim()) return null;
    return (
      <p style={{
        fontSize: 10.5,
        lineHeight: 1.55,
        color: light ? 'rgba(255,255,255,0.92)' : '#374151',
        whiteSpace: 'pre-wrap',
      }}>{p.summary}</p>
    );
  }

  if (id === 'experience') {
    const list = resume.experience || [];
    if (!list.length) return null;
    return list.map((e) => (
      <div key={e.id} style={{ marginBottom: 10 }}>
        {experienceHeader === 'inline' ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: 11, marginBottom: 2 }}>
            <span style={{ fontWeight: 700 }}>{e.jobTitle}</span>
            {e.company && <span style={{ color: light ? 'rgba(255,255,255,0.75)' : '#64748b' }}>· {e.company}</span>}
            <span style={{ marginLeft: 'auto', fontSize: 9.5, color: light ? 'rgba(255,255,255,0.7)' : '#6b7280' }}>
              {e.startDate} – {e.current ? 'Present' : e.endDate}
            </span>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 11 }}>{e.jobTitle}</span>
                {e.company && <span style={{ fontWeight: 600, color: light ? '#fff' : accent, fontSize: 11 }}> — {e.company}</span>}
              </div>
              <span style={{ fontSize: 9.5, color: light ? 'rgba(255,255,255,0.7)' : '#6b7280' }}>
                {e.startDate} – {e.current ? 'Present' : e.endDate}
              </span>
            </div>
            {e.location && <div style={{ fontSize: 9.5, color: light ? 'rgba(255,255,255,0.7)' : '#6b7280' }}>{e.location}</div>}
          </>
        )}
        <Bullets items={e.description} />
      </div>
    ));
  }

  if (id === 'education') {
    const list = resume.education || [];
    if (!list.length) return null;
    return list.map((e) => (
      <div key={e.id} style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: 11 }}>{e.school}</span>
            {e.degree && <span style={{ fontSize: 10.5 }}> — {e.degree}</span>}
            {e.fieldOfStudy && <span style={{ fontSize: 10.5 }}>, {e.fieldOfStudy}</span>}
          </div>
          <span style={{ fontSize: 9.5, color: light ? 'rgba(255,255,255,0.7)' : '#6b7280' }}>
            {e.startDate} – {e.current ? 'Present' : e.endDate}
          </span>
        </div>
        {e.description && <p style={{ fontSize: 10, color: light ? 'rgba(255,255,255,0.75)' : '#6b7280', marginTop: 2 }}>{e.description}</p>}
      </div>
    ));
  }

  if (id === 'skills') {
    const list = resume.skills || [];
    if (!list.length) return null;
    if (skillsDisplay === 'bars') {
      return list.map((s) => (
        <div key={s.id} style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 10.5, marginBottom: 2, color: light ? '#fff' : undefined }}>{s.name}</div>
          <div style={{ height: 4, background: light ? 'rgba(255,255,255,0.25)' : '#e2e8f0', borderRadius: 2 }}>
            <div style={{
              width: `${Math.min(100, Math.max(0, (s.level || 0) * 20))}%`,
              height: '100%',
              background: light ? '#fff' : accent,
              borderRadius: 2,
            }} />
          </div>
        </div>
      ));
    }
    return list.map((s) => (
      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 10.5, color: light ? '#fff' : undefined }}>{s.name}</span>
        <SkillDots level={s.level} color={light ? '#fff' : accent} />
      </div>
    ));
  }

  if (id === 'projects') {
    const list = resume.projects || [];
    if (!list.length) return null;
    return list.map((pr) => (
      <div key={pr.id} style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 11 }}>
          {pr.name}
          {pr.link && <span style={{ fontWeight: 400, color: accent, fontSize: 10 }}> — {pr.link}</span>}
        </div>
        <Bullets items={pr.description} />
      </div>
    ));
  }

  if (id === 'certifications') {
    const list = resume.certifications || [];
    if (!list.length) return null;
    return list.map((c) => (
      <div key={c.id} style={{ marginBottom: 5, fontSize: 10.5, color: light ? 'rgba(255,255,255,0.95)' : undefined }}>
        <span style={{ fontWeight: 600 }}>{c.name}</span>
        {(c.issuer || c.date) && (
          <span style={{ color: light ? 'rgba(255,255,255,0.75)' : '#6b7280' }}> — {[c.issuer, c.date].filter(Boolean).join(', ')}</span>
        )}
      </div>
    ));
  }

  if (id === 'languages') {
    const list = resume.languages || [];
    if (!list.length) return null;
    return list.map((l) => (
      <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 10.5, color: light ? 'rgba(255,255,255,0.95)' : undefined }}>
        <span>{l.name}</span>
        <span style={{ color: light ? 'rgba(255,255,255,0.75)' : '#6b7280' }}>{l.proficiency}</span>
      </div>
    ));
  }

  if (id === 'awards') {
    const list = resume.awards || [];
    if (!list.length) return null;
    return list.map((a) => (
      <div key={a.id} style={{ marginBottom: 5, fontSize: 10.5 }}>
        <span style={{ fontWeight: 600 }}>{a.name}</span>
        {(a.issuer || a.date) && <span style={{ color: '#6b7280' }}> — {[a.issuer, a.date].filter(Boolean).join(', ')}</span>}
      </div>
    ));
  }

  if (id === 'hobbies') {
    if (!resume.hobbies?.trim()) return null;
    return <p style={{ fontSize: 10.5, color: light ? 'rgba(255,255,255,0.95)' : undefined }}>{resume.hobbies}</p>;
  }

  if (id === 'references') {
    if (!resume.references?.trim()) return null;
    return <p style={{ fontSize: 10.5, whiteSpace: 'pre-wrap' }}>{resume.references}</p>;
  }

  return null;
}

const TITLES = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  awards: 'Awards',
  hobbies: 'Interests',
  references: 'References',
};

export function SectionBlock({ id, resume, accent, headingStyle, light, skillsDisplay, experienceHeader, timeline }) {
  const content = renderSectionContent(id, resume, accent, { light, skillsDisplay, experienceHeader });
  if (!content) return null;
  return (
    <div style={{ marginBottom: 'var(--section-gap, 12px)', position: 'relative' }}>
      {timeline && (
        <span style={{
          position: 'absolute',
          left: -17,
          top: 4,
          width: 8,
          height: 8,
          borderRadius: '50%',
          border: `2px solid ${accent}`,
          background: '#fff',
        }} />
      )}
      <SectionHeading title={TITLES[id] || id} accent={accent} style={headingStyle} light={light} />
      {content}
    </div>
  );
}

export function SectionsList({ ids, resume, accent, headingStyle, light, skillsDisplay, experienceHeader, timeline }) {
  return (ids || []).map((id) => (
    <SectionBlock
      key={id}
      id={id}
      resume={resume}
      accent={accent}
      headingStyle={headingStyle}
      light={light}
      skillsDisplay={skillsDisplay}
      experienceHeader={experienceHeader}
      timeline={timeline}
    />
  ));
}
