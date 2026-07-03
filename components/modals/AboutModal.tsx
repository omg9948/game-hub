'use client';

import { useState, useEffect } from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: string;
  isAdmin?: boolean;
  onUpdate?: (content: string) => void;
}

const DEFAULT_ABOUT = `<p><strong style="color: var(--text)">Game Hub</strong> เป็นเว็บไซต์สำหรับรวบรวมลิงก์เกมต่างๆ ที่ทีมของเราสร้างขึ้น</p>
<p><strong style="color: var(--text)">ฟีเจอร์หลัก:</strong></p>
<ul style="margin-left: 1.5rem; margin-bottom: 1rem">
  <li>ระบบจัดหมวดหมู่เกม</li>
  <li>ค้นหาเกมได้ง่าย</li>
  <li>ระบบแอดมินสำหรับจัดการข้อมูล</li>
  <li>ข้อมูลจัดเก็บบน Cloud (ทุกคนเห็นเหมือนกัน)</li>
  <li>รองรับทุกอุปกรณ์</li>
</ul>
<p><strong style="color: var(--text)">เวอร์ชัน:</strong> 3.0</p>
<p><strong style="color: var(--text)">สร้างโดย:</strong> ทีม Game Dev ของเรา</p>`;

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
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              รองรับ HTML tags: &lt;p&gt;, &lt;strong&gt;, &lt;img src=&quot;url&quot;&gt;, &lt;a href=&quot;url&quot;&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;br&gt;
            </p>
            <textarea
              className="form-textarea"
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              rows={12}
              placeholder="พิมพ์ข้อความเกี่ยวกับเรา... รองรับ HTML"
            />
          </div>
        ) : (
          <div 
            className="about-content"
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />
        )}
      </div>
    </div>
  );
}