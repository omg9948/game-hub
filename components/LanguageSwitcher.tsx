'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { Language } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'th', label: 'TH', flag: '🇹🇭' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
  ];

  const current = languages.find(l => l.code === lang);

  return (
    <div className="language-switcher" ref={ref}>
      <button 
        className="language-btn" 
        onClick={() => setOpen(!open)}
        title={t('language.title')}
      >
        <span className="language-flag">{current?.flag}</span>
        <span className="language-label">{current?.label}</span>
        <i className={`fas fa-chevron-${open ? 'up' : 'down'}`}></i>
      </button>

      {open && (
        <div className="language-dropdown">
          {languages.map((l) => (
            <button
              key={l.code}
              className={`language-option ${lang === l.code ? 'active' : ''}`}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
            >
              <span className="language-flag">{l.flag}</span>
              <span className="language-label">{l.label}</span>
              {lang === l.code && <i className="fas fa-check"></i>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}