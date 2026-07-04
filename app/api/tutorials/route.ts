import { NextRequest, NextResponse } from 'next/server';
import { getBlobData, setBlobData } from '@/lib/db';

const TUTORIALS_FILE = 'tutorials.json';

export async function GET() {
  try {
    const tutorials = await getBlobData(TUTORIALS_FILE);
    return NextResponse.json(tutorials || []);
  } catch (error) {
    console.error('GET /api/tutorials error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tutorials = await req.json();
    console.log('POST /api/tutorials:', tutorials.length, 'items');

    await setBlobData(TUTORIALS_FILE, tutorials);
    console.log('POST /api/tutorials success');
    return NextResponse.json({ success: true, tutorials });
  } catch (error) {
    console.error('POST /api/tutorials error:', error);
    return NextResponse.json({ error: 'Failed to save tutorials', detail: String(error) }, { status: 500 });
  }
}