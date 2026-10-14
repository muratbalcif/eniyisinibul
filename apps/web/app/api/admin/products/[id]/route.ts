import { NextRequest, NextResponse } from 'next/server';

type Context = { params: Promise<{ id: string }> };
export async function DELETE(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const api = process.env.ADMIN_API_INTERNAL_URL;
  const origin = process.env.ADMIN_ALLOWED_ORIGIN;
  const token = request.cookies.get('eib_admin_session')?.value;
  if (!api || !origin) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  if (request.headers.get('origin') !== origin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!/^[a-z0-9]{10,64}$/.test(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  try {
    const upstream = await fetch(new URL('/api/v1/admin/products/' + id, api), { method: 'DELETE', headers: { Origin: origin, Cookie: 'eib_admin_session=' + token }, cache: 'no-store' });
    if (!upstream.ok) return NextResponse.json({ error: 'Delete failed' }, { status: upstream.status });
    return NextResponse.json({ deleted: true });
  } catch { return NextResponse.json({ error: 'API unavailable' }, { status: 502 }); }
}

export async function PATCH(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const api = process.env.ADMIN_API_INTERNAL_URL;
  const origin = process.env.ADMIN_ALLOWED_ORIGIN;
  const token = request.cookies.get('eib_admin_session')?.value;
  if (!api || !origin) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  if (request.headers.get('origin') !== origin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!/^[a-z0-9]{10,64}$/.test(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  const raw = await request.text();
  if (raw.length > 7000) return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  let input: unknown;
  try { input = JSON.parse(raw); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  const data = input as Record<string, unknown>;
  if (typeof data.title !== 'string' || !data.title.trim() || data.title.length > 240 ||
    typeof data.slug !== 'string' || data.slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) ||
    (data.description !== null && data.description !== undefined && (typeof data.description !== 'string' || data.description.length > 5000))) {
    return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
  }
  try {
    const upstream = await fetch(new URL('/api/v1/admin/products/' + id, api), {
      method: 'PATCH', headers: { Origin: origin, Cookie: 'eib_admin_session=' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: data.title, slug: data.slug, description: data.description ?? null, imageUrl: data.imageUrl ?? null }), cache: 'no-store',
    });
    if (!upstream.ok) return NextResponse.json({ error: 'Update failed' }, { status: upstream.status });
    return NextResponse.json({ updated: true });
  } catch { return NextResponse.json({ error: 'API unavailable' }, { status: 502 }); }
}
