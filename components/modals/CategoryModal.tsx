'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; icon: string }) => void;
}

export default function CategoryModal({ isOpen, onClose, onSubmit }: CategoryModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🎮');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setIcon('🎮');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), icon: icon.trim() || '🎮' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{t('modal.addCategory')}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('modal.categoryName')} *</label>
            <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder={t('modal.categoryName') + '...'} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('modal.iconEmoji')}</label>
            <input type="text" className="form-input" value={icon} onChange={e => setIcon(e.target.value)} placeholder="🎮" />
          </div>
          <button type="submit" className="form-submit">
            <i className="fas fa-plus"></i> {t('modal.add')}
          </button>
        </form>
      </div>
    </div>
  );
}