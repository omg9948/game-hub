'use client';

import { useState, useEffect, useRef } from 'react';
import { Tutorial } from '@/types';
import { useLanguage } from '@/components/LanguageContext';
import TextToolbar from '@/components/TextToolbar';

interface TutorialEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorials: Tutorial[];
  onSave: (tutorials: Tutorial[]) => void;
}

export default function TutorialEditModal({ isOpen, onClose, tutorials, onSave }: TutorialEditModalProps) {
  const { t } = useLanguage();
  const [items, setItems] = useState<Tutorial[]>([]);
  // เก็บ refs สำหรับ textarea แต่ละรายการ
  const descRefs = useRef<Map<string, React.RefObject<HTMLTextAreaElement | null>>>(new Map());

  useEffect(() => {
    if (isOpen) {
      const sorted = [...tutorials].sort((a, b) => (a.order || 0) - (b.order || 0));
      setItems(sorted);
    }
  }, [isOpen, tutorials]);

  // สร้าง ref สำหรับ textarea แต่ละรายการ
  const getDescRef = (id: string): React.RefObject<HTMLTextAreaElement | null> => {
    if (!descRefs.current.has(id)) {
      descRefs.current.set(id, { current: null });
    }
    return descRefs.current.get(id)!;
  };

  const updateItem = (index: number, field: keyof Tutorial, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleAddNew = () => {
    const newId = `temp_${Date.now()}_${items.length}`;
    const newItem: Tutorial = {
      id: newId,
      title: '',
      youtubeUrl: '',
      description: '',
      order: items.length
    };
    // สร้าง ref สำหรับรายการใหม่
    descRefs.current.set(newId, { current: null });
    setItems([...items, newItem]);
  };

  const handleRemove = (index: number) => {
    const removedItem = items[index];
    const newItems = items.filter((_, i) => i !== index);
    // ลบ ref ที่ไม่ใช้แล้ว
    descRefs.current.delete(removedItem.id);
    setItems(newItems.map((item, idx) => ({ ...item, order: idx })));
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setItems(newItems.map((item, idx) => ({ ...item, order: idx })));
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal wide tutorial-edit-modal">
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="fas fa-cog"></i> {t('tutorial.editTitle')}
          </h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="tutorial-edit-content">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <i className="fas fa-info-circle"></i> {t('tutorial.addNew')}
          </p>

          {items.map((item, index) => {
            const descRef = getDescRef(item.id);
            return (
              <div key={item.id} className={`tutorial-edit-item ${item.title.trim() && item.youtubeUrl.trim() ? 'filled' : ''}`}>
                <div className="tutorial-edit-number">{index + 1}</div>
                <div className="tutorial-edit-fields">
                  <input
                    type="text"
                    className="form-input form-input-large"
                    placeholder={t('tutorial.placeholder.title')}
                    value={item.title}
                    onChange={e => updateItem(index, 'title', e.target.value)}
                  />
                  <input
                    type="url"
                    className="form-input form-input-large"
                    placeholder={t('tutorial.placeholder.url')}
                    value={item.youtubeUrl}
                    onChange={e => updateItem(index, 'youtubeUrl', e.target.value)}
                  />
                  <div className="textarea-with-toolbar">
                    <textarea
                      ref={descRef as any}
                      className="form-input form-textarea-large"
                      placeholder={t('tutorial.placeholder.desc')}
                      value={item.description}
                      onChange={e => updateItem(index, 'description', e.target.value)}
                      rows={4}
                    />
                    <TextToolbar
                      textareaRef={descRef}
                      value={item.description || ''}
                      onChange={(newValue) => updateItem(index, 'description', newValue)}
                    />
                  </div>
                </div>
                <div className="tutorial-edit-actions">
                  <button type="button" className="tutorial-move-btn" onClick={() => handleMove(index, -1)} disabled={index === 0}>
                    <i className="fas fa-arrow-up"></i>
                  </button>
                  <button type="button" className="tutorial-move-btn" onClick={() => handleMove(index, 1)} disabled={index === items.length - 1}>
                    <i className="fas fa-arrow-down"></i>
                  </button>
                  <button type="button" className="tutorial-move-btn delete" onClick={() => handleRemove(index)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            );
          })}

          <button type="button" className="tutorial-add-btn" onClick={handleAddNew}>
            <i className="fas fa-plus-circle"></i>
            <span>{t('tutorial.addNew')}</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button className="form-submit" onClick={handleSave}>
            <i className="fas fa-save"></i> {t('tutorial.save')}
          </button>
          <button className="form-submit danger" onClick={onClose}>
            <i className="fas fa-times"></i> {t('tutorial.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}