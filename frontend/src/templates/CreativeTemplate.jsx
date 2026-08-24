'use client';

import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { joinPersonal, ContactItem } from './shared';

export default function CreativeTemplate({ resume, accent }) {
  const p = resume.personal;

  return (
    <div style={{ width: '210mm', minHeight: '297mm', background: '#fff', color: '#1e293b', fontSize: 11, lineHeight: 1.5, fontFamily: 'inherit', display: 'flex' }}>
      <aside style={{ width: '34%', background: accent, color: '#fff', padding: '16mm 8mm' }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, marginBottom: 12, transform: 'rotate(-6deg)' }}>
          {p.firstName?.[0]}{p.lastName?.[0]}
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.15 }}>{p.firstName} {p.lastName}</h1>
        {p.jobTitle && <p style={{ fontSize: 11.5, opacity: 0.92, marginBottom: 12 }}>{p.jobTitle}</p>}

        <Block title="Contact">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <ContactItem icon={<Mail style={{ width: 12, height: 12 }} />}>{p.email}</ContactItem>
            <ContactItem icon={<Phone style={{ width: 12, height: 12 }} />}>{p.phone}</ContactItem>
            {joinPersonal(p) && <ContactItem icon={<MapPin style={{ width: 12, height: 12 }} />}>{joinPersonal(p)}</ContactItem>}
            {p.website && <ContactItem icon={<Globe style={{ width: 12, height: 12 }} />}>{p.website}</ContactItem>}
            {p.linkedin && <ContactItem icon={<Linkedin style={{ width: 12, height: 12 }} />}>{p.linkedin}</ContactItem>}
          </div>
        </Block>

        {resume.skills.length > 0 && (
          <Block title="Skills">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {resume.skills.map((s) => (
                <span key={s.id} style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 999, padding: '3px 9px', fontSize: 9.5, fontWeight: 600 }}>
                  {s.name}
                </span>
              ))}
            </div>
          </Block>
        )}

        {resume.languages.length > 0 && (
          <Block title="Languages">
            {resume.languages.map((l) => (
              <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>{l.name}</span>
                <span style={{ opacity: 0.85, fontSize: 10 }}>{l.proficiency}</span>
              </div>
            ))}
          </Block>
        )}

        {resume.certifications.length > 0 && (
          <Block title="Certifications">
            {resume.certifications.map((c) => (
              <div key={c.id} style={{ marginBottom: 6, fontSize: 10 }}>
                <div style={{ fontWeight: 700 }}>{c.name}</div>
                <div style={{ opacity: 0.85 }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>
              </div>
            ))}
          </Block>
        )}
      </aside>

      <main style={{ flex: 1, padding: '16mm 12mm' }}>
        {p.summary && (
          <Section title="About Me" accent>
            <p style={{ color: '#374151' }}>{p.summary}</p>
          </Section>
        )}

        {resume.experience.length > 0 && (
          <Section title="Experience" accent>
            {resume.experience.map((e) => (
              <div key={e.id} style={{ marginBottom: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 800, fontSize: 12, color: '#0f172a' }}>{e.jobTitle}</span>
                  <span style={{ fontSize: 10, color: '#64748b' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
                </div>
                <div style={{ fontWeight: 700, color: accent, fontSize: 10.5 }}>
                  {[e.company, e.location].filter(Boolean).join(' · ')}
                </div>
                <Bullets items={e.description} />
              </div>
            ))}
          </Section>
        )}

        {resume.projects.length > 0 && (
          <Section title="Projects" accent>
            {resume.projects.map((pr) => (
              <div key={pr.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: 12, color: '#0f172a' }}>{pr.name}</span>
                  {pr.link && <span style={{ fontSize: 10, color: accent }}>{pr.link}</span>}
                </div>
                <Bullets items={pr.description} />
              </div>
            ))}
          </Section>
        )}

        {resume.education.length > 0 && (
          <Section title="Education" accent>
            {resume.education.map((e) => (
              <div key={e.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 800, fontSize: 12, color: '#0f172a' }}>{e.school}</span>
                  <span style={{ fontSize: 10, color: '#64748b' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
                </div>
                <div style={{ color: '#475569' }}>
                  {[e.degree, e.fieldOfStudy].filter(Boolean).join(', ')}
                </div>
              </div>
            ))}
          </Section>
        )}
      </main>
    </div>
  );
}

function Block({ title, children }) {
  return (
    <div style={{ marginTop: 14 }}>
      <h2 style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '2px solid rgba(255,255,255,0.35)', paddingBottom: 3, marginBottom: 7 }}>
        {title}
      </h2>
      <div style={{ fontSize: 10.5 }}>{children}</div>
    </div>
  );
}

function Section({ title, children, accent }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <h2 style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0f172a', background: `${accent}1a`, padding: '3px 10px', borderRadius: 6, marginBottom: 8 }}>
        {title}
      </h2>
      <div>{children}</div>
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
