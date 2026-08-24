'use client';

import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { joinPersonal, hasAny, ContactItem } from './shared';

export default function ExecutiveTemplate({ resume, accent }) {
  const p = resume.personal;

  return (
    <div style={{ width: '210mm', minHeight: '297mm', background: '#fff', color: '#1f2937', fontSize: 11, lineHeight: 1.55, fontFamily: 'inherit' }}>
      <div style={{ padding: '18mm 16mm 8mm', textAlign: 'center' }}>
        <h1 style={{ fontSize: 26, fontWeight: 300, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#111827' }}>
          {p.firstName} {p.lastName}
        </h1>
        {p.jobTitle && <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, marginTop: 6 }}>{p.jobTitle}</p>}
        <div style={{ width: 80, height: 2, background: accent, margin: '10px auto 0' }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 10, fontSize: 10, color: '#4b5563' }}>
          {p.email && <ContactItem icon={<Mail style={{ width: 11, height: 11 }} />}>{p.email}</ContactItem>}
          {p.phone && <ContactItem icon={<Phone style={{ width: 11, height: 11 }} />}>{p.phone}</ContactItem>}
          {joinPersonal(p) && <ContactItem icon={<MapPin style={{ width: 11, height: 11 }} />}>{joinPersonal(p)}</ContactItem>}
          {p.website && <ContactItem icon={<Globe style={{ width: 11, height: 11 }} />}>{p.website}</ContactItem>}
          {p.linkedin && <ContactItem icon={<Linkedin style={{ width: 11, height: 11 }} />}>{p.linkedin}</ContactItem>}
        </div>
      </div>

      <div style={{ padding: '6mm 16mm 16mm' }}>
        {p.summary && (
          <Section title="Profile" accent>
            <p style={{ color: '#374151' }}>{p.summary}</p>
          </Section>
        )}

        {resume.experience.length > 0 && (
          <Section title="Professional Experience" accent>
            {resume.experience.map((e) => (
              <div key={e.id} style={{ marginBottom: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 12, color: '#111827' }}>{e.jobTitle}</span>
                  <span style={{ fontSize: 10, color: '#6b7280' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 10.5, color: accent, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {[e.company, e.location].filter(Boolean).join(' · ')}
                </div>
                <Bullets items={e.description} />
              </div>
            ))}
          </Section>
        )}

        {resume.education.length > 0 && (
          <Section title="Education" accent>
            {resume.education.map((e) => (
              <div key={e.id} style={{ marginBottom: 9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{e.school}</span>
                  <span style={{ fontSize: 10, color: '#6b7280' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
                </div>
                <div style={{ color: '#4b5563' }}>{[e.degree, e.fieldOfStudy].filter(Boolean).join(', ')}</div>
              </div>
            ))}
          </Section>
        )}

        {resume.skills.length > 0 && (
          <Section title="Core Strengths" accent>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, columnGap: 20 }}>
              {resume.skills.map((s) => (
                <span key={s.id} style={{ fontSize: 10.5, color: '#374151', paddingLeft: 10, borderLeft: `3px solid ${accent}` }}>
                  {s.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {resume.projects.length > 0 && (
          <Section title="Key Projects" accent>
            {resume.projects.map((pr) => (
              <div key={pr.id} style={{ marginBottom: 9 }}>
                <span style={{ fontWeight: 700, color: '#111827' }}>{pr.name}</span>
                {pr.link && <span style={{ fontSize: 10, color: accent }}> — {pr.link}</span>}
                <Bullets items={pr.description} />
              </div>
            ))}
          </Section>
        )}

        {(resume.certifications.length > 0 || resume.languages.length > 0) && (
          <Section title="Certifications & Languages" accent>
            {resume.certifications.map((c) => (
              <div key={c.id} style={{ marginBottom: 3 }}>
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                {c.issuer && <span style={{ color: '#4b5563' }}> — {c.issuer}</span>}
                {c.date && <span style={{ color: '#6b7280', fontSize: 10 }}> ({c.date})</span>}
              </div>
            ))}
            {resume.languages.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 6 }}>
                {resume.languages.map((l) => (
                  <span key={l.id} style={{ fontSize: 10.5 }}>
                    <span style={{ fontWeight: 600 }}>{l.name}</span>
                    <span style={{ color: '#6b7280' }}> ({l.proficiency})</span>
                  </span>
                ))}
              </div>
            )}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children, accent }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#111827', paddingBottom: 4, marginBottom: 8, borderBottom: '2px solid #e5e7eb', position: 'relative' }}>
        {title}
        <span style={{ position: 'absolute', left: 0, bottom: -2, width: 60, height: 2, background: accent }} />
      </h2>
      {children}
    </div>
  );
}

function Bullets({ items }) {
  const list = (items || []).map((b) => (typeof b === 'string' ? b : b?.text)).filter(Boolean);
  if (list.length === 0) return null;
  return (
    <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
      {list.map((text, i) => (
        <li key={i} style={{ marginBottom: 2, color: '#374151' }}>{text}</li>
      ))}
    </ul>
  );
}
