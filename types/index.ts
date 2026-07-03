export interface Game {
  id: string;
  title: string;
  category: string;
  link: string;
  image?: string;
  images?: string[];
  description?: string;
  icon: string;
  date: string;
}

export interface Category {
  name: string;
  icon: string;
}

export interface Update {
  id: string;
  title: string;
  content: string;
  date: string;
  timestamp: number;
}

export interface SiteSettings {
  heroTitle: string;
  heroDesc: string;
  footerText?: string;
  footerSubtext?: string;
  showFooter?: boolean;
  aboutContent?: string;
}

export interface AppData {
  games: Game[];
  categories: Category[];
  updates: Update[];
  settings: SiteSettings;
}