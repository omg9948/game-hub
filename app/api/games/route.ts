import { NextRequest, NextResponse } from 'next/server';
import { getBlobData, setBlobData } from '@/lib/db';

const GAMES_FILE = 'games.json';

export async function GET() {
  try {
    const games = await getBlobData(GAMES_FILE);
    return NextResponse.json(games || []);
  } catch (error) {
    console.error('GET /api/games error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('POST /api/games body:', body);

    const games = (await getBlobData(GAMES_FILE)) || [];

    if (body.id) {
      // แก้ไขเกมที่มีอยู่
      const index = games.findIndex((g: any) => g.id === body.id);
      if (index !== -1) {
        games[index] = { ...games[index], ...body };
      } else {
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });
      }
    } else {
      // เพิ่มเกมใหม่
      games.push({
        ...body,
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        date: new Date().toISOString()
      });
    }

    await setBlobData(GAMES_FILE, games);
    console.log('POST /api/games success, total games:', games.length);
    return NextResponse.json({ success: true, games });
  } catch (error) {
    console.error('POST /api/games error:', error);
    return NextResponse.json({ error: 'Failed to save game', detail: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    let games = (await getBlobData(GAMES_FILE)) || [];
    games = games.filter((g: any) => g.id !== id);
    await setBlobData(GAMES_FILE, games);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/games error:', error);
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
  }
}