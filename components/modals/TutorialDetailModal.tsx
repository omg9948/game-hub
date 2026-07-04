'use client';

import { Tutorial } from '@/types';
import { useLanguage } from '../LanguageContext';
import AutoLinkText from '../AutoLinkText';

interface TutorialDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorial: Tutorial | null;
}

export default function TutorialDetailModal({ isOpen, onClose, tutorial }: TutorialDetailModalProps) {
  const { t } = useLanguage();

  if (!isOpen || !tutorial) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal tutorial-detail-modal">
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="fab fa-youtube"></i> {tutorial.title}
          </h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="tutorial-detail-content">
          <div className="tutorial-detail-info">
            {tutorial.description && (
              <div className="tutorial-detail-description">
                <h5><i className="fas fa-align-left"></i> {t('game.description')}</h5>
                <pre className="description-text">
                  <AutoLinkText text={tutorial.description} />
                </pre>
              </div>
            )}

            <a 
              href={tutorial.youtubeUrl} 
              className="tutorial-youtube-btn" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fab fa-youtube"></i>
              <span>{t('tutorial.watchOnYoutube')}</span>
              <i className="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}