import { NextRequest, NextResponse } from 'next/server';
import { getBlobData, setBlobData } from '@/lib/db';

const SETTINGS_FILE = 'settings.json';

export async function GET() {
  const settings = await getBlobData(SETTINGS_FILE) || {
    heroTitle: 'ศูนย์รวมเกมของทีมเรา',
    heroDesc: 'รวมลิงก์เกมต่างๆ ที่ทีมของเราสร้างขึ้น พร้อมคำอธิบายและการจัดหมวดหมู่'
  };
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  await setBlobData(SETTINGS_FILE, body);
  return NextResponse.json({ success: true });
}
