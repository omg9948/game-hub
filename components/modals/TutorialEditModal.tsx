'use client';

import { useState, useEffect } from 'react';
import { Tutorial } from '@/types';

interface TutorialEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorials: Tutorial[];
  onSave: (tutorials: Tutorial[]) => void;
}

export default function TutorialEditModal({ isOpen, onClose, tutorials, onSave }: TutorialEditModalProps) {
  const [items, setItems] = useState<Tutorial[]>([]);

  useEffect(() => {
    if (isOpen) {
      const sorted = [...tutorials].sort((a, b) => a.order - b.order);
      // ถ้ามีน้อยกว่า 8 อัน เติมช่องว่าง
      const filled = [...sorted];
      while (filled.length < 8) {
        filled.push({
          id: `temp_${filled.length}`,
          title: '',
          youtubeUrl: '',
          description: '',
          order: filled.length
        });
      }
      setItems(filled.slice(0, 8));
    }
  }, [isOpen, tutorials]);

  const updateItem = (index: number, field: keyof Tutorial, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSave = () => {
    const validItems = items
      .filter(item => item.title.trim() && item.youtubeUrl.trim())
      .map((item, idx) => ({
        ...item,
        id: item.id.startsWith('temp_') ? `tutorial_${Date.now()}_${idx}` : item.id,
        order: idx
      }));
    onSave(validItems);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setItems(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setItems(newItems);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal wide tutorial-edit-modal">
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="fas fa-cog"></i> จัดการวิดีโอสอนใช้งาน
          </h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="tutorial-edit-content">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <i className="fas fa-info-circle"></i> ใส่ลิงก์ YouTube และชื่อวิดีโอ (สูงสุด 8 คลิป)
          </p>

          {items.map((item, index) => (
            <div key={index} className={`tutorial-edit-item ${item.title.trim() && item.youtubeUrl.trim() ? 'filled' : ''}`}>
              <div className="tutorial-edit-number">{index + 1}</div>
              <div className="tutorial-edit-fields">
                <input
                  type="text"
                  className="form-input"
                  placeholder="ชื่อวิดีโอ..."
                  value={item.title}
                  onChange={e => updateItem(index, 'title', e.target.value)}
                />
                <input
                  type="url"
                  className="form-input"
                  placeholder="ลิงก์ YouTube..."
                  value={item.youtubeUrl}
                  onChange={e => updateItem(index, 'youtubeUrl', e.target.value)}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="คำอธิบายสั้นๆ (ไม่บังคับ)..."
                  value={item.description}
                  onChange={e => updateItem(index, 'description', e.target.value)}
                />
              </div>
              <div className="tutorial-edit-actions">
                <button type="button" className="tutorial-move-btn" onClick={() => handleMoveUp(index)} disabled={index === 0}>
                  <i className="fas fa-arrow-up"></i>
                </button>
                <button type="button" className="tutorial-move-btn" onClick={() => handleMoveDown(index)} disabled={index === items.length - 1}>
                  <i className="fas fa-arrow-down"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button className="form-submit" onClick={handleSave}>
            <i className="fas fa-save"></i> บันทึก
          </button>
          <button className="form-submit danger" onClick={onClose}>
            <i className="fas fa-times"></i> ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}
