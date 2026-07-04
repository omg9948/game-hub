export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}