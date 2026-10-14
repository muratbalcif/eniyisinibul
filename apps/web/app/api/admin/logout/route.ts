import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const api = process.env.ADMIN_API_INTERNAL_URL;
  const origin = process.env.ADMIN_ALLOWED_ORIGIN;
  if (!api || !origin) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  if (request.headers.get('origin') !== origin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const token = request.cookies.get('eib_admin_session')?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  try {
    const upstream = await fetch(new URL('/api/v1/admin/auth/logout', api), {
      method: 'POST', headers: { Cookie: 'eib_admin_session=' + token, Origin: origin }, cache: 'no-store',
    });
    if (!upstream.ok) return NextResponse.json({ error: 'Logout failed' }, { status: 502 });
  } catch { return NextResponse.json({ error: 'API unavailable' }, { status: 502 }); }
  const response = NextResponse.json({ signedOut: true });
  response.cookies.set('eib_admin_session', '', { path: '/admin', maxAge: 0, httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
  return response;
}
