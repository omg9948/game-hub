import { put, del, list } from '@vercel/blob';

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
    // ลบ blob เก่าที่มี prefix เดียวกัน
    const { blobs } = await list({ prefix: `${DB_PREFIX}${filename}` });
    for (const b of blobs) {
      await del(b.url);
    }
  } catch (error) {
    console.error('delete old blob error:', error);
    // ignore delete errors
  }

  try {
    await put(`${DB_PREFIX}${filename}`, blob, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false, // สำคัญ! ต้องใช้ชื่อเดิมเพื่อ overwrite
    });
    console.log(`setBlobData success: ${DB_PREFIX}${filename}`);
  } catch (error) {
    console.error('setBlobData error:', error);
    throw error;
  }
}
