'use client';

import ResumeRenderer from '@/templates';
import { buildSampleResume } from '@/lib/sample-data';

export default function ResumePreviewMock({ templateId = 'modern', accent = '#1d4ed8', scale = 0.55, className = '' }) {
  const resume = buildSampleResume();
  const width = 210;

  return (
    <div className={`relative ${className}`} style={{ width, height: width * 1.414, overflow: 'hidden', borderRadius: 12 }}>
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: 210 / scale,
          height: (width * 1.414) / scale,
        }}
      >
        <ResumeRenderer resume={resume} templateId={templateId} accentColor={accent} fontFamily="inter" />
      </div>
    </div>
  );
}
