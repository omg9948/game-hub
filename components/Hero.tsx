'use client';

import { SiteSettings } from '@/types';

interface HeroProps {
  settings: SiteSettings;
  isAdmin: boolean;
  onUpdate: (settings: SiteSettings) => void;
}

export default function Hero({ settings, isAdmin, onUpdate }: HeroProps) {
  return (
    <section className="hero">
      <h1 
        contentEditable={isAdmin}
        suppressContentEditableWarning
        onBlur={(e) => {
          if (isAdmin) {
            onUpdate({ ...settings, heroTitle: e.currentTarget.textContent || '' });
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLElement).blur(); }
        }}
      >
        {settings.heroTitle}
      </h1>
      <p 
        contentEditable={isAdmin}
        suppressContentEditableWarning
        onBlur={(e) => {
          if (isAdmin) {
            onUpdate({ ...settings, heroDesc: e.currentTarget.textContent || '' });
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); (e.target as HTMLElement).blur(); }
        }}
      >
        {settings.heroDesc}
      </p>
      {isAdmin && <div className="hero-edit-hint">แอดมินสามารถคลิกที่ข้อความเพื่อแก้ไขได้</div>}
    </section>
  );
}
