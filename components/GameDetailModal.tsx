'use client';

import { useState } from 'react';
import { Game } from '@/types';
import { useLanguage } from './LanguageContext';
import AutoLinkText from './AutoLinkText';

interface GameDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
}

export default function GameDetailModal({ isOpen, onClose, game }: GameDetailModalProps) {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  if (!isOpen || !game) return null;

  const allImages = [
    ...(game.image ? [game.image] : []),
    ...(game.images || [])
  ].filter(Boolean);

  const handleImageError = (index: number) => {
    setImgError(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal game-detail-modal">
        <div className="modal-header">
          <h3 className="modal-title"><i className={game.icon}></i> {game.title}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="game-detail-content">
          {allImages.length > 0 && (
            <div className="image-gallery">
              <div className="main-image">
                {!imgError[currentImageIndex] ? (
                  <img 
                    src={allImages[currentImageIndex]} 
                    alt={`${game.title} - ${t('game.description')} ${currentImageIndex + 1}`}
                    onError={() => handleImageError(currentImageIndex)}
                  />
                ) : (
                  <div className="image-error">
                    <i className={game.icon}></i>
                    <span>{t('toast.error')}</span>
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="image-thumbnails">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(idx)}
                    >
                      <img src={img} alt={`thumbnail ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="game-info-section">
            <div className="game-info-header">
              <span className="game-category-badge">{game.category}</span>
              <span className="game-date">
                <i className="fas fa-calendar"></i> {game.date ? new Date(game.date).toLocaleDateString('th-TH') : '-'}
              </span>
            </div>

            <div className="game-description">
              <h4><i className="fas fa-align-left"></i> {t('game.description')}</h4>
              <pre className="description-text">
                <AutoLinkText text={game.description || t('game.noDescription')} />
              </pre>
            </div>

            <a href={game.link} className="game-link download-btn" target="_blank" rel="noopener noreferrer">
              <i className="fas fa-download"></i>
              <span>{t('game.downloadBtn')}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}