import { NextRequest, NextResponse } from 'next/server';
type Context = { params: Promise<{ id: string }> };
async function proxy(request: NextRequest, context: Context, method: 'PATCH' | 'DELETE') {
  const api = process.env.ADMIN_API_INTERNAL_URL;
  const origin = process.env.ADMIN_ALLOWED_ORIGIN;
  const token = request.cookies.get('eib_admin_session')?.value;
  if (!api || !origin) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  if (request.headers.get('origin') !== origin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await context.params;
  if (!/^[a-z0-9]{10,64}$/.test(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  let body: string | undefined;
  if (method === 'PATCH') {
    const raw = await request.text();
    if (raw.length > 1024) return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    let input: unknown;
    try { input = JSON.parse(raw); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
    if (!input || typeof input !== 'object' || Array.isArray(input)) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    const data = input as Record<string, unknown>;
    if (typeof data.active !== 'boolean') return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    body = JSON.stringify({ active: data.active });
  }
  try {
    const response = await fetch(new URL('/api/v1/admin/affiliate-links/' + id, api), {
      method, headers: { Origin: origin, Cookie: 'eib_admin_session=' + token, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body, cache: 'no-store',
    });
    return NextResponse.json({ success: response.ok }, { status: response.status });
  } catch { return NextResponse.json({ error: 'API unavailable' }, { status: 502 }); }
}
export async function PATCH(request: NextRequest, context: Context) { return proxy(request, context, 'PATCH'); }
export async function DELETE(request: NextRequest, context: Context) { return proxy(request, context, 'DELETE'); }
