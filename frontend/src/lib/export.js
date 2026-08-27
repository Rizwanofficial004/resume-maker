import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeXml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function slugify(str) {
  return String(str || 'resume')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'resume';
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function wordHtmlDocument(resume, html) {
  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>${escapeHtml(resume.title || 'Resume')}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body { font-family: Calibri, Arial, sans-serif; margin: 40px; color: #1f2937; }
    * { box-sizing: border-box; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
}

/** Microsoft Word (.doc) — HTML Word format, opens in Word / LibreOffice */
export function downloadResumeAsWord(resume, html) {
  const fullHtml = wordHtmlDocument(resume, html);
  const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
  triggerDownload(blob, `${slugify(resume.title || 'resume')}.doc`);
}

/** PDF via canvas capture of the live resume preview */
export async function downloadResumeAsPdf(element, resume) {
  if (!element) throw new Error('Resume preview is not ready');

  const holder = element.closest('#print-resume-holder') || element;
  const prev = {
    position: holder.style.position,
    left: holder.style.left,
    top: holder.style.top,
    zIndex: holder.style.zIndex,
    opacity: holder.style.opacity,
    pointerEvents: holder.style.pointerEvents,
  };

  // Bring off-screen print node into view so html2canvas can measure it
  holder.style.position = 'fixed';
  holder.style.left = '0';
  holder.style.top = '0';
  holder.style.zIndex = '-1';
  holder.style.opacity = '1';
  holder.style.pointerEvents = 'none';

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth || 794,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0.5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${slugify(resume?.title || 'resume')}.pdf`);
  } finally {
    holder.style.position = prev.position;
    holder.style.left = prev.left;
    holder.style.top = prev.top;
    holder.style.zIndex = prev.zIndex;
    holder.style.opacity = prev.opacity;
    holder.style.pointerEvents = prev.pointerEvents;
  }
}

function wPara(text, opts = {}) {
  const { bold = false, size = 22, color = '1f2937', spaceAfter = 120 } = opts;
  const runProps = [
    bold ? '<w:b/>' : '',
    `<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>`,
    color ? `<w:color w:val="${color}"/>` : '',
  ].join('');
  return `<w:p>
    <w:pPr><w:spacing w:after="${spaceAfter}"/></w:pPr>
    <w:r><w:rPr>${runProps}</w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>
  </w:p>`;
}

function wHeading(text) {
  return wPara(text.toUpperCase(), { bold: true, size: 24, color: '1d4ed8', spaceAfter: 80 });
}

function buildDocxBody(resume) {
  const p = resume.personal || {};
  const parts = [];

  const name = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Resume';
  parts.push(wPara(name, { bold: true, size: 36, spaceAfter: 60 }));
  if (p.jobTitle) parts.push(wPara(p.jobTitle, { size: 24, color: '334155', spaceAfter: 60 }));

  const contact = [p.email, p.phone, [p.city, p.country].filter(Boolean).join(', '), p.linkedin, p.website]
    .filter(Boolean)
    .join('  ·  ');
  if (contact) parts.push(wPara(contact, { size: 18, color: '64748b', spaceAfter: 200 }));

  if (p.summary) {
    parts.push(wHeading('Summary'));
    parts.push(wPara(p.summary.replace(/<[^>]+>/g, ''), { size: 20 }));
  }

  if (resume.experience?.length) {
    parts.push(wHeading('Experience'));
    resume.experience.forEach((e) => {
      const title = [e.jobTitle, e.company].filter(Boolean).join(' — ');
      const dates = [e.startDate, e.current ? 'Present' : e.endDate].filter(Boolean).join(' – ');
      parts.push(wPara(title, { bold: true, size: 22, spaceAfter: 40 }));
      if (dates || e.location) {
        parts.push(wPara([dates, e.location].filter(Boolean).join(' · '), { size: 18, color: '64748b', spaceAfter: 40 }));
      }
      (e.description || []).forEach((b) => {
        if (b?.text) parts.push(wPara(`• ${b.text}`, { size: 20, spaceAfter: 40 }));
      });
    });
  }

  if (resume.education?.length) {
    parts.push(wHeading('Education'));
    resume.education.forEach((e) => {
      const line = [e.school, e.degree, e.fieldOfStudy].filter(Boolean).join(' — ');
      parts.push(wPara(line, { bold: true, size: 22, spaceAfter: 40 }));
      const dates = [e.startDate, e.current ? 'Present' : e.endDate].filter(Boolean).join(' – ');
      if (dates) parts.push(wPara(dates, { size: 18, color: '64748b' }));
    });
  }

  if (resume.skills?.length) {
    parts.push(wHeading('Skills'));
    parts.push(wPara(resume.skills.map((s) => s.name).filter(Boolean).join(', '), { size: 20 }));
  }

  if (resume.projects?.length) {
    parts.push(wHeading('Projects'));
    resume.projects.forEach((proj) => {
      parts.push(wPara([proj.name, proj.link].filter(Boolean).join(' — '), { bold: true, size: 22, spaceAfter: 40 }));
      (proj.description || []).forEach((b) => {
        if (b?.text) parts.push(wPara(`• ${b.text}`, { size: 20, spaceAfter: 40 }));
      });
    });
  }

  if (resume.certifications?.length) {
    parts.push(wHeading('Certifications'));
    resume.certifications.forEach((c) => {
      parts.push(wPara([c.name, c.issuer, c.date].filter(Boolean).join(' — '), { size: 20 }));
    });
  }

  if (resume.languages?.length) {
    parts.push(wHeading('Languages'));
    parts.push(
      wPara(
        resume.languages
          .map((l) => (l.proficiency ? `${l.name} (${l.proficiency})` : l.name))
          .filter(Boolean)
          .join(', '),
        { size: 20 }
      )
    );
  }

  if (resume.awards?.length) {
    parts.push(wHeading('Awards'));
    resume.awards.forEach((a) => {
      parts.push(wPara([a.name || a.title, a.issuer, a.date].filter(Boolean).join(' — '), { size: 20 }));
    });
  }

  if (resume.hobbies) {
    parts.push(wHeading('Interests'));
    parts.push(wPara(resume.hobbies, { size: 20 }));
  }

  return parts.join('');
}

/** Google Docs / Word (.docx) — editable Open XML document */
export async function downloadResumeAsDocx(resume) {
  const body = buildDocxBody(resume);
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${body}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const zip = new JSZip();
  zip.file('[Content_Types].xml', contentTypes);
  zip.folder('_rels').file('.rels', rels);
  zip.folder('word').file('document.xml', documentXml);

  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  triggerDownload(blob, `${slugify(resume.title || 'resume')}.docx`);
}

export async function downloadResume(format, { resume, element, html }) {
  switch (format) {
    case 'pdf':
      await downloadResumeAsPdf(element, resume);
      break;
    case 'word':
      downloadResumeAsWord(resume, html || element?.innerHTML || '');
      break;
    case 'docs':
      await downloadResumeAsDocx(resume);
      break;
    default:
      throw new Error('Unknown download format');
  }
}
