'use client';

import { Game, Category, Update, SiteSettings } from '@/types';
import BackgroundSettings from './BackgroundSettings';

interface AdminPanelProps {
  games: Game[];
  categories: Category[];
  updates: Update[];
  settings: SiteSettings;
  onAddGame: () => void;
  onAddCategory: () => void;
  onUpdateSettings: (settings: SiteSettings) => void;
}

export default function AdminPanel({ games, categories, updates, settings, onAddGame, onAddCategory, onUpdateSettings }: AdminPanelProps) {
  const uniqueCats = [...new Set(games.map(g => g.category))];

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div className="admin-panel-title">
          <i className="fas fa-crown"></i>
          <span>แผงควบคุมแอดมิน</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="add-game-btn" onClick={onAddGame}>
            <i className="fas fa-plus"></i>
            <span>เพิ่มเกมใหม่</span>
          </button>
          <button className="add-category-btn" onClick={onAddCategory}>
            <i className="fas fa-folder-plus"></i>
            <span>เพิ่มหมวดหมู่</span>
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{games.length}</div>
          <div className="stat-label">เกมทั้งหมด</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{uniqueCats.length}</div>
          <div className="stat-label">หมวดหมู่</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{updates.length}</div>
          <div className="stat-label">อัปเดต</div>
        </div>
      </div>

      {/* Background Settings - ตั้งค่าภาพพื้นหลัง */}
      <div className="admin-section">
        <BackgroundSettings
          backgroundImage={settings.backgroundImage || ''}
          onChange={(url) => onUpdateSettings({ ...settings, backgroundImage: url })}
        />
      </div>
    </div>
  );
}