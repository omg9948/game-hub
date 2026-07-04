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
function getYoutubeThumbnail(videoId: string, quality: 'maxres' | 'sd' | 'mq' = 'sd'): string {
  const qualities = {
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
  };
  return qualities[quality];
}

export default function TutorialDetailModal({ isOpen, onClose, tutorial }: TutorialDetailModalProps) {
  if (!isOpen || !tutorial) return null;

  const videoId = getYoutubeId(tutorial.youtubeUrl);
  const thumbnail = videoId ? getYoutubeThumbnail(videoId, 'sd') : '';
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

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
          {/* รูป thumbnail ใหญ่ */}
          {thumbnail && (
            <div className="tutorial-detail-thumbnail">
              <a href={tutorial.youtubeUrl} target="_blank" rel="noopener noreferrer">
                <img src={thumbnail} alt={tutorial.title} />
                <div className="tutorial-play-overlay large">
                  <i className="fas fa-play-circle"></i>
                  <span>คลิกเพื่อดูใน YouTube</span>
                </div>
              </a>
            </div>
          )}

          {/* ข้อมูลวิดีโอ */}
          <div className="tutorial-detail-info">
            <h4 className="tutorial-detail-title">{tutorial.title}</h4>
            
            {tutorial.description && (
              <div className="tutorial-detail-description">
                <h5><i className="fas fa-align-left"></i> คำอธิบาย</h5>
                <pre className="description-text">{tutorial.description}</pre>
              </div>
            )}

            {/* ลิงก์ไป YouTube */}
            <a 
              href={tutorial.youtubeUrl} 
              className="game-link download-btn youtube-btn" 
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