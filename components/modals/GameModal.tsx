'use client';

import { useState, useEffect } from 'react';
import { Game, Category } from '@/types';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  categories: Category[];
  onSubmit: (data: any) => void;
}

export default function GameModal({ isOpen, onClose, game, categories, onSubmit }: GameModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('fas fa-gamepad');

  useEffect(() => {
    if (isOpen) {
      if (game) {
        setTitle(game.title);
        setCategory(game.category);
        setImage(game.image || '');
        setLink(game.link);
        setDescription(game.description || '');
        setIcon(game.icon);
      } else {
        setTitle('');
        setCategory('');
        setImage('');
        setLink('');
        setDescription('');
        setIcon('fas fa-gamepad');
      }
    }
  }, [isOpen, game]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: game?.id,
      title: title.trim(),
      category,
      image: image.trim(),
      link: link.trim(),
      description: description.trim(),
      icon: icon.trim() || 'fas fa-gamepad'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal wide">
        <div className="modal-header">
          <h3 className="modal-title">{game ? 'แก้ไขเกม' : 'เพิ่มเกมใหม่'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">ชื่อเกม *</label>
            <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="ชื่อเกม..." required />
          </div>
          <div className="form-group">
            <label className="form-label">หมวดหมู่ *</label>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)} required>
              <option value="">เลือกหมวดหมู่...</option>
              {categories.map(c => (
                <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">ลิงก์รูปภาพตัวอย่างเกม (URL)</label>
            <input type="url" className="form-input" value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/image.jpg" />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>วางลิงก์รูปภาพจากที่ไหนก็ได้ (Imgur, Google Drive, ฯลฯ)</p>
          </div>
          <div className="form-group">
            <label className="form-label">ลิงก์ไฟล์เกม *</label>
            <input type="url" className="form-input" value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." required />
          </div>
          <div className="form-group">
            <label className="form-label">คำอธิบาย</label>
            <textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="คำอธิบายเกม..." />
          </div>
          <div className="form-group">
            <label className="form-label">ไอคอน (Font Awesome class)</label>
            <input type="text" className="form-input" value={icon} onChange={e => setIcon(e.target.value)} placeholder="fas fa-gamepad" />
          </div>
          <button type="submit" className="form-submit">
            <i className={game ? 'fas fa-save' : 'fas fa-plus'}></i> {game ? 'บันทึกการแก้ไข' : 'เพิ่มเกม'}
          </button>
        </form>
      </div>
    </div>
  );
}
