import { getBlobData } from '@/lib/db';
import ClientPage from '@/components/ClientPage';
import { Game, Category, Update, SiteSettings, Tutorial } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [games, categories, updates, settings, tutorials] = await Promise.all([
    getBlobData('games.json'),
    getBlobData('categories.json'),
    getBlobData('updates.json'),
    getBlobData('settings.json'),
    getBlobData('tutorials.json')
  ]);

  return (
    <ClientPage 
      initialGames={(games || []) as Game[]} 
      initialCategories={(categories || []) as Category[]}
      initialUpdates={(updates || []) as Update[]}
      initialSettings={(settings || {
        heroTitle: 'ศูนย์รวมเกมของทีมเรา',
        heroDesc: 'รวมลิงก์เกมต่างๆ ที่ทีมของเราสร้างขึ้น พร้อมคำอธิบายและการจัดหมวดหมู่'
      }) as SiteSettings}
      initialTutorials={(tutorials || []) as Tutorial[]}
    />
  );
}