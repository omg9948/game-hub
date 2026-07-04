'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import AutoLinkText from './AutoLinkText';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: string;
  isAdmin: boolean;
  onUpdate: (content: string) => void;
}

export default function AboutModal({ isOpen, onClose, content, isAdmin, onUpdate }: AboutModalProps) {
  const { t } = useLanguage();
  const [editContent, setEditContent] = useState(content || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditContent(content || '');
  }, [content, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal wide">
        <div className="modal-header">
          <h3 className="modal-title"><i className="fas fa-info-circle"></i> {t('modal.about')}</h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {isAdmin && !isEditing && (
              <button className="admin-btn-small" onClick={() => setIsEditing(true)}>
                <i className="fas fa-edit"></i> {t('game.edit')}
              </button>
            )}
            <button className="modal-close" onClick={onClose}>&times;</button>
          </div>
        </div>

        <div className="about-content">
          {isEditing ? (
            <div className="about-edit">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <i className="fas fa-info-circle"></i> {t('modal.aboutHint')} <strong>**{t('modal.bold')}**</strong> <em>*{t('modal.italic')}*</em> - {t('modal.list')} {t('modal.autoLink')}
              </p>
              <textarea
                className="form-input form-textarea-large"
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                rows={10}
                placeholder={t('modal.about')}
              />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button className="form-submit" onClick={() => { onUpdate(editContent); setIsEditing(false); }}>
                  <i className="fas fa-save"></i> {t('modal.save')}
                </button>
                <button className="form-submit danger" onClick={() => { setEditContent(content || ''); setIsEditing(false); }}>
                  <i className="fas fa-times"></i> {t('tutorial.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <div className="about-text">
              {content ? (
                <pre className="description-text">
                  <AutoLinkText text={content} />
                </pre>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-pen"></i>
                  <h3>{t('modal.about')}</h3>
                  <p>{t('modal.aboutHint')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}