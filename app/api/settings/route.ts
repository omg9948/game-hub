import { NextResponse } from 'next/server';
import { getBlobData, setBlobData } from '@/lib/db';

export async function GET() {
  try {
    const settings = await getBlobData('settings.json');
    return NextResponse.json(settings || {
      heroTitle: 'ศูนย์รวมเกมของทีมเรา',
      heroDesc: 'รวมลิงก์เกมต่างๆ ที่ทีมของเราสร้างขึ้น พร้อมคำอธิบายและการจัดหมวดหมู่'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    await setBlobData('settings.json', data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}