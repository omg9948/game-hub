'use client';

import { Tutorial } from '@/types';

interface TutorialDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorial: Tutorial | null;
}

export default function TutorialDetailModal({ isOpen, onClose, tutorial }: TutorialDetailModalProps) {
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
          {/* ข้อมูลเพิ่มเติม - แสดงคำอธิบายเท่านั้น */}
          <div className="tutorial-detail-info">
            <h4 className="tutorial-detail-title">{tutorial.title}</h4>

            {tutorial.description && (
              <div className="tutorial-detail-description">
                <h5><i className="fas fa-align-left"></i> คำอธิบาย</h5>
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