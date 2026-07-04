import { NextResponse } from 'next/server';
import { getBlobData, setBlobData } from '@/lib/db';

export async function GET() {
  try {
    const updates = await getBlobData('updates.json');
    return NextResponse.json(updates || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const updates = await getBlobData('updates.json') || [];

    const newUpdate = {
      ...data,
      id: `update_${Date.now()}`,
      timestamp: Date.now()
    };

    updates.push(newUpdate);
    await setBlobData('updates.json', updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save update' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const updates = await getBlobData('updates.json') || [];
    const filtered = updates.filter((u: any) => u.id !== id);
    await setBlobData('updates.json', filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete update' }, { status: 500 });
  }
}