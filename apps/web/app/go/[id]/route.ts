import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-z0-9]{10,64}$/.test(id)) return new NextResponse('Bağlantı bulunamadı.', { status: 404 });
  const api = process.env.ADMIN_API_INTERNAL_URL;
  if (!api) return new NextResponse('Mağaza bağlantısı kullanılamıyor.', { status: 503 });
  try {
    const upstream = await fetch(new URL('/api/v1/go/' + id, api), { redirect: 'manual', cache: 'no-store' });
    if (upstream.status !== 302) return new NextResponse('Bağlantı kullanılamıyor.', { status: upstream.status === 404 ? 404 : 502 });
    const target = upstream.headers.get('location');
    if (!target) return new NextResponse('Bağlantı kullanılamıyor.', { status: 502 });
    const destination = new URL(target);
    if (destination.protocol !== 'https:' || !['amazon.com.tr', 'www.amazon.com.tr'].includes(destination.hostname.toLowerCase()) || destination.username || destination.password || destination.port) return new NextResponse('Geçersiz mağaza adresi.', { status: 502 });
    const response = NextResponse.redirect(destination, 302);
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Referrer-Policy', 'no-referrer');
    return response;
  } catch { return new NextResponse('Bağlantı kullanılamıyor.', { status: 502 }); }
}
