import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const origin = process.env.ADMIN_ALLOWED_ORIGIN;
  const api = process.env.ADMIN_API_INTERNAL_URL;
  if (!origin || !api) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  if (request.headers.get('origin') !== origin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const token = request.cookies.get('eib_admin_session')?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let data: unknown;
  try { data = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  const body = data as Record<string, unknown>;
  if (typeof body.name !== 'string' || typeof body.slug !== 'string' || body.name.length > 160 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug) || body.slug.length > 120) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }
  try {
    const response = await fetch(new URL('/api/v1/admin/categories', api), {
      method: 'POST', headers: { Origin: origin, Cookie: 'eib_admin_session=' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: body.name, slug: body.slug }), cache: 'no-store',
    });
    if (!response.ok) return NextResponse.json({ error: 'Category not created' }, { status: response.status });
    return NextResponse.json({ created: true }, { status: 201 });
  } catch { return NextResponse.json({ error: 'API unavailable' }, { status: 502 }); }
}
