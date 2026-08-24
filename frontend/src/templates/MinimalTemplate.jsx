'use client';

import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { joinPersonal, ContactItem } from './shared';

export default function MinimalTemplate({ resume, accent }) {
  const p = resume.personal;

  return (
    <div style={{ width: '210mm', minHeight: '297mm', background: '#fff', color: '#111827', fontSize: 11, lineHeight: 1.6, fontFamily: 'inherit', padding: '20mm 18mm' }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>{p.firstName} {p.lastName}</h1>
        {p.jobTitle && <p style={{ fontSize: 14, color: accent, fontWeight: 600, marginTop: 2 }}>{p.jobTitle}</p>}
        <div style={{ width: 48, height: 4, background: accent, marginTop: 10, borderRadius: 2 }} />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12, fontSize: 10.5, color: '#4b5563' }}>
          {p.email && <ContactItem icon={<Mail style={{ width: 11, height: 11 }} />}>{p.email}</ContactItem>}
          {p.phone && <ContactItem icon={<Phone style={{ width: 11, height: 11 }} />}>{p.phone}</ContactItem>}
          {joinPersonal(p) && <ContactItem icon={<MapPin style={{ width: 11, height: 11 }} />}>{joinPersonal(p)}</ContactItem>}
          {p.website && <ContactItem icon={<Globe style={{ width: 11, height: 11 }} />}>{p.website}</ContactItem>}
          {p.linkedin && <ContactItem icon={<Linkedin style={{ width: 11, height: 11 }} />}>{p.linkedin}</ContactItem>}
        </div>
      </div>

      {p.summary && (
        <Section title="About Me" accent>
          <p style={{ color: '#374151' }}>{p.summary}</p>
        </Section>
      )}

      {resume.experience.length > 0 && (
        <Section title="Experience" accent>
          {resume.experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: 12 }}>{e.jobTitle}</span>
                <span style={{ fontSize: 10.5, color: '#6b7280' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
              </div>
              {(e.company || e.location) && (
                <div style={{ color: accent, fontWeight: 600, fontSize: 10.5 }}>
                  {[e.company, e.location].filter(Boolean).join(' · ')}
                </div>
              )}
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
                <span style={{ fontWeight: 700, fontSize: 12 }}>{e.school}</span>
                <span style={{ fontSize: 10.5, color: '#6b7280' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
              </div>
              {e.degree && <span style={{ color: '#4b5563' }}>{e.degree}{e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ''}</span>}
              {e.description && <p style={{ fontSize: 10.5, color: '#6b7280' }}>{e.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {resume.skills.length > 0 && (
        <Section title="Skills" accent>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {resume.skills.map((s) => (
              <span key={s.id} style={{ fontSize: 11 }}>{s.name}</span>
            ))}
          </div>
        </Section>
      )}

      {resume.projects.length > 0 && (
        <Section title="Projects" accent>
          {resume.projects.map((pr) => (
            <div key={pr.id} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 12 }}>
                {pr.name}
                {pr.link && <span style={{ fontWeight: 400, color: accent, fontSize: 10.5 }}> — {pr.link}</span>}
              </div>
              <Bullets items={pr.description} />
            </div>
          ))}
        </Section>
      )}

      {(resume.certifications.length > 0 || resume.languages.length > 0) && (
        <Section title="Certifications & Languages" accent>
          {resume.certifications.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              {resume.certifications.map((c) => (
                <div key={c.id} style={{ fontSize: 11 }}>
                  <span style={{ fontWeight: 600 }}>{c.name}</span>
                  {c.issuer && <span style={{ color: '#6b7280' }}> — {c.issuer}</span>}
                </div>
              ))}
            </div>
          )}
          {resume.languages.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              {resume.languages.map((l) => (
                <span key={l.id} style={{ fontSize: 11 }}>
                  <span style={{ fontWeight: 600 }}>{l.name}</span>
                  <span style={{ color: '#6b7280' }}> ({l.proficiency})</span>
                </span>
              ))}
            </div>
          )}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children, accent }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#6b7280', marginBottom: 8 }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Bullets({ items }) {
  const list = (items || []).map((b) => (typeof b === 'string' ? b : b?.text)).filter(Boolean);
  if (list.length === 0) return null;
  return (
    <ul style={{ margin: '5px 0 0', paddingLeft: 18 }}>
      {list.map((text, i) => (
        <li key={i} style={{ marginBottom: 2, color: '#374151' }}>{text}</li>
      ))}
    </ul>
  );
}
