import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const api = process.env.ADMIN_API_INTERNAL_URL;
  const origin = process.env.ADMIN_ALLOWED_ORIGIN;
  if (!api || !origin) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  if (request.headers.get('origin') !== origin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const token = request.cookies.get('eib_admin_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  const data = input as Record<string, unknown>;
  if (typeof data.productId !== 'string' || !data.productId || data.productId.length > 64 || data.merchant !== 'amazon-tr' || typeof data.url !== 'string' || data.url.length > 2048) return NextResponse.json({ error: 'Invalid link' }, { status: 400 });
  try {
    const response = await fetch(new URL('/api/v1/admin/affiliate-links', api), {
      method: 'POST', headers: { Origin: origin, Cookie: 'eib_admin_session=' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: data.productId, merchant: 'amazon-tr', url: data.url }), cache: 'no-store',
    });
    return NextResponse.json({ success: response.ok }, { status: response.status });
  } catch { return NextResponse.json({ error: 'API unavailable' }, { status: 502 }); }
}
