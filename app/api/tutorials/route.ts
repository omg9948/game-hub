import { NextResponse } from 'next/server';
import { getBlobData, setBlobData } from '@/lib/db';

export async function GET() {
  try {
    const tutorials = await getBlobData('tutorials.json');
    return NextResponse.json(tutorials || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tutorials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await setBlobData('tutorials.json', data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save tutorials' }, { status: 500 });
  }
}