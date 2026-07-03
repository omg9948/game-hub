import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const hash = crypto.createHash('sha256').update(password).digest('hex');

  if (hash === process.env.ADMIN_PASSWORD_HASH) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
