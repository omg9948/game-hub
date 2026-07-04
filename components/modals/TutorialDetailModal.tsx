'use client';

import { Tutorial } from '@/types';
import { useLanguage } from '../LanguageContext';

interface TutorialDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorial: Tutorial | null;
}

// ฟังก์ชันแปลงข้อความให้มีลิงก์กดได้
function LinkifyText({ text }: { text: string }) {
  // แยกบรรทัด
  const lines = text.split('
');

  return (
    <pre className="description-text">
      {lines.map((line, lineIndex) => {
        // ตรวจสอบว่าบรรทัดนี้เป็นลิงก์ URL เต็มหรือไม่
        const urlRegex = /^(https?:\/\/[^\s]+)$/;
        const match = line.match(urlRegex);

        if (match) {
          // ถ้าเป็นลิงก์เต็มบรรทัด → แสดงเป็นปุ่มลิงก์
          return (
            <span key={lineIndex}>
              <a 
                href={match[1]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="tutorial-link-btn"
              >
                <i className="fas fa-external-link-alt"></i>
                {match[1]}
              </a>
              {'
'}
            </span>
          );
        }

        // ถ้าไม่ใช่ลิงก์เต็มบรรทัด → ตรวจหาลิงก์ในข้อความ
        const parts = line.split(/(https?:\/\/[^\s]+)/g);

        return (
          <span key={lineIndex}>
            {parts.map((part, partIndex) => {
              if (part.match(/^https?:\/\/[^\s]+$/)) {
                return (
                  <a 
                    key={partIndex}
                    href={part} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="tutorial-inline-link"
                  >
                    {part}
                  </a>
                );
              }
              return <span key={partIndex}>{part}</span>;
            })}
            {'
'}
          </span>
        );
      })}
    </pre>
  );
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
          {/* ข้อมูลเพิ่มเติม - แสดงคำอธิบายเท่านั้น (ไม่มีชื่อคลิปซ้ำ) */}
          <div className="tutorial-detail-info">
            {tutorial.description && (
              <div className="tutorial-detail-description">
                <h5><i className="fas fa-align-left"></i> {t('game.description')}</h5>
                <LinkifyText text={tutorial.description} />
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
              <span>{t('tutorial.watchOnYoutube')}</span>
              <i className="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}