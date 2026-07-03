import { NextRequest, NextResponse } from 'next/server';
import { getBlobData, setBlobData } from '@/lib/db';

const CATEGORIES_FILE = 'categories.json';

export async function GET() {
  try {
    const categories = await getBlobData(CATEGORIES_FILE);
    return NextResponse.json(categories || []);
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('POST /api/categories body:', body);

    const categories = (await getBlobData(CATEGORIES_FILE)) || [];

    const exists = categories.find((c: any) => c.name.toLowerCase() === body.name.toLowerCase());
    if (exists) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
    }

    categories.push(body);
    await setBlobData(CATEGORIES_FILE, categories);
    console.log('POST /api/categories success, total categories:', categories.length);
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json({ error: 'Failed to save category', detail: String(error) }, { status: 500 });
  }
}