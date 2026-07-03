'use client';

import { useState, useEffect } from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: string;
  isAdmin?: boolean;
  onUpdate?: (content: string) => void;
}

const DEFAULT_ABOUT = `Game Hub เป็นเว็บไซต์สำหรับรวบรวมลิงก์เกมต่างๆ ที่ทีมของเราสร้างขึ้น

ฟีเจอร์หลัก:
- ระบบจัดหมวดหมู่เกม
- ค้นหาเกมได้ง่าย
- ระบบแอดมินสำหรับจัดการข้อมูล
- ข้อมูลจัดเก็บบน Cloud (ทุกคนเห็นเหมือนกัน)
- รองรับทุกอุปกรณ์

เวอร์ชัน: 3.0
สร้างโดย: ทีม Game Dev ของเรา`;

// แปลงข้อความธรรมดาเป็น HTML อัตโนมัติ
function textToHtml(text: string): string {
  if (!text) return '';

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // แปลง URL เป็นลิงก์อัตโนมัติ
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
    // แปลง **ข้อความ** เป็นตัวหนา
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // แปลง *ข้อความ* เป็นตัวเอียง
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // แปลง - เป็น li
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // แปลง 1. เป็น li
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // แปลงขึ้นบรรทัดใหม่เป็น <br>
    .replace(/\n/g, '<br>');
}

export default function AboutModal({ isOpen, onClose, content, isAdmin, onUpdate }: AboutModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  const displayContent = content || DEFAULT_ABOUT;

  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
      setEditContent(displayContent);
    }
  }, [isOpen, displayContent]);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editContent);
    }
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal about-modal">
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="fas fa-info-circle"></i> เกี่ยวกับเรา
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {isAdmin && (
              <button 
                className="admin-btn-small" 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                <i className={isEditing ? 'fas fa-save' : 'fas fa-edit'}></i>
                {isEditing ? ' บันทึก' : ' แก้ไข'}
              </button>
            )}
            <button className="modal-close" onClick={onClose}>&times;</button>
          </div>
        </div>

        {isEditing ? (
          <div className="about-edit">
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
              <i className="fas fa-lightbulb"></i> พิมพ์ข้อความธรรมดาได้เลย รองรับ:<br/>
              <strong>**ข้อความ**</strong> = ตัวหนา | <strong>*ข้อความ*</strong> = ตัวเอียง | <strong>- ข้อความ</strong> = รายการ | ลิงก์จะเป็นลิงก์อัตโนมัติ
            </p>
            <textarea
              className="form-textarea about-textarea"
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              rows={15}
              placeholder="พิมพ์ข้อความเกี่ยวกับเรา..."
            />
          </div>
        ) : (
          <div 
            className="about-content"
            dangerouslySetInnerHTML={{ __html: textToHtml(displayContent) }}
          />
        )}
      </div>
    </div>
  );
}