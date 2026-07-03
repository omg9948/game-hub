'use client';

import { useState } from 'react';
import { Game } from '@/types';

interface GameDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
}

export default function GameDetailModal({ isOpen, onClose, game }: GameDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  if (!isOpen || !game) return null;

  // รวมรูปหลัก + รูปเพิ่มเติม
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
          {/* รูปภาพ Gallery */}
          {allImages.length > 0 && (
            <div className="image-gallery">
              <div className="main-image">
                {!imgError[currentImageIndex] ? (
                  <img 
                    src={allImages[currentImageIndex]} 
                    alt={`${game.title} - รูปที่ ${currentImageIndex + 1}`}
                    onError={() => handleImageError(currentImageIndex)}
                  />
                ) : (
                  <div className="image-error">
                    <i className={game.icon}></i>
                    <span>ไม่สามารถโหลดรูปภาพได้</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
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

          {/* ข้อมูลเกม */}
          <div className="game-info-section">
            <div className="game-info-header">
              <span className="game-category-badge">{game.category}</span>
              <span className="game-date">
                <i className="fas fa-calendar"></i> {new Date(game.date).toLocaleDateString('th-TH')}
              </span>
            </div>

            {/* คำอธิบาย - แสดงตามที่ Admin พิมพ์เป๊ะๆ */}
            <div className="game-description">
              <h4><i className="fas fa-align-left"></i> คำอธิบาย</h4>
              <pre className="description-text">{game.description || 'ไม่มีคำอธิบาย'}</pre>
            </div>

            {/* ลิงก์ดาวน์โหลด */}
            <a href={game.link} className="game-link download-btn" target="_blank" rel="noopener noreferrer">
              <i className="fas fa-download"></i>
              <span>ดาวน์โหลดเกม</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
