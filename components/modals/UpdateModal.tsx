'use client';

import { useState, useEffect } from 'react';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; date: string }) => void;
}

export default function UpdateModal({ isOpen, onClose, onSubmit }: UpdateModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setContent('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString().split('T')[0]
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal wide">
        <div className="modal-header">
          <h3 className="modal-title">เขียนอัปเดตใหม่</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">หัวข้ออัปเดต *</label>
            <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="หัวข้ออัปเดต..." required />
          </div>
          <div className="form-group">
            <label className="form-label">รายละเอียด *</label>
            <textarea className="form-textarea" value={content} onChange={e => setContent(e.target.value)} placeholder="รายละเอียดอัปเดต..." style={{ minHeight: '150px' }} required />
          </div>
          <button type="submit" className="form-submit">
            <i className="fas fa-paper-plane"></i> ส่งอัปเดต
          </button>
        </form>
      </div>
    </div>
  );
}
