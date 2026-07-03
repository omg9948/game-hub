import { NextRequest, NextResponse } from 'next/server';
import { getBlobData, setBlobData } from '@/lib/db';

const CATEGORIES_FILE = 'categories.json';

export async function GET() {
  const categories = await getBlobData(CATEGORIES_FILE) || [];
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const categories = (await getBlobData(CATEGORIES_FILE)) || [];

  const exists = categories.find((c: any) => c.name.toLowerCase() === body.name.toLowerCase());
  if (exists) {
    return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
  }

  categories.push(body);
  await setBlobData(CATEGORIES_FILE, categories);
  return NextResponse.json({ success: true, categories });
}
