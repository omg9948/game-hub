export interface Game {
  id: string;
  title: string;
  category: string;
  link: string;
  image?: string;
  images?: string[];        // รูปภาพหลายรูป (สำหรับ Gallery)
  description?: string;
  icon?: string;
  date?: string;
  downloadSource?: string;  // ชื่อแหล่งที่มา เช่น "MEGA", "Google Drive", "MediaFire"
  showSource?: boolean;     // แสดงชื่อแหล่งที่มาหรือไม่ (default: true)
  pinned?: boolean;         // ปักหมุดเกม (แสดงแรกสุด)
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
  backgroundImage?: string;  // URL รูปพื้นหลัง (แนะนำ 1920x1080 หรือ 2560x1440)
}

export interface AppData {
  games: Game[];
  categories: Category[];
  updates: Update[];
  tutorials: Tutorial[];
  settings: SiteSettings;
}