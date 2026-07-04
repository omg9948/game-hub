import { getBlobData } from '@/lib/db';
import ClientPage from '@/components/ClientPage';
import { Game, Category, Update, Settings, Tutorial } from '@/types';

export default async function Home() {
  const [categories, updates, settings, tutorials] = await Promise.all([
    getBlobData('categories.json'),
    getBlobData('updates.json'),
    getBlobData('settings.json'),
    getBlobData('tutorials.json')
  ]);

  return (
    <ClientPage 
      initialGames={[]} 
      initialCategories={(categories || []) as Category[]}
      initialUpdates={(updates || []) as Update[]}
      initialSettings={(settings || {}) as Settings}
      initialTutorials={(tutorials || []) as Tutorial[]}
    />
  );
}
