'use client';

import { ContactRow, Photo, SectionsList, SectionHeading, renderSectionContent } from './sections';

function page(extra = {}) {
  return {
    width: '210mm',
    minHeight: '297mm',
    background: '#fff',
    fontSize: 11,
    lineHeight: 1.5,
    color: '#1e293b',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    ...extra,
  };
}

function nameStyle(header) {
  return {
    fontSize: header.nameSize || 24,
    fontWeight: 700,
    lineHeight: 1.15,
    color: '#111827',
    fontFamily: header.nameFont === 'serif' ? 'Georgia, "Times New Roman", serif' : 'inherit',
  };
}

function photoBorder(header, accent) {
  if (!header.photoBorder) return undefined;
  return `2px solid ${accent}`;
}

function HeaderBlock({ resume, accent, header, inverted = false }) {
  const p = resume.personal || {};
  const light = inverted;
  const textColor = inverted ? '#fff' : '#111827';
  const subColor = inverted ? 'rgba(255,255,255,0.9)' : '#64748b';
  const contactsMode =
    header.contacts === 'pipes' ? 'pipes'
      : header.contacts === 'column' ? 'column'
        : 'row';

  if (header.style === 'centered') {
    return (
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        {header.showPhoto && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <Photo src={p.photo} size={header.photoSize} radius={header.photoRadius} border={photoBorder(header, accent)} />
          </div>
        )}
        <h1 style={{ ...nameStyle(header), color: textColor }}>{p.firstName} {p.lastName}</h1>
        {p.jobTitle && <p style={{ fontSize: 11, color: subColor, marginTop: 4 }}>{p.jobTitle}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <ContactRow personal={p} accent={inverted ? '#fff' : accent} light={light} mode={contactsMode === 'row' ? 'row' : contactsMode} />
        </div>
      </div>
    );
  }

  if (header.style === 'photo-left') {
    return (
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
        {header.showPhoto && <Photo src={p.photo} size={header.photoSize} radius={header.photoRadius} border={photoBorder(header, accent)} />}
        <div style={{ flex: 1 }}>
          <h1 style={{ ...nameStyle(header), color: textColor }}>{p.firstName} {p.lastName}</h1>
          {p.jobTitle && <p style={{ fontSize: 11, color: subColor, marginTop: 3 }}>{p.jobTitle}</p>}
          <div style={{ marginTop: 8 }}>
            <ContactRow personal={p} accent={inverted ? '#fff' : accent} light={light} mode={contactsMode} />
          </div>
        </div>
      </div>
    );
  }

  if (header.style === 'photo-right') {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ ...nameStyle(header), color: textColor }}>{p.firstName} {p.lastName}</h1>
          {p.jobTitle && <p style={{ fontSize: 11, color: subColor, marginTop: 3 }}>{p.jobTitle}</p>}
          <div style={{ marginTop: 8 }}>
            <ContactRow personal={p} accent={inverted ? '#fff' : accent} light={light} mode={contactsMode} />
          </div>
        </div>
        {header.showPhoto && <Photo src={p.photo} size={header.photoSize} radius={header.photoRadius} border={photoBorder(header, accent)} />}
      </div>
    );
  }

  if (header.style === 'band') {
    return (
      <div style={{ background: accent, color: '#fff', padding: '12mm 14mm 10mm', marginBottom: 0 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {header.showPhoto && <Photo src={p.photo} size={header.photoSize} radius={header.photoRadius} border="2px solid rgba(255,255,255,0.6)" />}
          <div>
            <h1 style={{ ...nameStyle(header), color: '#fff' }}>{p.firstName} {p.lastName}</h1>
            {p.jobTitle && <p style={{ fontSize: 12, opacity: 0.9, marginTop: 3 }}>{p.jobTitle}</p>}
          </div>
        </div>
      </div>
    );
  }

  if (header.style === 'panel') {
    return (
      <div style={{
        background: accent,
        color: '#fff',
        borderRadius: '12px 12px 4px 4px',
        padding: '14px 16px',
        marginBottom: 14,
      }}>
        <h1 style={{ ...nameStyle(header), color: '#fff', fontFamily: header.nameFont === 'serif' ? 'Georgia, serif' : 'inherit' }}>
          {p.firstName} {p.lastName}
        </h1>
        {p.jobTitle && <p style={{ fontSize: 11, opacity: 0.92, marginTop: 3 }}>{p.jobTitle}</p>}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.35)', margin: '8px 0' }} />
        <ContactRow personal={p} accent="#fff" light mode="row" />
      </div>
    );
  }

  if (header.style === 'card') {
    return (
      <div style={{
        border: '1px solid #ccc',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
      }}>
        {header.showPhoto && <Photo src={p.photo} size={header.photoSize} radius={12} />}
        <div style={{ flex: 1 }}>
          <h1 style={nameStyle(header)}>{p.firstName} {p.lastName}</h1>
          {p.jobTitle && <p style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{p.jobTitle}</p>}
          <div style={{ marginTop: 6 }}>
            <ContactRow personal={p} accent={accent} mode="row" />
          </div>
        </div>
      </div>
    );
  }

  if (header.style === 'leafish') {
    const soft = `${accent}18`;
    const mid = `${accent}33`;
    return (
      <>
        <div style={{ background: soft, padding: '12mm 14mm 8mm', display: 'flex', gap: 12 }}>
          {header.showPhoto && <Photo src={p.photo} size={header.photoSize} radius={header.photoRadius} />}
          <div style={{ flex: 1 }}>
            <h1 style={nameStyle(header)}>{p.firstName} {p.lastName}</h1>
            {p.jobTitle && <p style={{ fontSize: 11, color: accent, fontWeight: 600, marginTop: 2 }}>{p.jobTitle}</p>}
            {p.summary && <p style={{ fontSize: 10.5, marginTop: 8, color: '#374151', lineHeight: 1.5 }}>{p.summary}</p>}
          </div>
        </div>
        <div style={{ background: mid, padding: '6px 14mm', marginBottom: 0 }}>
          <ContactRow personal={p} accent={accent} mode="row" />
        </div>
      </>
    );
  }

  // sidebar-top / default fallback
  return (
    <div style={{ textAlign: 'center', marginBottom: 10 }}>
      {header.showPhoto && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <Photo src={p.photo} size={header.photoSize} radius={header.photoRadius} border={photoBorder(header, accent)} />
        </div>
      )}
      <h1 style={{ ...nameStyle(header), fontSize: header.nameSize || 18 }}>{p.firstName} {p.lastName}</h1>
      {p.jobTitle && <p style={{ fontSize: 10, color: accent, marginTop: 3 }}>{p.jobTitle}</p>}
    </div>
  );
}

