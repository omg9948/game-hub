'use client';

import { useState } from 'react';
import { Game } from '@/types';

interface GameCardProps {
  game: Game;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function GameCard({ game, isAdmin, onEdit, onDelete }: GameCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const desc = game.description || 'ไม่มีคำอธิบาย';
  const isLong = desc.length > 100;

  return (
    <div className="game-card">
      {game.image && !imgError ? (
        <>
          <img 
            src={game.image} 
            className="game-image" 
            alt={game.title}
            onError={() => setImgError(true)}
          />
          <div className="game-image-placeholder" style={{ display: 'none' }}>
            <i className={game.icon}></i>
          </div>
        </>
      ) : (
        <div className="game-image-placeholder">
          <i className={game.icon}></i>
        </div>
      )}

      <div className="game-content">
        <div className="game-header">
          <div className="game-icon"><i className={game.icon}></i></div>
          <span className="game-category-badge">{game.category}</span>
        </div>
        <h3 className="game-title">{game.title}</h3>
        <p className={`game-desc ${isLong && !expanded ? 'collapsed' : ''}`}>{desc}</p>
        {isLong && (
          <button className="read-more-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'ซ่อนน้อย ' : 'ดูเพิ่มเติม '}
            <i className={`fas fa-chevron-${expanded ? 'up' : 'down'}`}></i>
          </button>
        )}
        <a href={game.link} className="game-link" target="_blank" rel="noopener noreferrer">
          <i className="fas fa-download"></i>
          <span>ดาวน์โหลดเกม</span>
        </a>
        {isAdmin && (
          <div className="admin-controls">
            <button className="admin-btn-small" onClick={onEdit}>
              <i className="fas fa-edit"></i> แก้ไข
            </button>
            <button className="admin-btn-small delete" onClick={onDelete}>
              <i className="fas fa-trash"></i> ลบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
