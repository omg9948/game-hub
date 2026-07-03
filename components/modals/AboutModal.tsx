'use client';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">เกี่ยวกับ Game Hub</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div style={{ lineHeight: 1.8, color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '1rem' }}><strong style={{ color: 'var(--text)' }}>Game Hub</strong> เป็นเว็บไซต์สำหรับรวบรวมลิงก์เกมต่างๆ ที่ทีมของเราสร้างขึ้น</p>
          <p style={{ marginBottom: '1rem' }}><strong style={{ color: 'var(--text)' }}>ฟีเจอร์หลัก:</strong></p>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>ระบบจัดหมวดหมู่เกม</li>
            <li>ค้นหาเกมได้ง่าย</li>
            <li>ระบบแอดมินสำหรับจัดการข้อมูล</li>
            <li>ข้อมูลจัดเก็บบน Cloud (ทุกคนเห็นเหมือนกัน)</li>
            <li>รองรับทุกอุปกรณ์</li>
          </ul>
          <p><strong style={{ color: 'var(--text)' }}>เวอร์ชัน:</strong> 3.0</p>
          <p><strong style={{ color: 'var(--text)' }}>สร้างโดย:</strong> ทีม Game Dev ของเรา</p>
        </div>
      </div>
    </div>
  );
}
