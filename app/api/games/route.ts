import { NextResponse } from 'next/server';
import { getBlobData, setBlobData } from '@/lib/db';

export async function GET() {
  try {
    const games = await getBlobData('games.json');
    return NextResponse.json(games || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const games = await getBlobData('games.json') || [];

    if (data.id) {
      // Edit existing game
      const index = games.findIndex((g: any) => g.id === data.id);
      if (index !== -1) {
        games[index] = { ...games[index], ...data };
      } else {
        games.push(data);
      }
    } else {
      // Add new game
      const newGame = { ...data, id: `game_${Date.now()}`, date: new Date().toISOString() };
      games.push(newGame);
    }

    await setBlobData('games.json', games);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save game' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const games = await getBlobData('games.json') || [];
    const filtered = games.filter((g: any) => g.id !== id);
    await setBlobData('games.json', filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
  }
}