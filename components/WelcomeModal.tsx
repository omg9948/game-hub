'use client';

import { useState, useEffect } from 'react';
import { Update } from '@/types';
import { useLanguage } from './LanguageContext';
import AutoLinkText from './AutoLinkText';

interface WelcomeModalProps {
  updates: Update[];
  onClose: () => void;
}

export default function WelcomeModal({ updates, onClose }: WelcomeModalProps) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const lastSeen = localStorage.getItem('gamehub_last_seen_update');
    const latestUpdate = updates.length > 0 ? updates[updates.length - 1] : null;

    if (latestUpdate) {
      const latestTimestamp = latestUpdate.timestamp.toString();
      if (!lastSeen || lastSeen !== latestTimestamp) {
        setIsVisible(true);
      }
    }
  }, [updates]);

  const handleClose = () => {
    const latestUpdate = updates.length > 0 ? updates[updates.length - 1] : null;
    if (latestUpdate) {
      localStorage.setItem('gamehub_last_seen_update', latestUpdate.timestamp.toString());
    }
    setIsVisible(false);
    onClose();
  };

  if (!isVisible || updates.length === 0) return null;

  const sortedUpdates = [...updates].sort((a, b) => b.timestamp - a.timestamp);
  const latestUpdate = sortedUpdates[0];

  return (
    <div className="modal-overlay active welcome-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal welcome-modal">
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="fas fa-bullhorn"></i> {t('welcome.newUpdate')}
          </h3>
          <button className="modal-close" onClick={handleClose}>&times;</button>
        </div>

        <div className="welcome-content">
          <div className="welcome-latest">
            <span className="welcome-badge">{t('welcome.latest')}</span>
            <h4 className="welcome-title">{latestUpdate.title}</h4>
            <span className="welcome-date">
              <i className="fas fa-calendar"></i> {latestUpdate.date}
            </span>
            <pre className="welcome-text">
              <AutoLinkText text={latestUpdate.content} />
            </pre>
          </div>

          {sortedUpdates.length > 1 && (
            <div className="welcome-history">
              <h5 className="welcome-history-title">
                <i className="fas fa-history"></i> {t('welcome.prevUpdates')}
              </h5>
              <div className="welcome-history-list">
                {sortedUpdates.slice(1).map(update => (
                  <div key={update.id} className="welcome-history-item">
                    <span className="welcome-history-title-text">{update.title}</span>
                    <span className="welcome-history-date">{update.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="welcome-footer">
          <button className="welcome-close-btn" onClick={handleClose}>
            <i className="fas fa-check"></i> {t('welcome.understood')}
          </button>
        </div>
      </div>
    </div>
  );
}