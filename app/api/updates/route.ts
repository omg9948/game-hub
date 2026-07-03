import { NextRequest, NextResponse } from 'next/server';
import { getBlobData, setBlobData } from '@/lib/db';

const UPDATES_FILE = 'updates.json';

export async function GET() {
  try {
    const updates = await getBlobData(UPDATES_FILE);
    return NextResponse.json(updates || []);
  } catch (error) {
    console.error('GET /api/updates error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('POST /api/updates body:', body);

    const updates = (await getBlobData(UPDATES_FILE)) || [];

    updates.push({
      ...body,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      timestamp: Date.now()
    });

    await setBlobData(UPDATES_FILE, updates);
    console.log('POST /api/updates success, total updates:', updates.length);
    return NextResponse.json({ success: true, updates });
  } catch (error) {
    console.error('POST /api/updates error:', error);
    return NextResponse.json({ error: 'Failed to save update', detail: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    let updates = (await getBlobData(UPDATES_FILE)) || [];
    updates = updates.filter((u: any) => u.id !== id);
    await setBlobData(UPDATES_FILE, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/updates error:', error);
    return NextResponse.json({ error: 'Failed to delete update' }, { status: 500 });
  }
}