'use client';

import { useState } from 'react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: string) => void;
}

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [data, setData] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">นำเข้าข้อมูล</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="form-group">
          <label className="form-label">วางข้อมูล JSON ที่สำรองไว้</label>
          <textarea 
            className="form-textarea" 
            value={data}
            onChange={e => setData(e.target.value)}
            placeholder="วางข้อมูลที่นี่..." 
            style={{ minHeight: '150px' }}
          />
        </div>
        <button className="form-submit" onClick={() => { onImport(data); setData(''); }}>
          <i className="fas fa-upload"></i> นำเข้าข้อมูล
        </button>
      </div>
    </div>
  );
}
