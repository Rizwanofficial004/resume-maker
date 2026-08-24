'use client';

import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { joinPersonal, hasAny, ContactItem, SkillDots } from './shared';

const iconStyle = { width: 12, height: 12, opacity: 0.9 };

function Section({ title, accent, light, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <h3 style={{
        fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
        color: light ? '#fff' : accent, marginBottom: 4,
        borderBottom: light ? '1px solid rgba(255,255,255,0.3)' : `1px solid ${accent}30`,
        paddingBottom: 3,
      }}>{title}</h3>
      {children}
    </div>
  );
}

function Bullets({ items }) {
  if (!items?.length) return null;
  return (
    <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
      {items.filter(b => b.text?.trim()).map((b, i) => (
        <li key={i} style={{ fontSize: 10.5, marginBottom: 2, lineHeight: 1.5 }}>{b.text}</li>
      ))}
    </ul>
  );
}

function Header({ name, title: jobTitle, accent, style = {}, contactItems = [] }) {
  return (
    <div style={style}>
      <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2, marginBottom: 2 }}>{name}</h1>
      {jobTitle && <p style={{ fontSize: 11, opacity: 0.9, marginBottom: 6 }}>{jobTitle}</p>}
      {contactItems.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 10 }}>
          {contactItems}
        </div>
      )}
    </div>
  );
}

function ContactIcons({ p, accent, light }) {
  const items = [];
  if (p.email) items.push(<ContactItem key="email" icon={<Mail style={iconStyle} />}>{p.email}</ContactItem>);
  if (p.phone) items.push(<ContactItem key="phone" icon={<Phone style={iconStyle} />}>{p.phone}</ContactItem>);
  const loc = joinPersonal(p);
  if (loc) items.push(<ContactItem key="loc" icon={<MapPin style={iconStyle} />}>{loc}</ContactItem>);
  if (p.website) items.push(<ContactItem key="web" icon={<Globe style={iconStyle} />}>{p.website}</ContactItem>);
  if (p.linkedin) items.push(<ContactItem key="lin" icon={<Linkedin style={iconStyle} />}>{p.linkedin}</ContactItem>);
  return items;
}

function ExperienceSection({ experience: rawExp, accent, light }) {
  const experience = Array.isArray(rawExp) ? rawExp : [];
  if (!experience.length) return null;
  return (
    <Section title="Experience" accent={accent} light={light}>
      {experience.map(e => (
        <div key={e.id} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 11 }}>{e.jobTitle}</span>
              {e.company && <span style={{ fontWeight: 600, color: accent, fontSize: 11 }}> — {e.company}</span>}
            </div>
            <span style={{ fontSize: 9.5, color: '#6b7280', whiteSpace: 'nowrap' }}>
              {e.startDate} – {e.current ? 'Present' : e.endDate}
            </span>
          </div>
          {e.location && <div style={{ fontSize: 9.5, color: '#6b7280' }}>{e.location}</div>}
          <Bullets items={e.description} />
        </div>
      ))}
    </Section>
  );
}

function EducationSection({ education: rawEdu, accent, light }) {
  const education = Array.isArray(rawEdu) ? rawEdu : [];
  if (!education.length) return null;
  return (
    <Section title="Education" accent={accent} light={light}>
      {education.map(e => (
        <div key={e.id} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 11 }}>{e.school}</span>
              {e.degree && <span style={{ fontSize: 10.5 }}> — {e.degree}</span>}
              {e.fieldOfStudy && <span style={{ fontSize: 10.5 }}>, {e.fieldOfStudy}</span>}
            </div>
            <span style={{ fontSize: 9.5, color: '#6b7280', whiteSpace: 'nowrap' }}>
              {e.startDate} – {e.current ? 'Present' : e.endDate}
            </span>
          </div>
          {e.description && <p style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>{e.description}</p>}
        </div>
      ))}
    </Section>
  );
}

function SkillsSection({ skills: rawSkills, accent, light }) {
  const skills = Array.isArray(rawSkills) ? rawSkills : [];
  if (!skills.length) return null;
  return (
    <Section title="Skills" accent={accent} light={light}>
      {skills.map(s => (
        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 10.5 }}>{s.name}</span>
          <SkillDots level={s.level} color={light ? '#fff' : accent} />
        </div>
      ))}
    </Section>
  );
}