function sidebarBg(tone, accent) {
  if (tone === 'accent') return { background: accent, color: '#fff', light: true };
  if (tone === 'tint') return { background: `${accent}22`, color: '#1e293b', light: false };
  if (tone === 'muted') return { background: '#f1f5f9', color: '#1e293b', light: false };
  if (tone === 'light') return { background: '#f8fafc', color: '#1e293b', light: false };
  return { background: 'transparent', color: '#1e293b', light: false };
}

/**
 * Renders a resume from a declarative template definition.
 */
export default function TemplateFromDefinition({ definition, resume, accent }) {
  const def = definition;
  const layout = def.layout || {};
  const header = def.header || {};
  const sections = def.sections || {};
  const headingStyle = sections.heading || 'left-underline';
  const skillsDisplay = sections.skillsDisplay || 'dots';
  const experienceHeader = sections.experienceHeader || 'stacked';
  const mainIds = sections.main || ['summary', 'experience', 'education', 'projects'];
  const sideIds = sections.sidebar || ['skills', 'languages', 'certifications', 'hobbies'];
  const width = `${layout.sidebarWidth || 34}%`;
  const sectionOpts = { headingStyle, skillsDisplay, experienceHeader };

  // ── Bronzor rows ──
  if (layout.type === 'bronzor') {
    return (
      <div style={page({ padding: layout.padding || '14mm 16mm' })}>
        <HeaderBlock resume={resume} accent={accent} header={header} />
        {mainIds.concat(sideIds).map((id) => {
          const content = renderSectionContent(id, resume, accent, sectionOpts);
          if (!content) return null;
          const titles = {
            summary: 'Summary', experience: 'Experience', education: 'Education', skills: 'Skills',
            projects: 'Projects', certifications: 'Certifications', languages: 'Languages',
            awards: 'Awards', hobbies: 'Interests', references: 'References',
          };
          return (
            <div key={id} style={{ display: 'flex', gap: 14, marginBottom: 12, borderTop: `2px solid ${accent}`, paddingTop: 8 }}>
              <div style={{ width: '22%', fontSize: 11, fontWeight: 700, color: accent }}>{titles[id] || id}</div>
              <div style={{ flex: 1 }}>{content}</div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── Cards (Lapras) ──
  if (layout.type === 'cards') {
    return (
      <div style={page({ padding: layout.padding || '14mm 16mm' })}>
        <HeaderBlock resume={resume} accent={accent} header={{ ...header, style: header.style || 'card' }} />
        {mainIds.concat(sideIds).map((id) => {
          const content = renderSectionContent(id, resume, accent, sectionOpts);
          if (!content) return null;
          const titles = {
            summary: 'Summary', experience: 'Experience', education: 'Education', skills: 'Skills',
            projects: 'Projects', certifications: 'Certifications', languages: 'Languages',
            awards: 'Awards', hobbies: 'Interests', references: 'References',
          };
          return (
            <div key={id} style={{
              border: '1px solid #ccc',
              borderRadius: 12,
              padding: '14px 12px 10px',
              marginBottom: 14,
              position: 'relative',
            }}>
              <span style={{
                position: 'absolute', top: -9, left: 14, background: '#fff',
                padding: '0 8px', fontSize: 11, fontWeight: 700, color: accent,
              }}>{titles[id]}</span>
              {content}
            </div>
          );
        })}
      </div>
    );
  }

  // ── Scizor ──
  if (layout.type === 'scizor') {
    return (
      <div style={page({ borderTop: `6px solid ${accent}`, padding: layout.padding || '12mm 16mm' })}>
        <HeaderBlock resume={resume} accent={accent} header={{ ...header, style: header.style || 'photo-right' }} />
        {header.style === 'photo-right' && (
          <div style={{ height: 2, background: '#b0b0b0', width: '72%', margin: '-6px 0 12px' }} />
        )}
        <SectionsList ids={mainIds.concat(sideIds)} resume={resume} accent={accent} {...sectionOpts} headingStyle="scizor" />
      </div>
    );
  }

  // ── Ditgar / Gengar ──
  if (layout.type === 'ditgar') {
    const soft = `${accent}22`;
    return (
      <div style={page({ display: 'flex' })}>
        <aside style={{ width, background: soft, display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: accent, color: '#fff', padding: '14mm 8mm 10mm' }}>
            <HeaderBlock
              resume={resume}
              accent={accent}
              header={{ ...header, style: 'centered', nameSize: 18, contacts: 'column', photoBorder: true }}
              inverted
            />
          </div>
          <div style={{ padding: '10mm 8mm', flex: 1 }}>
            <SectionsList ids={sideIds} resume={resume} accent={accent} {...sectionOpts} />
          </div>
        </aside>
        <main style={{ flex: 1, padding: '14mm 12mm' }}>
          {resume.personal?.summary && (
            <div style={{ background: soft, padding: '10px 12px', marginBottom: 12, borderRadius: 4 }}>
              <SectionHeading title="Summary" accent={accent} style={headingStyle} />
              {renderSectionContent('summary', resume, accent, sectionOpts)}
            </div>
          )}
          <SectionsList
            ids={mainIds.filter((x) => x !== 'summary')}
            resume={resume}
            accent={accent}
            {...sectionOpts}
          />
        </main>
      </div>
    );
  }

  // ── Pikachu ──
  if (layout.type === 'pikachu') {
    return (
      <div style={page({ display: 'flex', padding: '12mm' })}>
        <aside style={{ width: width || '30%', paddingRight: 12 }}>
          {header.showPhoto && (
            <div style={{ marginBottom: 12 }}>
              <Photo src={resume.personal?.photo} size={header.photoSize || 80} radius={header.photoRadius || 10} />
            </div>
          )}
          <SectionsList ids={sideIds} resume={resume} accent={accent} {...sectionOpts} />
        </aside>
        <main style={{ flex: 1 }}>
          <HeaderBlock resume={resume} accent={accent} header={{ ...header, style: 'panel', showPhoto: false }} />
          <SectionsList ids={mainIds} resume={resume} accent={accent} {...sectionOpts} />
        </main>
      </div>
    );
  }

  // ── Leafish (uses leafish header + columns) ──
  if (layout.type === 'columns' && header.style === 'leafish') {
    return (
      <div style={page()}>
        <HeaderBlock resume={resume} accent={accent} header={header} />
        <div style={{ display: 'flex', gap: 16, padding: '10mm 14mm' }}>
          <div style={{ flex: 1 }}>
            <SectionsList
              ids={mainIds.filter((x) => x !== 'summary')}
              resume={resume}
              accent={accent}
              {...sectionOpts}
            />
          </div>
          <div style={{ width }}>
            <SectionsList ids={sideIds} resume={resume} accent={accent} {...sectionOpts} />
          </div>
        </div>
      </div>
    );
  }

  // ── Sidebar left / right ──
  if (layout.type === 'sidebar-left' || layout.type === 'sidebar-right') {
    const tone = sidebarBg(layout.sidebarTone || 'accent', accent);
    const headerInSidebar = header.style === 'sidebar-top';
    const side = (
      <aside style={{
        width,
        background: tone.background,
        color: tone.color,
        padding: '14mm 8mm',
      }}>
        {headerInSidebar && (
          <HeaderBlock resume={resume} accent={accent} header={header} inverted={tone.light} />
        )}
        {headerInSidebar && layout.sidebarTone === 'muted' && (
          <div style={{ border: `1px solid ${accent}`, borderRadius: 6, padding: 8, marginBottom: 12 }}>
            <ContactRow personal={resume.personal || {}} accent={accent} mode="column" />
          </div>
        )}
        <SectionsList ids={sideIds} resume={resume} accent={accent} {...sectionOpts} light={tone.light} />
      </aside>
    );
    const main = (
      <main style={{ flex: 1, padding: '14mm 12mm' }}>
        {!headerInSidebar && header.style !== 'band' && (
          <HeaderBlock resume={resume} accent={accent} header={header} />
        )}
        <SectionsList ids={mainIds} resume={resume} accent={accent} {...sectionOpts} />
      </main>
    );
    return (
      <div style={page({ display: 'flex' })}>
        {layout.type === 'sidebar-left' ? <>{side}{main}</> : <>{main}{side}</>}
      </div>
    );
  }

  // ── Band header + columns (Ditto) ──
  if (layout.type === 'columns' && header.style === 'band') {
    return (
      <div style={page()}>
        <HeaderBlock resume={resume} accent={accent} header={header} />
        <div style={{ padding: '8mm 14mm', display: 'flex', gap: 16 }}>
          <div style={{ width }}>
            <div style={{ marginBottom: 12 }}>
              <ContactRow personal={resume.personal || {}} accent={accent} mode="column" />
            </div>
            <SectionsList ids={sideIds} resume={resume} accent={accent} {...sectionOpts} />
          </div>
          <div style={{ flex: 1 }}>
            <SectionsList ids={mainIds} resume={resume} accent={accent} {...sectionOpts} />
          </div>
        </div>
      </div>
    );
  }

  // ── Columns with timeline (Azurill) ──
  if (layout.type === 'columns') {
    return (
      <div style={page({ padding: layout.padding || '12mm 14mm' })}>
        <HeaderBlock resume={resume} accent={accent} header={header} />
        <div style={{ display: 'flex', gap: 0 }}>
          <div style={{ width, paddingRight: 12 }}>
            <SectionsList ids={sideIds} resume={resume} accent={accent} {...sectionOpts} />
          </div>
          <div style={{
            flex: 1,
            paddingLeft: 16,
            borderLeft: sections.timeline ? `2px solid ${accent}55` : undefined,
            position: 'relative',
          }}>
            <SectionsList
              ids={mainIds}
              resume={resume}
              accent={accent}
              {...sectionOpts}
              timeline={!!sections.timeline}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Single column (Kakuna, Onyx, Meowth, Rhyhorn) ──
  const shell = page({
    padding: layout.padding || '14mm 16mm',
    borderTop: layout.topStripe ? `6px solid ${accent}` : undefined,
  });

  return (
    <div style={shell}>
      <HeaderBlock resume={resume} accent={accent} header={header} />
      {header.style === 'photo-left' && layout.type === 'single' && (
        <div style={{ borderBottom: `2px solid ${accent}`, marginTop: -6, marginBottom: 14 }} />
      )}
      <SectionsList
        ids={[...mainIds, ...sideIds.filter((id) => !mainIds.includes(id))]}
        resume={resume}
        accent={accent}
        {...sectionOpts}
      />
    </div>
  );
}
