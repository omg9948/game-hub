'use client';

import { useState, useCallback, useEffect } from 'react';
import { Game, Category, Update, SiteSettings, Tutorial } from '@/types';
import { useLanguage } from './LanguageContext';
import Menu from './Menu';
import UpdateBanner from './UpdateBanner';
import Hero from './Hero';
import SearchBar from './SearchBar';
import AdminPanel from './AdminPanel';
import CategoryTabs from './CategoryTabs';
import GameCard from './GameCard';
import GameDetailModal from './GameDetailModal';
import Toast from './Toast';
import LanguageSwitcher from './LanguageSwitcher';
import LoginModal from './modals/LoginModal';
import GameModal from './modals/GameModal';
import CategoryModal from './modals/CategoryModal';
import UpdateModal from './modals/UpdateModal';
import UpdateLogModal from './modals/UpdateLogModal';
import AboutModal from './modals/AboutModal';
import TutorialModal from './modals/TutorialModal';
import TutorialEditModal from './modals/TutorialEditModal';
import TutorialDetailModal from './modals/TutorialDetailModal';
import ImportModal from './modals/ImportModal';
import WelcomeModal from './WelcomeModal';
import Particles from './Particles';

interface ClientPageProps {
  initialGames: Game[];
  initialCategories: Category[];
  initialUpdates: Update[];
  initialTutorials: Tutorial[];
  initialSettings: SiteSettings;
}

