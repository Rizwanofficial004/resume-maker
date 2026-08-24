'use client';

import { Mail, Phone, MapPin, Globe, Linkedin, FileText } from 'lucide-react';
import { joinPersonal, hasAny, ContactItem, SkillDots } from './shared';

const iconStyle = { width: 13, height: 13, opacity: 0.9 };

export default function ModernTemplate({ resume, accent }) {
  const p = resume.personal;
  const showSidebar = hasAny(p, ['email', 'phone', 'address', 'city', 'website', 'linkedin']) || resume.skills.length > 0 || resume.languages.length > 0;

  return (
    <div style={{ width: '210mm', minHeight: '297mm', background: '#fff', display: 'flex', fontSize: 11, lineHeight: 1.5, color: '#1e293b', fontFamily: 'inherit' }}>
      {showSidebar && (
        <aside style={{ width: '34%', background: accent, color: '#fff', padding: '16mm 8mm' }}>
          {p.photo && (
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <img src={p.photo} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.6)' }} />
            </div>
          )}
          <h1 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginBottom: 2 }}>{p.firstName} {p.lastName}</h1>
          {p.jobTitle && <p style={{ fontSize: 11, opacity: 0.9, marginBottom: 10 }}>{p.jobTitle}</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <ContactItem icon={<Mail style={iconStyle} />}>{p.email}</ContactItem>
            <ContactItem icon={<Phone style={iconStyle} />}>{p.phone}</ContactItem>
            {p.address && <ContactItem icon={<MapPin style={iconStyle} />}>{p.address}</ContactItem>}
            {joinPersonal(p) && <ContactItem icon={<MapPin style={iconStyle} />}>{joinPersonal(p)}</ContactItem>}
            {p.website && <ContactItem icon={<Globe style={iconStyle} />}>{p.website}</ContactItem>}
            {p.linkedin && <ContactItem icon={<Linkedin style={iconStyle} />}>{p.linkedin}</ContactItem>}
          </div>

          {resume.skills.length > 0 && (
            <Section title="Skills" light>
              {resume.skills.map((s) => (
                <div key={s.id} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span>{s.name}</span>
                  </div>
                  <SkillDots level={s.level} color="#fff" />
                </div>
              ))}
            </Section>
          )}

          {resume.languages.length > 0 && (
            <Section title="Languages" light>
              {resume.languages.map((l) => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>{l.name}</span>
                  <span style={{ opacity: 0.85, fontSize: 10 }}>{l.proficiency}</span>
                </div>
              ))}
            </Section>
          )}

          {resume.certifications.length > 0 && (
            <Section title="Certifications" light>
              {resume.certifications.map((c) => (
                <div key={c.id} style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 10.5 }}>{c.name}</div>
                  <div style={{ opacity: 0.85, fontSize: 10 }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>
                </div>
              ))}
            </Section>
          )}
        </aside>
      )}

      <main style={{ flex: 1, padding: '16mm 12mm', background: '#fff' }}>
        {!showSidebar && (
          <div style={{ marginBottom: 14 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: accent, lineHeight: 1.2 }}>{p.firstName} {p.lastName}</h1>
            {p.jobTitle && <p style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>{p.jobTitle}</p>}
          </div>
        )}

        {p.summary && (
          <Section title="Professional Summary">
            <p>{p.summary}</p>
          </Section>
        )}

        {resume.experience.length > 0 && (
          <Section title="Work Experience">
            {resume.experience.map((e) => (
              <div key={e.id} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{e.jobTitle}</div>
                    {e.company && <div style={{ color: accent, fontWeight: 600 }}>{e.company}</div>}
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 10, color: '#64748b', whiteSpace: 'nowrap' }}>
                    <div>{e.startDate} – {e.current ? 'Present' : e.endDate}</div>
                    {e.location && <div>{e.location}</div>}
                  </div>
                </div>
                <Bullets items={e.description} />
              </div>
            ))}
          </Section>
        )}

        {resume.projects.length > 0 && (
          <Section title="Projects">
            {resume.projects.map((pr) => (
              <div key={pr.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{pr.name}</span>
                  {pr.link && <span style={{ fontSize: 10, color: accent }}>{pr.link}</span>}
                </div>
                <Bullets items={pr.description} />
              </div>
            ))}
          </Section>
        )}

        {resume.education.length > 0 && (
          <Section title="Education">
            {resume.education.map((e) => (
              <div key={e.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{e.school}</span>
                    {e.degree && <span> — {e.degree}</span>}
                    {e.fieldOfStudy && <span>, {e.fieldOfStudy}</span>}
                  </div>
                  <span style={{ fontSize: 10, color: '#64748b', whiteSpace: 'nowrap' }}>
                    {e.startDate} – {e.current ? 'Present' : e.endDate}
                  </span>
                </div>
                {e.description && <p style={{ fontSize: 10.5, color: '#475569' }}>{e.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {resume.references && (
          <Section title="References">
            <p>{resume.references}</p>
          </Section>
        )}
      </main>
    </div>
  );
}

function Section({ title, children, light }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h2 style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: light ? '#fff' : undefined, borderBottom: `2px solid ${light ? 'rgba(255,255,255,0.35)' : 'var(--accent)'}`, paddingBottom: 3, marginBottom: 8 }}>
        {title}
      </h2>
      <div style={{ color: light ? 'rgba(255,255,255,0.95)' : undefined }}>{children}</div>
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
