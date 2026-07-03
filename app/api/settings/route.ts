import { NextRequest, NextResponse } from 'next/server';
import { getBlobData, setBlobData } from '@/lib/db';

const SETTINGS_FILE = 'settings.json';

const defaultSettings = {
  heroTitle: 'ศูนย์รวมเกมของทีมเรา',
  heroDesc: 'รวมลิงก์เกมต่างๆ ที่ทีมของเราสร้างขึ้น พร้อมคำอธิบายและการจัดหมวดหมู่'
};

export async function GET() {
  try {
    const settings = await getBlobData(SETTINGS_FILE);
    return NextResponse.json(settings || defaultSettings);
  } catch (error) {
    console.error('GET /api/settings error:', error);
    return NextResponse.json(defaultSettings, { status: 200 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('PUT /api/settings body:', body);

    await setBlobData(SETTINGS_FILE, body);
    console.log('PUT /api/settings success');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT /api/settings error:', error);
    return NextResponse.json({ error: 'Failed to save settings', detail: String(error) }, { status: 500 });
  }
}