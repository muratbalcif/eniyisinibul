import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const api = process.env.ADMIN_API_INTERNAL_URL;
  const origin = process.env.ADMIN_ALLOWED_ORIGIN;
  if (!api || !origin) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  if (request.headers.get('origin') !== origin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const token = request.cookies.get('eib_admin_session')?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const raw = await request.text();
  if (raw.length > 7000) return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  try {
    const upstream = await fetch(new URL('/api/v1/admin/amazon/import', api), {
      method: 'POST', headers: { Origin: origin, Cookie: 'eib_admin_session=' + token, 'Content-Type': 'application/json' },
      body: raw, cache: 'no-store',
    });
    const result = await upstream.json().catch(() => ({ message: 'Import failed' }));
    return NextResponse.json(result, { status: upstream.status });
  } catch { return NextResponse.json({ error: 'API unavailable' }, { status: 502 }); }
}
