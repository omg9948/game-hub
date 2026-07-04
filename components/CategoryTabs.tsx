'use client';

import { Category, Game } from '@/types';
import { useLanguage } from './LanguageContext';

interface CategoryTabsProps {
  categories: Category[];
  games: Game[];
  current: string;
  onChange: (cat: string) => void;
}

export default function CategoryTabs({ categories, games, current, onChange }: CategoryTabsProps) {
  const { t } = useLanguage();
  const uniqueCategories = [...new Set(games.map(g => g.category))].sort();

  return (
    <div className="category-tabs">
      <button 
        className={`tab-btn ${current === 'all' ? 'active' : ''}`}
        onClick={() => onChange('all')}
      >
        {t('menu.allGames')} ({games.length})
      </button>
      {uniqueCategories.map(cat => {
        const catObj = categories.find(c => c.name === cat);
        const count = games.filter(g => g.category === cat).length;
        return (
          <button
            key={cat}
            className={`tab-btn ${current === cat ? 'active' : ''}`}
            onClick={() => onChange(cat)}
          >
            {catObj?.icon || '🎮'} {cat} ({count})
          </button>
        );
      })}
    </div>
  );
}