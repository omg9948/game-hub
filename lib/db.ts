import { put, list } from '@vercel/blob';

const DB_PREFIX = 'gamehub/';

export async function getBlobData(filename: string): Promise<any> {
  try {
    const { blobs } = await list({ prefix: `${DB_PREFIX}${filename}` });
    if (blobs.length === 0) return null;

    const response = await fetch(blobs[0].url);
    if (!response.ok) return null;

    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('getBlobData error:', error);
    return null;
  }
}

export async function setBlobData(filename: string, data: any): Promise<void> {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });

  try {
    await put(`${DB_PREFIX}${filename}`, blob, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });
    console.log(`setBlobData success: ${DB_PREFIX}${filename}`);
  } catch (error) {
    console.error('setBlobData error:', error);
    throw error;
  }
}