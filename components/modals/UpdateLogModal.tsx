'use client';

import { Update } from '@/types';
import { useLanguage } from '@/components/LanguageContext';
import AutoLinkText from '@/components/AutoLinkText';

interface UpdateLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  updates: Update[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

export default function UpdateLogModal({ isOpen, onClose, updates, isAdmin, onDelete }: UpdateLogModalProps) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const sortedUpdates = [...updates].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal wide">
        <div className="modal-header">
          <h3 className="modal-title"><i className="fas fa-history"></i> {t('modal.updateHistory')}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="update-log-content">
          {sortedUpdates.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <h3>{t('modal.noUpdates')}</h3>
              <p>{t('modal.updatesHere')}</p>
            </div>
          ) : (
            <div className="update-list">
              {sortedUpdates.map(update => (
                <div key={update.id} className="update-item">
                  <div className="update-item-header">
                    <h4 className="update-item-title">{update.title}</h4>
                    <span className="update-item-date">{update.date}</span>
                  </div>
                  <pre className="update-item-content">
                    <AutoLinkText text={update.content} />
                  </pre>
                  {isAdmin && (
                    <button className="admin-btn-small delete" onClick={() => onDelete(update.id)}>
                      <i className="fas fa-trash"></i> {t('update.delete')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}