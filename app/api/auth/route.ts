import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

    if (!ADMIN_PASSWORD_HASH) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const hash = crypto.createHash('sha256').update(password).digest('hex');

    if (hash === ADMIN_PASSWORD_HASH) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}