export default function ClientPage({
  initialGames,
  initialCategories,
  initialUpdates,
  initialTutorials,
  initialSettings
}: ClientPageProps) {
  const { t } = useLanguage();

  const [games, setGames] = useState<Game[]>(initialGames);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [updates, setUpdates] = useState<Update[]>(initialUpdates);
  const [tutorials, setTutorials] = useState<Tutorial[]>(initialTutorials);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{title: string, message: string, type: 'success'|'error'} | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [detailGame, setDetailGame] = useState<Game | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [tutorialDetailOpen, setTutorialDetailOpen] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const [loginOpen, setLoginOpen] = useState(false);
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateLogOpen, setUpdateLogOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialEditOpen, setTutorialEditOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('gamehub_admin');
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // แก้ไข: ใช้ _t แทน t เพื่อไม่ให้ชนกับ t จาก useLanguage
  const refreshData = useCallback(async () => {
    try {
      const [g, c, u, tut, s] = await Promise.all([
        fetch('/api/games').then(r => r.json()).catch(() => []),
        fetch('/api/categories').then(r => r.json()).catch(() => []),
        fetch('/api/updates').then(r => r.json()).catch(() => []),
        fetch('/api/tutorials').then(r => r.json()).catch(() => []),
        fetch('/api/settings').then(r => r.json()).catch(() => ({
          heroTitle: 'ศูนย์รวมเกมของทีมเรา',
          heroDesc: 'รวมลิงก์เกมต่างๆ ที่ทีมของเราสร้างขึ้น พร้อมคำอธิบายและการจัดหมวดหมู่'
        }))
      ]);
      setGames(g);
      setCategories(c);
      setUpdates(u);
      setTutorials(tut);
      setSettings(s);
      setRefreshKey(prev => prev + 1);
      console.log('Data refreshed:', { games: g.length, updates: u.length, tutorials: tut.length });
    } catch (error) {
      console.error('refreshData error:', error);
    }
  }, []);

  const showToast = (title: string, message: string, type: 'success'|'error' = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async (password: string) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      setIsAdmin(true);
      localStorage.setItem('gamehub_admin', 'true');
      setLoginOpen(false);
      showToast(t('toast.loginSuccess'), t('toast.welcomeAdmin'));
    } else {
      showToast(t('toast.wrongPassword'), t('toast.tryAgain'), 'error');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('gamehub_admin');
    showToast(t('toast.logout'), t('toast.logoutSuccess'));
  };

  const handleSave = async (saveFn: () => Promise<void>, successMsg: string) => {
    setIsSaving(true);
    showToast(t('toast.saving'), t('toast.wait'), 'success');
    try {
      await saveFn();
      await refreshData();
      showToast(t('toast.success'), successMsg, 'success');
    } catch (error) {
      console.error('handleSave error:', error);
      showToast(t('toast.error'), t('toast.errorMsg'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLatestUpdate = async () => {
    if (!latestUpdate) return;
    if (!confirm(`\u0e04\u0e38\u0e13\u0e41\u0e19\u0e48\u0e43\u0e08\u0e2b\u0e23\u0e37\u0e2d\u0e44\u0e21\u0e48\u0e17\u0e35\u0e48\u0e08\u0e30\u0e25\u0e1a\u0e1b\u0e23\u0e30\u0e01\u0e32\u0e28 "${latestUpdate.title}"?`)) return;

    await handleSave(async () => {
      await fetch('/api/updates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: latestUpdate.id })
      });
    }, t('toast.success'));
  };

  const filteredGames = games.filter(g => {
    const matchCategory = currentCategory === 'all' || g.category === currentCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !searchQuery || 
      g.title.toLowerCase().includes(q) ||
      (g.description?.toLowerCase().includes(q)) ||
      g.category.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  const latestUpdate = updates.length > 0 ? updates[updates.length - 1] : null;

  return (
    <div className={isAdmin ? 'admin-mode' : ''} key={refreshKey}>
      <div className="bg-animation" />
      <Particles />

      <WelcomeModal updates={updates} onClose={() => {}} />

      {isSaving && (
        <div className="saving-overlay">
          <div className="saving-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <span>{t('toast.saving')}</span>
          </div>
        </div>
      )}

      <Menu 
        categories={categories}
        isAdmin={isAdmin}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onFilterCategory={(cat) => { setCurrentCategory(cat); setMenuOpen(false); }}
        onLogin={() => { setMenuOpen(false); setLoginOpen(true); }}
        onLogout={() => { setMenuOpen(false); handleLogout(); }}
        onAddGame={() => { setMenuOpen(false); setEditingGame(null); setGameModalOpen(true); }}
        onAddCategory={() => { setMenuOpen(false); setCategoryModalOpen(true); }}
        onAddUpdate={() => { setMenuOpen(false); setUpdateModalOpen(true); }}
        onShowUpdates={() => { setMenuOpen(false); setUpdateLogOpen(true); }}
        onShowAbout={() => { setMenuOpen(false); setAboutOpen(true); }}
        onExport={() => {
          const data = { games, categories, updates, tutorials, settings, exportDate: new Date().toISOString() };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `gamehub_backup_${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
          showToast(t('toast.backupSuccess'), t('toast.fileDownloaded'));
          setMenuOpen(false);
        }}
        onImport={() => { setMenuOpen(false); setImportOpen(true); }}
      />

      <header className="header">
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>
          <i className="fas fa-gamepad"></i>
          <span>{t('app.logo')}</span>
        </a>
        <div className="header-right">
          <LanguageSwitcher />

          <button className="tutorial-top-btn" onClick={() => setTutorialOpen(true)}>
            <i className="fas fa-graduation-cap"></i>
            <span>{t('tutorial.button')}</span>
          </button>
          <button className="hamburger-btn" onClick={() => setMenuOpen(true)}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      <div className="container">
        {latestUpdate && (
          <UpdateBanner 
            key={`update-${latestUpdate.id}-${refreshKey}`}
            latestUpdate={latestUpdate} 
            isAdmin={isAdmin} 
            onShowAll={() => setUpdateLogOpen(true)}
            onAddUpdate={() => setUpdateModalOpen(true)}
            onDelete={handleDeleteLatestUpdate}
          />
        )}

        <Hero 
          settings={settings} 
          isAdmin={isAdmin}
          onUpdate={async (newSettings) => {
            await handleSave(async () => {
              await fetch('/api/settings', { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings) 
              });
            }, t('toast.success'));
          }}
        />

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {isAdmin && (
          <AdminPanel 
            games={games} 
            categories={categories} 
            updates={updates}
            onAddGame={() => { setEditingGame(null); setGameModalOpen(true); }}
            onAddCategory={() => setCategoryModalOpen(true)}
          />
        )}

        <CategoryTabs 
          categories={categories} 
          games={games}
          current={currentCategory} 
          onChange={setCurrentCategory} 
        />

        <div className="games-grid">
          {filteredGames.map(game => (
            <GameCard 
              key={game.id} 
              game={game} 
              isAdmin={isAdmin} 
              onEdit={() => { setEditingGame(game); setGameModalOpen(true); }}
              onDelete={async () => {
                if (confirm(`${t('game.delete')} "${game.title}"?`)) {
                  await handleSave(async () => {
                    await fetch('/api/games', { 
                      method: 'DELETE', 
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: game.id }) 
                    });
                  }, `${t('game.delete')} "${game.title}"`);
                }
              }}
              onViewDetail={() => { setDetailGame(game); setDetailOpen(true); }}
            />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="empty-state">
            <i className="fas fa-search"></i>
            <h3>{t('empty.noResults')}</h3>
            <p>{t('empty.tryAgain')}</p>
          </div>
        )}
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <GameDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        game={detailGame}
      />

      <LoginModal 
        isOpen={loginOpen} 
        onClose={() => setLoginOpen(false)} 
        onLogin={handleLogin} 
      />

      <GameModal
        isOpen={gameModalOpen}
        onClose={() => setGameModalOpen(false)}
        game={editingGame}
        categories={categories}
        onSubmit={async (data) => {
          await handleSave(async () => {
            await fetch('/api/games', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
          }, editingGame ? t('modal.editGame') : t('modal.addGame'));
          setGameModalOpen(false);
        }}
      />

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={async (data) => {
          await handleSave(async () => {
            const res = await fetch('/api/categories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Category already exists');
          }, `${t('modal.addCategory')} "${data.name}"`);
          setCategoryModalOpen(false);
        }}
      />

      <UpdateModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onSubmit={async (data) => {
          await handleSave(async () => {
            await fetch('/api/updates', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
          }, t('modal.send'));
          setUpdateModalOpen(false);
        }}
      />

      <UpdateLogModal
        isOpen={updateLogOpen}
        onClose={() => setUpdateLogOpen(false)}
        updates={updates}
        isAdmin={isAdmin}
        onDelete={async (id) => {
          await handleSave(async () => {
            await fetch('/api/updates', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id })
            });
          }, t('toast.success'));
        }}
      />

      <AboutModal 
        isOpen={aboutOpen} 
        onClose={() => setAboutOpen(false)}
        content={settings.aboutContent}
        isAdmin={isAdmin}
        onUpdate={async (content) => {
          await handleSave(async () => {
            await fetch('/api/settings', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...settings, aboutContent: content })
            });
          }, t('toast.success'));
        }}
      />

      <TutorialModal
        isOpen={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
        tutorials={tutorials}
        isAdmin={isAdmin}
        onEdit={() => setTutorialEditOpen(true)}
        onViewDetail={(tutorial) => {
          setSelectedTutorial(tutorial);
          setTutorialDetailOpen(true);
        }}
      />

      <TutorialDetailModal
        isOpen={tutorialDetailOpen}
        onClose={() => setTutorialDetailOpen(false)}
        tutorial={selectedTutorial}
      />

      <TutorialEditModal
        isOpen={tutorialEditOpen}
        onClose={() => setTutorialEditOpen(false)}
        tutorials={tutorials}
        onSave={async (newTutorials) => {
          await handleSave(async () => {
            await fetch('/api/tutorials', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newTutorials)
            });
          }, t('toast.success'));
          setTutorialEditOpen(false);
        }}
      />

      <ImportModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={async (data) => {
          setIsSaving(true);
          showToast(t('toast.importing'), t('toast.importWait'), 'success');
          try {
            const imported = JSON.parse(data);
            if (imported.games) {
              for (const g of imported.games) {
                await fetch('/api/games', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(g) });
              }
            }
            if (imported.categories) {
              for (const c of imported.categories) {
                await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) });
              }
            }
            if (imported.updates) {
              for (const u of imported.updates) {
                await fetch('/api/updates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(u) });
              }
            }
            if (imported.tutorials) {
              await fetch('/api/tutorials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(imported.tutorials) });
            }
            if (imported.settings) {
              await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(imported.settings) });
            }
            await refreshData();
            showToast(t('toast.importSuccess'), t('toast.imported'));
          } catch (e) {
            showToast(t('toast.jsonError'), t('toast.invalidJSON'), 'error');
          } finally {
            setIsSaving(false);
            setImportOpen(false);
          }
        }}
      />
    </div>
  );
}