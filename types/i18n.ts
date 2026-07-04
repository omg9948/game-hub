export type Language = 'th' | 'en';

export interface Translations {
  [key: string]: string | Translations;
}
