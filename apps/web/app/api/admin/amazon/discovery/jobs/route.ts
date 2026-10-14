import { NextRequest, NextResponse } from 'next/server';

async function proxy(request: NextRequest, method: 'GET' | 'POST') {
  const api = process.env.ADMIN_API_INTERNAL_URL;
  const origin = process.env.ADMIN_ALLOWED_ORIGIN;
  if (!api || !origin) return NextResponse.json({ message: 'API yapılandırılmamış' }, { status: 503 });
  const token = request.cookies.get('eib_admin_session')?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ message: 'Oturum gerekli' }, { status: 401 });
  if (method === 'POST' && request.headers.get('origin') !== origin) return NextResponse.json({ message: 'Geçersiz origin' }, { status: 403 });
  const body = method === 'POST' ? await request.text() : undefined;
  if (body && body.length > 4000) return NextResponse.json({ message: 'İstek çok büyük' }, { status: 413 });
  try {
    const response = await fetch(new URL('/api/v1/admin/amazon/discovery/jobs', api), {
      method, headers: { Cookie: 'eib_admin_session=' + token, Origin: origin, ...(body ? { 'Content-Type': 'application/json' } : {}) }, body, cache: 'no-store',
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch { return NextResponse.json({ message: 'API unavailable' }, { status: 502 }); }
}
export async function GET(request: NextRequest) { return proxy(request, 'GET'); }
export async function POST(request: NextRequest) { return proxy(request, 'POST'); }
