'use client';

import { useState } from 'react';
import { Game } from '@/types';
import { useLanguage } from './LanguageContext';
import FormattedText from './FormattedText';

interface GameCardProps {
  game: Game;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetail: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export default function GameCard({ 
  game, 
  isAdmin, 
  onEdit, 
  onDelete, 
  onViewDetail,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}: GameCardProps) {
  const { t } = useLanguage();
  const [imgError, setImgError] = useState(false);

  const desc = game.description || t('game.noDescription');
  const shortDesc = desc.length > 80 ? desc.substring(0, 80) + '...' : desc;

  return (
    <div className="game-card">
      {/* Wrapper รูปภาพ + badge ปักหมุด */}
      <div className="game-image-wrapper">
        {game.image && !imgError ? (
          <img 
            src={game.image} 
            className="game-image" 
            alt={game.title}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="game-image-placeholder">
            <i className={game.icon}></i>
          </div>
        )}
        {game.pinned && (
          <div className="game-pin-badge" title="ปักหมุด">
            <i className="fas fa-thumbtack"></i>
          </div>
        )}
      </div>

      <div className="game-content">
        <div className="game-header">
          <div className="game-icon"><i className={game.icon}></i></div>
          <span className="game-category-badge">{game.category}</span>
        </div>
        <h3 className="game-title">{game.title}</h3>
        <p className="game-desc collapsed">
          <FormattedText text={shortDesc} />
        </p>

        <button className="read-more-btn" onClick={onViewDetail}>
          <i className="fas fa-expand-alt"></i> {t('game.viewMore')}
        </button>

        <a href={game.link} className="game-link" target="_blank" rel="noopener noreferrer">
          <i className="fas fa-download"></i>
          <span>{t('game.download')}</span>
        </a>

        {isAdmin && (
          <div className="admin-controls">
            {onMoveUp && (
              <button 
                className="admin-btn-small move-up" 
                onClick={onMoveUp}
                disabled={!canMoveUp}
                title="เลื่อนขึ้น"
              >
                <i className="fas fa-arrow-up"></i>
              </button>
            )}
            {onMoveDown && (
              <button 
                className="admin-btn-small move-down" 
                onClick={onMoveDown}
                disabled={!canMoveDown}
                title="เลื่อนลง"
              >
                <i className="fas fa-arrow-down"></i>
              </button>
            )}
            <button className="admin-btn-small" onClick={onEdit}>
              <i className="fas fa-edit"></i> {t('game.edit')}
            </button>
            <button className="admin-btn-small delete" onClick={onDelete}>
              <i className="fas fa-trash"></i> {t('game.delete')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
