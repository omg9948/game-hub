'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function UpdateModal({ isOpen, onClose, onSubmit }: UpdateModalProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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

          {/* ช่องรายละเอียดใหญ่ขึ้น */}
          <div className="form-group">
            <label className="form-label">{t('modal.updateContent')}</label>
            <textarea 
              className="form-input form-textarea-large" 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              required 
              placeholder={t('modal.updateContent')}
              rows={8}
            />
          </div>

          <button type="submit" className="form-submit"><i className="fas fa-paper-plane"></i> {t('modal.send')}</button>
        </form>
      </div>
    </div>
  );
}