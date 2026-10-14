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
