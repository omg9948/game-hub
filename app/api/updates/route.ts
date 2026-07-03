import { NextRequest, NextResponse } from 'next/server';
import { getBlobData, setBlobData } from '@/lib/db';

const UPDATES_FILE = 'updates.json';

export async function GET() {
  const updates = await getBlobData(UPDATES_FILE) || [];
  return NextResponse.json(updates);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const updates = (await getBlobData(UPDATES_FILE)) || [];

  updates.push({
    ...body,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    timestamp: Date.now()
  });

  await setBlobData(UPDATES_FILE, updates);
  return NextResponse.json({ success: true, updates });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  let updates = (await getBlobData(UPDATES_FILE)) || [];
  updates = updates.filter((u: any) => u.id !== id);
  await setBlobData(UPDATES_FILE, updates);
  return NextResponse.json({ success: true });
}
