import { NextResponse } from 'next/server';
import { getBlobData, setBlobData } from '@/lib/db';

export async function GET() {
  try {
    const categories = await getBlobData('categories.json');
    return NextResponse.json(categories || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const categories = await getBlobData('categories.json') || [];

    const exists = categories.find((c: any) => c.name === data.name);
    if (exists) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }

    categories.push(data);
    await setBlobData('categories.json', categories);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save category' }, { status: 500 });
  }
}