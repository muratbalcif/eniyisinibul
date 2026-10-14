import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AffiliateManager from './affiliate-manager';

type Product = { id: string; title: string };
type Result = { items: Product[]; total: number };
type Affiliate = { id: string; url: string; active: boolean; merchant: string };

export default async function AffiliateLinksPage({ searchParams }: { searchParams: Promise<{ productId?: string }> }) {
  const token = (await cookies()).get('eib_admin_session')?.value;
  const api = process.env.ADMIN_API_INTERNAL_URL;
  if (!token || !api) redirect('/admin/login');
  const requestedId = (await searchParams).productId ?? '';
  let products: Product[] = [];
  let links: Affiliate[] = [];
  let failed = false;
  try {
    const response = await fetch(new URL('/api/v1/admin/products?limit=100', api), { headers: { Cookie: 'eib_admin_session=' + token }, cache: 'no-store' });
    if (response.status === 401) redirect('/admin/login');
    if (!response.ok) failed = true;
    else {
      const result = await response.json() as Result;
      products = result.items;
      if (requestedId && products.some(product => product.id === requestedId)) {
        const linkResponse = await fetch(new URL('/api/v1/admin/affiliate-links/product/' + encodeURIComponent(requestedId), api), { headers: { Cookie: 'eib_admin_session=' + token }, cache: 'no-store' });
        if (linkResponse.ok) links = await linkResponse.json() as Affiliate[];
        else failed = true;
      }
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    failed = true;
  }
  return <main style={{ maxWidth: 1000, margin: 'auto', padding: 32 }}>
    <p><Link href="/admin">← Yönetim paneli</Link></p>
    <h1>Affiliate bağlantıları</h1>
    <p>Amazon Türkiye bağlantıları yeni kayıtta pasif başlar.</p>
    {failed ? <p role="alert">Veriler yüklenemedi.</p> : <AffiliateManager products={products} selectedId={products.some(product => product.id === requestedId) ? requestedId : ''} links={links} />}
  </main>;
}
