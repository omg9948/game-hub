import { NextRequest, NextResponse } from 'next/server';
import { getBlobData, setBlobData } from '@/lib/db';

const GAMES_FILE = 'games.json';

export async function GET() {
  const games = await getBlobData(GAMES_FILE) || [];
  return NextResponse.json(games);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const games = (await getBlobData(GAMES_FILE)) || [];

  if (body.id) {
    const index = games.findIndex((g: any) => g.id === body.id);
    if (index !== -1) games[index] = { ...games[index], ...body };
  } else {
    games.push({
      ...body,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      date: new Date().toISOString()
    });
  }

  await setBlobData(GAMES_FILE, games);
  return NextResponse.json({ success: true, games });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  let games = (await getBlobData(GAMES_FILE)) || [];
  games = games.filter((g: any) => g.id !== id);
  await setBlobData(GAMES_FILE, games);
  return NextResponse.json({ success: true });
}
