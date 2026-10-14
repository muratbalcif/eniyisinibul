import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const api = process.env.ADMIN_API_INTERNAL_URL;
  const origin = process.env.ADMIN_ALLOWED_ORIGIN;
  if (!api || !origin) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  const submittedOrigin = request.headers.get('origin');
  if (submittedOrigin !== origin) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  const payload = await request.text();
  if (payload.length > 4096) return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  try {
    const upstream = await fetch(new URL('/api/v1/admin/auth/login', api), {
      method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin },
      body: payload, cache: 'no-store',
    });
    if (!upstream.ok) return NextResponse.json({ error: 'Login failed' }, { status: upstream.status });
    const cookie = upstream.headers.get('set-cookie');
    if (!cookie) return NextResponse.json({ error: 'Missing session' }, { status: 502 });
    const token = /^eib_admin_session=([a-f0-9]{64})(?:;|$)/.exec(cookie)?.[1];
    if (!token) return NextResponse.json({ error: 'Invalid session' }, { status: 502 });
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set('eib_admin_session', token, {
      httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production',
      path: '/', maxAge: 8 * 60 * 60,
    });
    return response;
  } catch { return NextResponse.json({ error: 'Upstream unavailable' }, { status: 502 }); }
}
