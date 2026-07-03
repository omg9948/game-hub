'use client';

import { Category } from '@/types';

interface MenuProps {
  categories: Category[];
  isAdmin: boolean;
  isOpen: boolean;
  onClose: () => void;
  onFilterCategory: (cat: string) => void;
  onLogin: () => void;
  onLogout: () => void;
  onAddGame: () => void;
  onAddCategory: () => void;
  onAddUpdate: () => void;
  onShowUpdates: () => void;
  onShowAbout: () => void;
  onExport: () => void;
  onImport: () => void;
}

export default function Menu({
  categories, isAdmin, isOpen, onClose, onFilterCategory,
  onLogin, onLogout, onAddGame, onAddCategory, onAddUpdate,
  onShowUpdates, onShowAbout, onExport, onImport
}: MenuProps) {
  return (
    <>
      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`hamburger-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h3><i className="fas fa-bars"></i> เมนู</h3>
          <button className="menu-close" onClick={onClose}>&times;</button>
        </div>

        <div className="menu-section">
          <div className="menu-section-title">นำทาง</div>
          <button className="menu-item" onClick={() => { onClose(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
            <i className="fas fa-home"></i> หน้าแรก
          </button>
          <button className="menu-item" onClick={() => { onClose(); document.getElementById('searchInput')?.focus(); }}>
            <i className="fas fa-search"></i> ค้นหาเกม
          </button>
          <button className="menu-item" onClick={() => onFilterCategory('all')}>
            <i className="fas fa-th-large"></i> ดูเกมทั้งหมด
          </button>
        </div>

        <div className="menu-section">
          <div className="menu-section-title">หมวดหมู่</div>
          {categories.map(cat => (
            <button key={cat.name} className="menu-item" onClick={() => onFilterCategory(cat.name)}>
              <i className="fas fa-gamepad"></i> {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="menu-section">
          <div className="menu-section-title">แอดมิน</div>
          {!isAdmin ? (
            <button className="menu-item" onClick={onLogin}>
              <i className="fas fa-shield-alt"></i> เข้าสู่ระบบแอดมิน
            </button>
          ) : (
            <>
              <button className="menu-item admin-only" onClick={onAddGame}>
                <i className="fas fa-plus-circle"></i> เพิ่มเกมใหม่
              </button>
              <button className="menu-item admin-only" onClick={onAddCategory}>
                <i className="fas fa-folder-plus"></i> เพิ่มหมวดหมู่
              </button>
              <button className="menu-item admin-only" onClick={onAddUpdate}>
                <i className="fas fa-bullhorn"></i> เขียนอัปเดตใหม่
              </button>
              <button className="menu-item admin-only" onClick={onExport}>
                <i className="fas fa-download"></i> สำรองข้อมูล
              </button>
              <button className="menu-item admin-only" onClick={onImport}>
                <i className="fas fa-upload"></i> นำเข้าข้อมูล
              </button>
              <button className="menu-item admin-only" onClick={onLogout}>
                <i className="fas fa-sign-out-alt"></i> ออกจากระบบแอดมิน
              </button>
            </>
          )}
        </div>

        <div className="menu-section">
          <div className="menu-section-title">อื่นๆ</div>
          <button className="menu-item" onClick={onShowUpdates}>
            <i className="fas fa-history"></i> ประวัติการอัปเดต
          </button>
          <button className="menu-item" onClick={onShowAbout}>
            <i className="fas fa-info-circle"></i> เกี่ยวกับเรา
          </button>
        </div>

        <div className="menu-footer">
          <p>Game Hub v3.0</p>
          <p style={{ marginTop: '0.3rem' }}>สร้างด้วย love โดยทีมของเรา</p>
        </div>
      </div>
    </>
  );
}
