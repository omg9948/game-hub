'use client';

import { Category } from '@/types';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from './LanguageContext';

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
  const { t } = useLanguage();

  return (
    <>
      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`hamburger-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h3><i className="fas fa-bars"></i> {t('menu.title')}</h3>
          <button className="menu-close" onClick={onClose}>&times;</button>
        </div>

        <div className="menu-section">
          <div className="menu-section-title">{t('menu.nav')}</div>
          <button className="menu-item" onClick={() => { onClose(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
            <i className="fas fa-home"></i> {t('menu.home')}
          </button>
          <button className="menu-item" onClick={() => { onClose(); document.getElementById('searchInput')?.focus(); }}>
            <i className="fas fa-search"></i> {t('menu.search')}
          </button>
          <button className="menu-item" onClick={() => onFilterCategory('all')}>
            <i className="fas fa-th-large"></i> {t('menu.allGames')}
          </button>
        </div>

        <div className="menu-section">
          <div className="menu-section-title">{t('menu.categories')}</div>
          {categories.map(cat => (
            <button key={cat.name} className="menu-item" onClick={() => onFilterCategory(cat.name)}>
              <i className="fas fa-gamepad"></i> {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="menu-section">
          <div className="menu-section-title">{t('menu.admin')}</div>
          {!isAdmin ? (
            <button className="menu-item" onClick={onLogin}>
              <i className="fas fa-shield-alt"></i> {t('menu.login')}
            </button>
          ) : (
            <>
              <div className="admin-status">
                <i className="fas fa-check-circle"></i> {t('menu.loggedIn')}
              </div>
              <button className="menu-item admin-only" onClick={onAddGame}>
                <i className="fas fa-plus-circle"></i> {t('menu.addGame')}
              </button>
              <button className="menu-item admin-only" onClick={onAddCategory}>
                <i className="fas fa-folder-plus"></i> {t('menu.addCategory')}
              </button>
              <button className="menu-item admin-only" onClick={onAddUpdate}>
                <i className="fas fa-bullhorn"></i> {t('menu.addUpdate')}
              </button>
              <button className="menu-item admin-only" onClick={onExport}>
                <i className="fas fa-download"></i> {t('menu.backup')}
              </button>
              <button className="menu-item admin-only" onClick={onImport}>
                <i className="fas fa-upload"></i> {t('menu.import')}
              </button>
              <button className="menu-item admin-only logout" onClick={onLogout}>
                <i className="fas fa-sign-out-alt"></i> {t('menu.logout')}
              </button>
            </>
          )}
        </div>

        <div className="menu-section">
          <div className="menu-section-title">{t('menu.others')}</div>
          <button className="menu-item" onClick={onShowUpdates}>
            <i className="fas fa-history"></i> {t('menu.updateHistory')}
          </button>
          <button className="menu-item" onClick={onShowAbout}>
            <i className="fas fa-info-circle"></i> {t('menu.about')}
          </button>
        </div>

        {/* Language Switcher ในเมนู */}
        <div className="menu-section">
          <div className="menu-section-title">{t('language.title')}</div>
          <div className="menu-language-switcher">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </>
  );
}