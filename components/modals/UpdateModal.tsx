'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import TextToolbar from '@/components/TextToolbar';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function UpdateModal({ isOpen, onClose, onSubmit }: UpdateModalProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setContent('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, date: new Date().toISOString().split('T')[0] });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title"><i className="fas fa-bullhorn"></i> {t('modal.writeUpdate')}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">{t('modal.updateTitle')}</label>
            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          {/* ช่องรายละเอียดใหญ่ขึ้น + TextToolbar */}
          <div className="form-group">
            <label className="form-label">{t('modal.updateContent')}</label>
            <div className="textarea-with-toolbar">
              <textarea 
                ref={contentRef}
                className="form-input form-textarea-large" 
                value={content} 
                onChange={e => setContent(e.target.value)} 
                required 
                placeholder={t('modal.updateContent')}
                rows={8}
              />
              <TextToolbar 
                textareaRef={contentRef} 
                value={content}
                onChange={setContent}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              <i className="fas fa-mouse-pointer"></i> ลากคลุมข้อความเพื่อตั้งค่า Bold, Italic, Underline, Strikethrough, Quote, Code, Spoiler
            </p>
          </div>

          <button type="submit" className="form-submit"><i className="fas fa-paper-plane"></i> {t('modal.send')}</button>
        </form>
      </div>
    </div>
  );
}
