'use client';

import { Tutorial } from '@/types';

interface TutorialDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorial: Tutorial | null;
}

// ดึง YouTube Video ID จาก URL
function getYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// ดึง thumbnail คุณภาพสูงจาก YouTube
function getYoutubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export default function TutorialDetailModal({ isOpen, onClose, tutorial }: TutorialDetailModalProps) {
  if (!isOpen || !tutorial) return null;

  const videoId = getYoutubeId(tutorial.youtubeUrl);
  const thumbnail = videoId ? getYoutubeThumbnail(videoId) : '';

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
          {/* Thumbnail ใหญ่แบบเต็มความกว้าง + ไอคอน Play ตรงกลาง */}
          {thumbnail && (
            <a 
              href={tutorial.youtubeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="tutorial-detail-thumbnail-link"
            >
              <div className="tutorial-detail-thumbnail">
                <img src={thumbnail} alt={tutorial.title} />
                <div className="tutorial-play-overlay">
                  <i className="fas fa-play-circle"></i>
                  <span className="play-text">ดูวิดีโอใน YouTube</span>
                </div>
              </div>
            </a>
          )}

          {/* ข้อมูลวิดีโอ */}
          <div className="tutorial-detail-info">
            <h4 className="tutorial-detail-title">{tutorial.title}</h4>

            {tutorial.description && (
              <div className="tutorial-detail-description">
                <pre className="description-text">{tutorial.description}</pre>
              </div>
            )}

            {/* ปุ่มดูวิดีโอใน YouTube แบบใหญ่ */}
            <a 
              href={tutorial.youtubeUrl} 
              className="tutorial-youtube-btn" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fab fa-youtube"></i>
              <span>ดูวิดีโอใน YouTube</span>
              <i className="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}