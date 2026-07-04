'use client';

import { Tutorial } from '@/types';
import { useLanguage } from '../LanguageContext';

interface TutorialDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorial: Tutorial | null;
}

// ฟังก์ชันแปลงข้อความให้มีลิงก์อัตโนมัติ
function AutoLinkText({ text }: { text: string }) {
  // แยกบรรทัด
  const lines = text.split(/\r?\n/);

  return (
    <pre className="description-text">
      {lines.map((line, lineIndex) => {
        // ตรวจหาลิงก์ในข้อความแต่ละบรรทัด
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = line.split(urlRegex);

        return (
          <span key={lineIndex}>
            {parts.map((part, partIndex) => {
              // ตรวจสอบว่าส่วนนี้เป็น URL หรือไม่
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
              // ถ้าไม่ใช่ URL → แสดงเป็นข้อความธรรมดา
              return <span key={partIndex}>{part}</span>;
            })}
            {lineIndex < lines.length - 1 ? '\n' : null}
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
          <div className="tutorial-detail-info">
            {tutorial.description && (
              <div className="tutorial-detail-description">
                <h5><i className="fas fa-align-left"></i> {t('game.description')}</h5>
                <AutoLinkText text={tutorial.description} />
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