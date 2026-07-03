'use client';

import { useState } from 'react';
import { Update } from '@/types';

interface UpdateLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  updates: Update[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

export default function UpdateLogModal({ isOpen, onClose, updates, isAdmin, onDelete }: UpdateLogModalProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isOpen) return null;

  // เรียงจากใหม่ → เก่า
  const sortedUpdates = [...updates].sort((a, b) => b.timestamp - a.timestamp);

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบอัปเดตนี้?')) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal wide update-log-modal">
        <div className="modal-header">
          <h3 className="modal-title"><i className="fas fa-history"></i> ประวัติการอัปเดต</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="update-log-list">
          {sortedUpdates.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <h3>ยังไม่มีประวัติการอัปเดต</h3>
              <p>อัปเดตใหม่จะปรากฏที่นี่</p>
            </div>
          ) : (
            sortedUpdates.map(update => (
              <div key={update.id} className={`update-log-item ${deletingId === update.id ? 'deleting' : ''}`}>
                <div className="update-log-header">
                  <span className="update-log-version">{update.title}</span>
                  <span className="update-log-date">
                    <i className="fas fa-calendar"></i> {update.date}
                  </span>
                </div>
                <pre className="update-log-content">{update.content}</pre>
                {isAdmin && (
                  <button 
                    className="update-log-delete" 
                    onClick={() => handleDelete(update.id)}
                    disabled={deletingId === update.id}
                  >
                    {deletingId === update.id ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-trash"></i>
                    )}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}