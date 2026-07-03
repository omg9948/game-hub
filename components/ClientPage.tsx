'use client';

import { useState, useCallback, useEffect } from 'react';
import { Game, Category, Update, SiteSettings } from '@/types';
import Menu from './Menu';
import UpdateBanner from './UpdateBanner';
import Hero from './Hero';
import SearchBar from './SearchBar';
import AdminPanel from './AdminPanel';
import CategoryTabs from './CategoryTabs';
import GameCard from './GameCard';
import GameDetailModal from './GameDetailModal';
import Toast from './Toast';
import LoginModal from './modals/LoginModal';
import GameModal from './modals/GameModal';
import CategoryModal from './modals/CategoryModal';
import UpdateModal from './modals/UpdateModal';
import UpdateLogModal from './modals/UpdateLogModal';
import AboutModal from './modals/AboutModal';
import ImportModal from './modals/ImportModal';
import Particles from './Particles';

interface ClientPageProps {
  initialGames: Game[];
  initialCategories: Category[];
  initialUpdates: Update[];
  initialSettings: SiteSettings;
}

export default function ClientPage({
  initialGames,
  initialCategories,
  initialUpdates,
  initialSettings
}: ClientPageProps) {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [updates, setUpdates] = useState<Update[]>(initialUpdates);
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

  const [loginOpen, setLoginOpen] = useState(false);
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateLogOpen, setUpdateLogOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('gamehub_admin');
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [g, c, u, s] = await Promise.all([
        fetch('/api/games').then(r => r.json()).catch(() => []),
        fetch('/api/categories').then(r => r.json()).catch(() => []),
        fetch('/api/updates').then(r => r.json()).catch(() => []),
        fetch('/api/settings').then(r => r.json()).catch(() => ({
          heroTitle: 'ศูนย์รวมเกมของทีมเรา',
          heroDesc: 'รวมลิงก์เกมต่างๆ ที่ทีมของเราสร้างขึ้น พร้อมคำอธิบายและการจัดหมวดหมู่'
        }))
      ]);
      setGames(g);
      setCategories(c);
      setUpdates(u);
      setSettings(s);
      setRefreshKey(prev => prev + 1);
      console.log('Data refreshed:', { games: g.length, updates: u.length });
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
      showToast('เข้าสู่ระบบสำเร็จ', 'ยินดีต้อนรับแอดมิน!');
    } else {
      showToast('รหัสผ่านไม่ถูกต้อง', 'กรุณาลองใหม่อีกครั้ง', 'error');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('gamehub_admin');
    showToast('ออกจากระบบ', 'ออกจากระบบแอดมินเรียบร้อย');
  };

  const handleSave = async (saveFn: () => Promise<void>, successMsg: string) => {
    setIsSaving(true);
    showToast('กำลังบันทึก...', 'รอสักครู่ กำลังบันทึกข้อมูล', 'success');
    try {
      await saveFn();
      await refreshData();
      showToast('บันทึกสำเร็จ!', successMsg, 'success');
    } catch (error) {
      console.error('handleSave error:', error);
      showToast('บันทึกไม่สำเร็จ', 'เกิดข้อผิดพลาด กรุณาลองใหม่', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLatestUpdate = async () => {
    if (!latestUpdate) return;
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบประกาศ "${latestUpdate.title}"?`)) return;

    await handleSave(async () => {
      await fetch('/api/updates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: latestUpdate.id })
      });
    }, 'ประกาศถูกลบเรียบร้อย');
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

      {isSaving && (
        <div className="saving-overlay">
          <div className="saving-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <span>กำลังบันทึก...</span>
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
          const data = { games, categories, updates, settings, exportDate: new Date().toISOString() };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `gamehub_backup_${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
          showToast('สำรองข้อมูลสำเร็จ', 'ไฟล์ถูกดาวน์โหลดแล้ว');
          setMenuOpen(false);
        }}
        onImport={() => { setMenuOpen(false); setImportOpen(true); }}
      />

      <header className="header">
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>
          <i className="fas fa-gamepad"></i>
          <span>Game Hub</span>
        </a>
        <div className="header-right">
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
            }, 'ตั้งค่าหน้าเว็บบันทึกเรียบร้อย');
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
                if (confirm(`คุณแน่ใจหรือไม่ที่จะลบเกม "${game.title}"?`)) {
                  await handleSave(async () => {
                    await fetch('/api/games', { 
                      method: 'DELETE', 
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: game.id }) 
                    });
                  }, `เกม "${game.title}" ถูกลบเรียบร้อย`);
                }
              }}
              onViewDetail={() => { setDetailGame(game); setDetailOpen(true); }}
            />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="empty-state">
            <i className="fas fa-search"></i>
            <h3>ไม่พบเกมที่ค้นหา</h3>
            <p>ลองค้นหาด้วยคำอื่น หรือตรวจสอบการสะกดอีกครั้ง</p>
          </div>
        )}
      </div>

      {/* Footer ถูกลบออกแล้ว */}

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
          }, editingGame ? 'เกมถูกอัปเดตแล้ว' : 'เกมใหม่ถูกเพิ่มแล้ว');
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
          }, `หมวดหมู่ "${data.name}" ถูกเพิ่มแล้ว`);
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
          }, 'อัปเดตใหม่ถูกเพิ่มแล้ว');
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
          }, 'อัปเดตถูกลบแล้ว');
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
          }, 'ข้อมูลเกี่ยวกับเราบันทึกเรียบร้อย');
        }}
      />

      <ImportModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={async (data) => {
          setIsSaving(true);
          showToast('กำลังนำเข้า...', 'รอสักครู่ กำลังนำเข้าข้อมูล', 'success');
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
            if (imported.settings) {
              await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(imported.settings) });
            }
            await refreshData();
            showToast('นำเข้าสำเร็จ!', 'ข้อมูลถูกนำเข้าเรียบร้อย');
          } catch (e) {
            showToast('ข้อผิดพลาด', 'ข้อมูล JSON ไม่ถูกต้อง', 'error');
          } finally {
            setIsSaving(false);
            setImportOpen(false);
          }
        }}
      />
    </div>
  );
}