function LanguagesSection({ languages: rawLang, accent, light }) {
  const languages = Array.isArray(rawLang) ? rawLang : [];
  if (!languages.length) return null;
  return (
    <Section title="Languages" accent={accent} light={light}>
      {languages.map(l => (
        <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 10.5 }}>{l.name}</span>
          <span style={{ fontSize: 9.5, opacity: 0.8 }}>{l.proficiency}</span>
        </div>
      ))}
    </Section>
  );
}

function CertificationsSection({ certifications: rawCerts, accent, light }) {
  const certifications = Array.isArray(rawCerts) ? rawCerts : [];
  if (!certifications.length) return null;
  return (
    <Section title="Certifications" accent={accent} light={light}>
      {certifications.map(c => (
        <div key={c.id} style={{ marginBottom: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 10.5 }}>{c.name}</span>
          {c.issuer && <span style={{ fontSize: 10, color: light ? 'rgba(255,255,255,0.7)' : '#6b7280' }}> — {c.issuer}</span>}
          {c.date && <div style={{ fontSize: 9, color: light ? 'rgba(255,255,255,0.6)' : '#9ca3af' }}>{c.date}</div>}
        </div>
      ))}
    </Section>
  );
}

function SummarySection({ summary, accent, light }) {
  if (!summary) return null;
  return (
    <Section title="Summary" accent={accent} light={light}>
      <p style={{ fontSize: 10.5, lineHeight: 1.6, color: light ? 'rgba(255,255,255,0.9)' : '#374151' }}>{summary}</p>
    </Section>
  );
}

function ProjectsSection({ projects: rawProjects, accent, light }) {
  const projects = Array.isArray(rawProjects) ? rawProjects : [];
  if (!projects.length) return null;
  return (
    <Section title="Projects" accent={accent} light={light}>
      {projects.map(p => (
        <div key={p.id} style={{ marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 10.5 }}>{p.name}</span>
          {p.link && <span style={{ fontSize: 9.5, color: accent }}> — {p.link}</span>}
          <Bullets items={p.description} />
        </div>
      ))}
    </Section>
  );
}

