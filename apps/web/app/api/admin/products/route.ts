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
  let input: unknown;
  try { input = JSON.parse(raw); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
  const data = input as Record<string, unknown>;
  if (typeof data.title !== 'string' || !data.title.trim() || data.title.length > 240 ||
      typeof data.slug !== 'string' || data.slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) ||
      typeof data.categoryId !== 'string' || !data.categoryId || data.categoryId.length > 64 ||
      (data.description !== undefined && (typeof data.description !== 'string' || data.description.length > 5000))) {
    return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
  }
  try {
    const response = await fetch(new URL('/api/v1/admin/products', api), {
      method: 'POST', headers: { Origin: origin, Cookie: 'eib_admin_session=' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: data.title, slug: data.slug, categoryId: data.categoryId, description: data.description || null }),
      cache: 'no-store',
    });
    if (!response.ok) return NextResponse.json({ error: 'Product not created' }, { status: response.status });
    return NextResponse.json({ created: true }, { status: 201 });
  } catch { return NextResponse.json({ error: 'API unavailable' }, { status: 502 }); }
}
