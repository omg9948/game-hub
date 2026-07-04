export interface Game {
  id: string;
  title: string;
  category: string;
  link: string;
  image?: string;
  description?: string;
  icon?: string;
  date?: string;
  downloadSource?: string;  // ชื่อแหล่งที่มา เช่น "MEGA", "Google Drive", "MediaFire"
  showSource?: boolean;     // แสดงชื่อแหล่งที่มาหรือไม่ (default: true)
}

export interface Category {
  name: string;
  icon?: string;
}

export interface Update {
  id: string;
  title: string;
  content: string;
  date: string;
  timestamp: number;
}

export interface Tutorial {
  id: string;
  title: string;
  description?: string;
  youtubeUrl: string;
  thumbnail?: string;
  order?: number;
}

export interface SiteSettings {
  heroTitle?: string;
  heroDesc?: string;
  aboutContent?: string;
}

export interface AppData {
  games: Game[];
  categories: Category[];
  updates: Update[];
  tutorials: Tutorial[];
  settings: SiteSettings;
}