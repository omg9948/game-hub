'use client';

import { useState, useEffect } from 'react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; icon: string }) => void;
}

export default function CategoryModal({ isOpen, onClose, onSubmit }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🎮');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setIcon('🎮');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), icon: icon.trim() || '🎮' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">เพิ่มหมวดหมู่ใหม่</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">ชื่อหมวดหมู่ *</label>
            <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="ชื่อหมวดหมู่..." required />
          </div>
          <div className="form-group">
            <label className="form-label">ไอคอน Emoji</label>
            <input type="text" className="form-input" value={icon} onChange={e => setIcon(e.target.value)} placeholder="🎮" />
          </div>
          <button type="submit" className="form-submit">
            <i className="fas fa-plus"></i> เพิ่มหมวดหมู่
          </button>
        </form>
      </div>
    </div>
  );
}
