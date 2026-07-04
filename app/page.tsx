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

  const defaultGames = [
    {
      id: '1', title: 'Kingdom Quest', category: 'RPG',
      link: 'https://example.com/games/kingdom-quest.zip', image: '',
      description: 'เกม RPG ผจญภัยในอาณาจักรแฟนตาซี พบกับมอนสเตอร์และภารกิจมากมาย สำรวจดันเจี้ยนลึกลับ เก็บเลเวล อัพสกิล และต่อสู้กับบอสสุดโหด!',
      icon: 'fas fa-crown', date: new Date().toISOString()
    },
    {
      id: '2', title: 'Space Shooter X', category: 'Action',
      link: 'https://example.com/games/space-shooter.zip', image: '',
      description: 'ยิงอวกาศสุดมันส์ พร้อมเอฟเฟกต์สวยงามและบอสหลากหลาย',
      icon: 'fas fa-rocket', date: new Date().toISOString()
    },
    {
      id: '3', title: 'Mind Maze', category: 'Puzzle',
      link: 'https://example.com/games/mind-maze.zip', image: '',
      description: 'เกมปริศนาทดสอบสมอง มีด่านให้เล่นมากกว่า 100 ด่าน',
      icon: 'fas fa-brain', date: new Date().toISOString()
    },
    {
      id: '4', title: 'Empire Builder', category: 'Strategy',
      link: 'https://example.com/games/empire-builder.zip', image: '',
      description: 'สร้างอาณาจักรของคุณ บริหารทรัพยากรและต่อสู้กับศัตรู',
      icon: 'fas fa-chess-king', date: new Date().toISOString()
    },
    {
      id: '5', title: 'Speed Racer Pro', category: 'Racing',
      link: 'https://example.com/games/speed-racer.zip', image: '',
      description: 'แข่งรถความเร็วสูง มีสนามแข่งและรถให้เลือกมากมาย',
      icon: 'fas fa-car', date: new Date().toISOString()
    },
    {
      id: '6', title: 'City Simulator', category: 'Simulation',
      link: 'https://example.com/games/city-sim.zip', image: '',
      description: 'สร้างและบริหารเมืองในฝันของคุณ',
      icon: 'fas fa-city', date: new Date().toISOString()
    }
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
      initialGames={(games && games.length > 0) ? games : defaultGames}
      initialCategories={(categories && categories.length > 0) ? categories : defaultCategories}
      initialUpdates={(updates && updates.length > 0) ? updates : defaultUpdates}
      initialTutorials={tutorials || []}
      initialSettings={settings || defaultSettings}
    />
  );
}