'use client';

import { Tutorial } from '@/types';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorials: Tutorial[];
  isAdmin: boolean;
  onEdit: () => void;
}

// ดึง YouTube Video ID จาก URL
function getYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// ดึง thumbnail จาก YouTube
function getYoutubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

export default function TutorialModal({ isOpen, onClose, tutorials, isAdmin, onEdit }: TutorialModalProps) {
  if (!isOpen) return null;

  const sortedTutorials = [...tutorials].sort((a, b) => a.order - b.order);

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal wide tutorial-modal">
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="fas fa-graduation-cap"></i> วิธีการใช้งาน
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {isAdmin && (
              <button className="admin-btn-small" onClick={onEdit}>
                <i className="fas fa-edit"></i> จัดการวิดีโอ
              </button>
            )}
            <button className="modal-close" onClick={onClose}>&times;</button>
          </div>
        </div>

        <div className="tutorial-content">
          {sortedTutorials.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-video-slash"></i>
              <h3>ยังไม่มีวิดีโอสอนใช้งาน</h3>
              <p>แอดมินสามารถเพิ่มวิดีโอได้</p>
            </div>
          ) : (
            <div className="tutorial-grid">
              {sortedTutorials.map((tutorial, index) => {
                const videoId = getYoutubeId(tutorial.youtubeUrl);
                const thumbnail = videoId ? getYoutubeThumbnail(videoId) : '';

                return (
                  <a
                    key={tutorial.id}
                    href={tutorial.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tutorial-card"
                  >
                    <div className="tutorial-thumbnail">
                      {thumbnail ? (
                        <>
                          <img src={thumbnail} alt={tutorial.title} loading="lazy" />
                          <div className="tutorial-play-overlay">
                            <i className="fas fa-play-circle"></i>
                          </div>
                          <div className="tutorial-number">{index + 1}</div>
                        </>
                      ) : (
                        <div className="tutorial-no-thumb">
                          <i className="fas fa-video"></i>
                        </div>
                      )}
                    </div>
                    <div className="tutorial-info">
                      <h4 className="tutorial-title">{tutorial.title}</h4>
                      {tutorial.description && (
                        <p className="tutorial-desc">{tutorial.description}</p>
                      )}
                      <div className="tutorial-link">
                        <i className="fab fa-youtube"></i>
                        <span>ดูวิดีโอใน YouTube</span>
                        <i className="fas fa-external-link-alt"></i>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
