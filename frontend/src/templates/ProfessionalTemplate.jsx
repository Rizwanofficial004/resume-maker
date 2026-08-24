'use client';

import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { joinPersonal, hasAny, ContactItem } from './shared';

export default function ProfessionalTemplate({ resume, accent }) {
  const p = resume.personal;

  return (
    <div style={{ width: '210mm', minHeight: '297mm', background: '#fff', color: '#1f2937', fontSize: 10.5, lineHeight: 1.5, fontFamily: 'inherit' }}>
      <div style={{ background: '#0f172a', color: '#fff', padding: '14mm 16mm' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '0.02em' }}>{p.firstName} {p.lastName}</h1>
            {p.jobTitle && <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{p.jobTitle}</p>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 10, color: 'rgba(255,255,255,0.9)', alignItems: 'flex-start' }}>
            {p.email && <ContactItem icon={<Mail style={{ width: 11, height: 11 }} />}>{p.email}</ContactItem>}
            {p.phone && <ContactItem icon={<Phone style={{ width: 11, height: 11 }} />}>{p.phone}</ContactItem>}
            {joinPersonal(p) && <ContactItem icon={<MapPin style={{ width: 11, height: 11 }} />}>{joinPersonal(p)}</ContactItem>}
            {p.website && <ContactItem icon={<Globe style={{ width: 11, height: 11 }} />}>{p.website}</ContactItem>}
            {p.linkedin && <ContactItem icon={<Linkedin style={{ width: 11, height: 11 }} />}>{p.linkedin}</ContactItem>}
          </div>
        </div>
      </div>

      <div style={{ padding: '10mm 16mm 16mm' }}>
        {p.summary && (
          <Section title="Professional Summary" accent>
            <p>{p.summary}</p>
          </Section>
        )}

        {resume.experience.length > 0 && (
          <Section title="Professional Experience" accent>
            {resume.experience.map((e) => (
              <div key={e.id} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{e.jobTitle}</span>
                  <span style={{ fontSize: 10, color: '#6b7280', whiteSpace: 'nowrap' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
                </div>
                <div style={{ fontWeight: 600, color: accent }}>{[e.company, e.location].filter(Boolean).join(' · ')}</div>
                <Bullets items={e.description} />
              </div>
            ))}
          </Section>
        )}

        {resume.education.length > 0 && (
          <Section title="Education" accent>
            {resume.education.map((e) => (
              <div key={e.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{e.school}</span>
                  <span style={{ fontSize: 10, color: '#6b7280', whiteSpace: 'nowrap' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
                </div>
                <div style={{ color: '#4b5563' }}>
                  {[e.degree, e.fieldOfStudy].filter(Boolean).join(', ')}
                </div>
                {e.description && <p style={{ fontSize: 10, color: '#6b7280' }}>{e.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {resume.skills.length > 0 && (
          <Section title="Core Competencies" accent>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {resume.skills.map((s) => (
                <span key={s.id} style={{ border: `1px solid ${accent}33`, color: '#111827', background: '#f8fafc', borderRadius: 4, padding: '2px 9px', fontSize: 10, fontWeight: 600 }}>
                  {s.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {resume.projects.length > 0 && (
          <Section title="Projects" accent>
            {resume.projects.map((pr) => (
              <div key={pr.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{pr.name}</span>
                  {pr.link && <span style={{ fontSize: 10, color: accent }}>{pr.link}</span>}
                </div>
                <Bullets items={pr.description} />
              </div>
            ))}
          </Section>
        )}

        {resume.certifications.length > 0 && (
          <Section title="Certifications" accent>
            {resume.certifications.map((c) => (
              <div key={c.id} style={{ marginBottom: 3 }}>
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                {c.issuer && <span> — {c.issuer}</span>}
                {c.date && <span style={{ color: '#6b7280' }}> ({c.date})</span>}
              </div>
            ))}
          </Section>
        )}

        {resume.languages.length > 0 && (
          <Section title="Languages" accent>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              {resume.languages.map((l) => (
                <span key={l.id}>
                  <span style={{ fontWeight: 600 }}>{l.name}</span>
                  <span style={{ color: '#6b7280' }}> ({l.proficiency})</span>
                </span>
              ))}
            </div>
          </Section>
        )}

        {resume.references && (
          <Section title="References" accent>
            <p>{resume.references}</p>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children, accent }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#111827', borderBottom: `2px solid ${accent}`, paddingBottom: 3, marginBottom: 8, display: 'inline-block', paddingRight: 20 }}>
        {title}
      </h2>
      <div style={{ marginTop: 4 }}>{children}</div>
    </div>
  );
}

function Bullets({ items }) {
  const list = (items || []).map((b) => (typeof b === 'string' ? b : b?.text)).filter(Boolean);
  if (list.length === 0) return null;
  return (
    <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
      {list.map((text, i) => (
        <li key={i} style={{ marginBottom: 2 }}>{text}</li>
      ))}
    </ul>
  );
}