// ═══════════════════════════════════════════════════
// LAYOUT 1: Sidebar Left
// ═══════════════════════════════════════════════════
function SidebarLeft({ resume, accent, config }) {
  const p = resume.personal;
  const { sidebarWidth = '34%', headerAlign = 'left', showPhoto = false, borderStyle = 'none', rounded = false } = config || {};
  return (
    <div style={{ width: '210mm', minHeight: '297mm', background: '#fff', display: 'flex', fontSize: 11, lineHeight: 1.5, color: '#1e293b', fontFamily: 'inherit' }}>
      <aside style={{ width: sidebarWidth, background: accent, color: '#fff', padding: '16mm 8mm', borderRadius: rounded ? '0 12px 12px 0' : 0 }}>
        {showPhoto && p.photo && (
          <div style={{ textAlign: 'center', marginBottom: 10 }}>
            <img src={p.photo} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.6)' }} />
          </div>
        )}
        <h1 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginBottom: 2, textAlign: headerAlign }}>{p.firstName} {p.lastName}</h1>
        {p.jobTitle && <p style={{ fontSize: 11, opacity: 0.9, marginBottom: 10, textAlign: headerAlign }}>{p.jobTitle}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <ContactIcons p={p} accent={accent} light />
        </div>
        <SummarySection summary={p.summary} accent={accent} light />
        <SkillsSection skills={resume.skills} accent={accent} light />
        <LanguagesSection languages={resume.languages} accent={accent} light />
        <CertificationsSection certifications={resume.certifications} accent={accent} light />
      </aside>
      <main style={{ flex: 1, padding: '16mm 12mm' }}>
        <ExperienceSection experience={resume.experience} accent={accent} />
        <EducationSection education={resume.education} accent={accent} />
        <ProjectsSection projects={resume.projects} accent={accent} />
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// LAYOUT 2: Sidebar Right
// ═══════════════════════════════════════════════════
function SidebarRight({ resume, accent, config }) {
  const p = resume.personal;
  const { sidebarWidth = '34%', showPhoto = false, rounded = false } = config || {};
  return (
    <div style={{ width: '210mm', minHeight: '297mm', background: '#fff', display: 'flex', fontSize: 11, lineHeight: 1.5, color: '#1e293b', fontFamily: 'inherit' }}>
      <main style={{ flex: 1, padding: '16mm 12mm' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2, marginBottom: 2 }}>{p.firstName} {p.lastName}</h1>
        {p.jobTitle && <p style={{ fontSize: 11, color: accent, fontWeight: 600, marginBottom: 8 }}>{p.jobTitle}</p>}
        <SummarySection summary={p.summary} accent={accent} />
        <ExperienceSection experience={resume.experience} accent={accent} />
        <EducationSection education={resume.education} accent={accent} />
        <ProjectsSection projects={resume.projects} accent={accent} />
      </main>
      <aside style={{ width: sidebarWidth, background: accent, color: '#fff', padding: '16mm 8mm', borderRadius: rounded ? '12px 0 0 12px' : 0 }}>
        {showPhoto && p.photo && (
          <div style={{ textAlign: 'center', marginBottom: 10 }}>
            <img src={p.photo} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.6)' }} />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: p.photo ? 0 : 40 }}>
          <ContactIcons p={p} accent={accent} light />
        </div>
        <SkillsSection skills={resume.skills} accent={accent} light />
        <LanguagesSection languages={resume.languages} accent={accent} light />
        <CertificationsSection certifications={resume.certifications} accent={accent} light />
      </aside>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// LAYOUT 3: Single Column
// ═══════════════════════════════════════════════════
function SingleColumn({ resume, accent, config }) {
  const p = resume.personal;
  const { headerAlign = 'center', borderBottom = true, headerStyle = 'default' } = config || {};
  return (
    <div style={{ width: '210mm', minHeight: '297mm', background: '#fff', fontSize: 11, lineHeight: 1.5, color: '#1e293b', fontFamily: 'inherit', padding: '16mm' }}>
      <div style={{ textAlign: headerAlign, marginBottom: 14, paddingBottom: 10, borderBottom: borderBottom ? `2px solid ${accent}` : 'none' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.04em', color: '#111827' }}>{p.firstName} {p.lastName}</h1>
        {p.jobTitle && <p style={{ fontSize: 13, color: accent, fontWeight: 600, marginTop: 2 }}>{p.jobTitle}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 8, fontSize: 10, color: '#4b5563' }}>
          <ContactIcons p={p} accent={accent} />
        </div>
      </div>
      <SummarySection summary={p.summary} accent={accent} />
      <ExperienceSection experience={resume.experience} accent={accent} />
      <EducationSection education={resume.education} accent={accent} />
      <SkillsSection skills={resume.skills} accent={accent} />
      <LanguagesSection languages={resume.languages} accent={accent} />
      <CertificationsSection certifications={resume.certifications} accent={accent} />
      <ProjectsSection projects={resume.projects} accent={accent} />
    </div>
  );
}

// ═══════════════════════════════════════════════════
// LAYOUT 4: Header Top (colored header, body below)
// ═══════════════════════════════════════════════════
function HeaderTop({ resume, accent, config }) {
  const p = resume.personal;
  const { headerFull = true, bodyColumns = false, headerStyle = 'solid' } = config || {};
  return (
    <div style={{ width: '210mm', minHeight: '297mm', background: '#fff', fontSize: 11, lineHeight: 1.5, color: '#1e293b', fontFamily: 'inherit' }}>
      <div style={{
        background: headerStyle === 'dark' ? '#1e293b' : accent,
        color: '#fff', padding: '14mm 16mm',
        borderRadius: headerStyle === 'rounded' ? '0 0 16px 16px' : 0,
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>{p.firstName} {p.lastName}</h1>
        {p.jobTitle && <p style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{p.jobTitle}</p>}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 8, fontSize: 10, opacity: 0.8 }}>
          <ContactIcons p={p} accent={accent} light />
        </div>
      </div>
      <div style={{ padding: '12mm 16mm', display: bodyColumns ? 'flex' : 'block', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <SummarySection summary={p.summary} accent={accent} />
          <ExperienceSection experience={resume.experience} accent={accent} />
          <EducationSection education={resume.education} accent={accent} />
        </div>
        {bodyColumns && (
          <div style={{ width: '35%' }}>
            <SkillsSection skills={resume.skills} accent={accent} />
            <LanguagesSection languages={resume.languages} accent={accent} />
            <CertificationsSection certifications={resume.certifications} accent={accent} />
          </div>
        )}
        {!bodyColumns && (
          <>
            <SkillsSection skills={resume.skills} accent={accent} />
            <LanguagesSection languages={resume.languages} accent={accent} />
            <CertificationsSection certifications={resume.certifications} accent={accent} />
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// LAYOUT 5: Two Column (no sidebar, just columns)
// ═══════════════════════════════════════════════════
function TwoColumn({ resume, accent, config }) {
  const p = resume.personal;
  const { colRatio = '60/40', headerBorder = true } = config || {};
  const [left, right] = colRatio.split('/').map(Number);
  return (
    <div style={{ width: '210mm', minHeight: '297mm', background: '#fff', fontSize: 11, lineHeight: 1.5, color: '#1e293b', fontFamily: 'inherit', padding: '16mm' }}>
      <div style={{ textAlign: 'center', marginBottom: 12, paddingBottom: 8, borderBottom: headerBorder ? `2px double ${accent}` : 'none' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{p.firstName} {p.lastName}</h1>
        {p.jobTitle && <p style={{ fontSize: 12, color: accent, fontWeight: 600 }}>{p.jobTitle}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 6, fontSize: 10, color: '#4b5563' }}>
          <ContactIcons p={p} accent={accent} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: left }}>
          <SummarySection summary={p.summary} accent={accent} />
          <ExperienceSection experience={resume.experience} accent={accent} />
          <EducationSection education={resume.education} accent={accent} />
          <ProjectsSection projects={resume.projects} accent={accent} />
        </div>
        <div style={{ flex: right }}>
          <SkillsSection skills={resume.skills} accent={accent} />
          <LanguagesSection languages={resume.languages} accent={accent} />
          <CertificationsSection certifications={resume.certifications} accent={accent} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// LAYOUT 6: Accent Blocks
// ═══════════════════════════════════════════════════
function AccentBlocks({ resume, accent, config }) {
  const p = resume.personal;
  const { blockStyle = 'top', sectionStyle = 'bordered' } = config || {};
  return (
    <div style={{ width: '210mm', minHeight: '297mm', background: '#fff', fontSize: 11, lineHeight: 1.5, color: '#1e293b', fontFamily: 'inherit' }}>
      {blockStyle === 'top' && (
        <div style={{ background: accent, color: '#fff', padding: '14mm 16mm' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>{p.firstName} {p.lastName}</h1>
          {p.jobTitle && <p style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{p.jobTitle}</p>}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 8, fontSize: 10, opacity: 0.8 }}>
            <ContactIcons p={p} accent={accent} light />
          </div>
        </div>
      )}
      {blockStyle === 'left' && (
        <div style={{ display: 'flex' }}>
          <div style={{ background: accent, color: '#fff', width: '35%', padding: '16mm 8mm' }}>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>{p.firstName} {p.lastName}</h1>
            {p.jobTitle && <p style={{ fontSize: 10, opacity: 0.85, marginTop: 2 }}>{p.jobTitle}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10, fontSize: 10 }}>
              <ContactIcons p={p} accent={accent} light />
            </div>
          </div>
          <div style={{ flex: 1, padding: '16mm 12mm' }}>
            <SummarySection summary={p.summary} accent={accent} />
            <ExperienceSection experience={resume.experience} accent={accent} />
          </div>
        </div>
      )}
      <div style={{ padding: blockStyle === 'left' ? '0 12mm 16mm' : '12mm 16mm' }}>
        {blockStyle !== 'left' && <SummarySection summary={p.summary} accent={accent} />}
        <ExperienceSection experience={resume.experience} accent={accent} />
        <EducationSection education={resume.education} accent={accent} />
        <SkillsSection skills={resume.skills} accent={accent} />
        <LanguagesSection languages={resume.languages} accent={accent} />
        <CertificationsSection certifications={resume.certifications} accent={accent} />
        <ProjectsSection projects={resume.projects} accent={accent} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// TEMPLATE CONFIGS — 50 TEMPLATES
// ═══════════════════════════════════════════════════

export const TEMPLATES_CONFIG = [
  // ── Sidebar Left layouts ──
  { id: 'modern', name: 'Modern', layout: 'sidebar-left', thumb: 'Two-column with accent sidebar', config: {} },
  { id: 'ocean', name: 'Ocean', layout: 'sidebar-left', thumb: 'Cool blue sidebar design', config: { sidebarWidth: '36%' } },
  { id: 'forest', name: 'Forest', layout: 'sidebar-left', thumb: 'Nature-inspired green sidebar', config: { sidebarWidth: '32%' } },
  { id: 'royal', name: 'Royal', layout: 'sidebar-left', thumb: 'Deep purple elegant sidebar', config: { sidebarWidth: '35%', rounded: true } },
  { id: 'sunset', name: 'Sunset', layout: 'sidebar-left', thumb: 'Warm orange gradient sidebar', config: { sidebarWidth: '33%' } },
  { id: 'midnight', name: 'Midnight', layout: 'sidebar-left', thumb: 'Dark navy professional sidebar', config: { sidebarWidth: '34%', showPhoto: true } },
  { id: 'ruby', name: 'Ruby', layout: 'sidebar-left', thumb: 'Bold red accent sidebar', config: { sidebarWidth: '36%' } },
  { id: 'emerald', name: 'Emerald', layout: 'sidebar-left', thumb: 'Rich green sidebar design', config: { sidebarWidth: '33%', headerAlign: 'left' } },

  // ── Sidebar Right layouts ──
  { id: 'arctic', name: 'Arctic', layout: 'sidebar-right', thumb: 'Clean right sidebar', config: {} },
  { id: 'aurora', name: 'Aurora', layout: 'sidebar-right', thumb: 'Vibrant right panel', config: { sidebarWidth: '36%' } },
  { id: 'dusk', name: 'Dusk', layout: 'sidebar-right', thumb: 'Muted right sidebar', config: { sidebarWidth: '33%' } },
  { id: 'coral', name: 'Coral', layout: 'sidebar-right', thumb: 'Warm coral right panel', config: { sidebarWidth: '35%', rounded: true } },
  { id: 'teal', name: 'Teal', layout: 'sidebar-right', thumb: 'Teal accent right sidebar', config: { sidebarWidth: '34%' } },
  { id: 'plum', name: 'Plum', layout: 'sidebar-right', thumb: 'Deep plum right panel', config: { sidebarWidth: '33%' } },

  // ── Single Column layouts ──
  { id: 'classic', name: 'Classic', layout: 'single', thumb: 'Traditional centered design', config: { headerAlign: 'center', borderBottom: true } },
  { id: 'minimal', name: 'Minimal', layout: 'single', thumb: 'Clean & spacious layout', config: { headerAlign: 'left', borderBottom: false } },
  { id: 'timeless', name: 'Timeless', layout: 'single', thumb: 'Elegant serif typography', config: { headerAlign: 'center', borderBottom: true } },
  { id: 'austere', name: 'Austere', layout: 'single', thumb: 'Ultra-minimal design', config: { headerAlign: 'left', borderBottom: false } },
  { id: 'refined', name: 'Refined', layout: 'single', thumb: 'Polished single column', config: { headerAlign: 'center', borderBottom: true } },
  { id: 'pure', name: 'Pure', layout: 'single', thumb: 'Simple & effective', config: { headerAlign: 'left', borderBottom: false } },

  // ── Header Top layouts ──
  { id: 'professional', name: 'Professional', layout: 'header-top', thumb: 'Formal dark header', config: { headerStyle: 'dark', bodyColumns: false } },
  { id: 'creative', name: 'Creative', layout: 'header-top', thumb: 'Bold colored header', config: { headerStyle: 'solid', bodyColumns: false } },
  { id: 'bold', name: 'Bold', layout: 'header-top', thumb: 'Strong header presence', config: { headerStyle: 'dark', bodyColumns: true } },
  { id: 'vivid', name: 'Vivid', layout: 'header-top', thumb: 'Vibrant color header', config: { headerStyle: 'solid', bodyColumns: false } },
  { id: 'rounded', name: 'Rounded', layout: 'header-top', thumb: 'Soft rounded header', config: { headerStyle: 'rounded', bodyColumns: false } },
  { id: 'sharp', name: 'Sharp', layout: 'header-top', thumb: 'Crisp dark header', config: { headerStyle: 'dark', bodyColumns: false } },
  { id: 'sleek', name: 'Sleek', layout: 'header-top', thumb: 'Modern sleek design', config: { headerStyle: 'solid', bodyColumns: true } },
  { id: 'executive', name: 'Executive', layout: 'header-top', thumb: 'Elegant leadership style', config: { headerStyle: 'dark', bodyColumns: false } },
  { id: 'azure', name: 'Azure', layout: 'header-top', thumb: 'Sky blue header design', config: { headerStyle: 'solid', bodyColumns: false } },
  { id: 'crimson', name: 'Crimson', layout: 'header-top', thumb: 'Deep red header', config: { headerStyle: 'dark', bodyColumns: false } },
  { id: 'carbon', name: 'Carbon', layout: 'header-top', thumb: 'Dark carbon header', config: { headerStyle: 'dark', bodyColumns: true } },

  // ── Two Column layouts ──
  { id: 'harmony', name: 'Harmony', layout: 'two-column', thumb: 'Balanced two-column', config: { colRatio: '60/40' } },
  { id: 'duo', name: 'Duo', layout: 'two-column', thumb: 'Split column design', config: { colRatio: '50/50' } },
  { id: 'atlas', name: 'Atlas', layout: 'two-column', thumb: 'Wide left column', config: { colRatio: '65/35' } },
  { id: 'prism', name: 'Prism', layout: 'two-column', thumb: 'Light two-column', config: { colRatio: '55/45' } },
  { id: 'zen', name: 'Zen', layout: 'two-column', thumb: 'Peaceful balanced layout', config: { colRatio: '60/40', headerBorder: false } },
  { id: 'vertex', name: 'Vertex', layout: 'two-column', thumb: 'Right-heavy columns', config: { colRatio: '45/55' } },
  { id: 'horizon', name: 'Horizon', layout: 'two-column', thumb: 'Expansive two-column', config: { colRatio: '58/42' } },
  { id: 'nexus', name: 'Nexus', layout: 'two-column', thumb: 'Connected column design', config: { colRatio: '55/45', headerBorder: true } },

  // ── Accent Block layouts ──
  { id: 'block-top', name: 'Block Top', layout: 'accent-blocks', thumb: 'Colored block header', config: { blockStyle: 'top' } },
  { id: 'block-left', name: 'Block Left', layout: 'accent-blocks', thumb: 'Left accent block', config: { blockStyle: 'left' } },
  { id: 'stripe', name: 'Stripe', layout: 'accent-blocks', thumb: 'Accent stripe design', config: { blockStyle: 'top' } },
  { id: 'wave', name: 'Wave', layout: 'accent-blocks', thumb: 'Flowing accent blocks', config: { blockStyle: 'left' } },
  { id: 'pulse', name: 'Pulse', layout: 'accent-blocks', thumb: 'Dynamic accent blocks', config: { blockStyle: 'top' } },
];

// ═══════════════════════════════════════════════════
// TEMPLATE MAP
// ═══════════════════════════════════════════════════

const LAYOUT_MAP = {
  'sidebar-left': SidebarLeft,
  'sidebar-right': SidebarRight,
  'single': SingleColumn,
  'header-top': HeaderTop,
  'two-column': TwoColumn,
  'accent-blocks': AccentBlocks,
};

export function createTemplateComponent(config) {
  return function TemplateComponent({ resume, accent }) {
    const Layout = LAYOUT_MAP[config.layout];
    if (!Layout) return <div>Unknown layout: {config.layout}</div>;
    return <Layout resume={resume} accent={accent} config={config.config} />;
  };
}

export const TEMPLATE_COMPONENTS = Object.fromEntries(
  TEMPLATES_CONFIG.map(t => [t.id, createTemplateComponent(t)])
);
