import { getBlobData } from '@/lib/db';
import { Game, Category, Update, SiteSettings } from '@/types';
import ClientPage from '@/components/ClientPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [games, categories, updates, settings, tutorials] = await Promise.all([
    getBlobData('games.json'),
    getBlobData('categories.json'),
    getBlobData('updates.json'),
    getBlobData('settings.json'),
    getBlobData('tutorials.json')
  ]);

  const defaultCategories = [
    { name: 'RPG', icon: '⚔️' },
    { name: 'Action', icon: '⚔️' },
    { name: 'Puzzle', icon: '🧩' },
    { name: 'Strategy', icon: '♟️' },
    { name: 'Racing', icon: '🏎️' },
    { name: 'Simulation', icon: '🏗️' },
    { name: 'Horror', icon: '👻' },
    { name: 'Adventure', icon: '🗺️' },
    { name: 'Multiplayer', icon: '👥' },
    { name: 'Other', icon: '🎲' }
  ];

  

  const defaultUpdates = [
    {
      id: '1', title: 'เปิดตัว Game Hub v3.0',
      content: 'ยินดีต้อนรับสู่ Game Hub!\n\nเราเปิดตัวเว็บไซต์สำหรับรวบรวมเกมที่ทีมเราสร้างขึ้น\n\nฟีเจอร์ในเวอร์ชันนี้:\n- ระบบจัดหมวดหมู่เกม\n- ค้นหาเกมได้ง่าย\n- ระบบแอดมินสำหรับจัดการข้อมูล\n- รองรับทุกอุปกรณ์',
      date: '2026-07-03', timestamp: new Date('2026-07-03').getTime()
    }
  ];

  const defaultSettings = {
    heroTitle: 'ศูนย์รวมเกมของทีมเรา',
    heroDesc: 'รวมลิงก์เกมต่างๆ ที่ทีมของเราสร้างขึ้น พร้อมคำอธิบายและการจัดหมวดหมู่'
  };

  return (
    <ClientPage
      initialGames={games || []}
      initialCategories={(categories && categories.length > 0) ? categories : defaultCategories}
      initialUpdates={(updates && updates.length > 0) ? updates : defaultUpdates}
      initialTutorials={tutorials || []}
      initialSettings={settings || defaultSettings}
    />
  );
}