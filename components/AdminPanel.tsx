'use client';

import { Game, Category, Update } from '@/types';

interface AdminPanelProps {
  games: Game[];
  categories: Category[];
  updates: Update[];
  onAddGame: () => void;
  onAddCategory: () => void;
}

export default function AdminPanel({ games, categories, updates, onAddGame, onAddCategory }: AdminPanelProps) {
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
    </div>
  );
}