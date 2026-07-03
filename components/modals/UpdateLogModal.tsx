'use client';

import { Update } from '@/types';
import { formatDate } from '@/lib/utils';

interface UpdateLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  updates: Update[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

export default function UpdateLogModal({ isOpen, onClose, updates, isAdmin, onDelete }: UpdateLogModalProps) {
  if (!isOpen) return null;

  const sorted = [...updates].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal wide">
        <div className="modal-header">
          <h3 className="modal-title">ประวัติการอัปเดต</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {sorted.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
              <p>ไม่มีประวัติการอัปเดต</p>
            </div>
          ) : (
            sorted.map(u => (
              <div key={u.id} className="update-log-item">
                {isAdmin && (
                  <button className="update-log-delete" onClick={() => onDelete(u.id)} title="ลบอัปเดตนี้">
                    <i className="fas fa-trash"></i>
                  </button>
                )}
                <div className="update-log-header">
                  <span className="update-log-version">{u.title}</span>
                  <span className="update-log-date">{formatDate(u.date)}</span>
                </div>
                <div className="update-log-content">{u.content}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
