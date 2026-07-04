'use client';

import { Game, Category, Update, SiteSettings } from '@/types';
import { useLanguage } from './LanguageContext';
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
  const { t } = useLanguage();
  const uniqueCats = [...new Set(games.map(g => g.category))];

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div className="admin-panel-title">
          <i className="fas fa-crown"></i>
          <span>{t('admin.panel')}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="add-game-btn" onClick={onAddGame}>
            <i className="fas fa-plus"></i>
            <span>{t('admin.addGame')}</span>
          </button>
          <button className="add-category-btn" onClick={onAddCategory}>
            <i className="fas fa-folder-plus"></i>
            <span>{t('admin.addCategory')}</span>
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{games.length}</div>
          <div className="stat-label">{t('admin.totalGames')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{uniqueCats.length}</div>
          <div className="stat-label">{t('admin.totalCategories')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{updates.length}</div>
          <div className="stat-label">{t('admin.totalUpdates')}</div>
        </div>
      </div>

      <div className="admin-section">
        <BackgroundSettings
          backgroundImage={settings.backgroundImage || ''}
          onChange={(url) => onUpdateSettings({ ...settings, backgroundImage: url })}
        />
      </div>
    </div>
  );
}