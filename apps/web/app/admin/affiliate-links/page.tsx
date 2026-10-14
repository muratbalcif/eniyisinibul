import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

type Product = { id: string; title: string };
type Result = { items: Product[] };
export default async function AffiliateLinksPage() {
  const token = (await cookies()).get('eib_admin_session')?.value;
  const api = process.env.ADMIN_API_INTERNAL_URL;
  if (!token || !api) redirect('/admin/login');
  let products: Product[] = [];
  let error = false;
  try {
    const response = await fetch(new URL('/api/v1/admin/products?limit=100', api), { headers: { Cookie: 'eib_admin_session=' + token }, cache: 'no-store' });
    if (response.ok) products = (await response.json() as Result).items;
    else error = true;
  } catch { error = true; }
  return <main style={{ maxWidth: 1000, margin: 'auto', padding: 32 }}>
    <p><Link href="/admin">← Yönetim paneli</Link></p>
    <h1>Affiliate bağlantıları</h1>
    <p>Amazon Türkiye bağlantıları ürün bazında yönetilecek.</p>
    {error ? <p role="alert">Ürünler yüklenemedi.</p> : <ul>{products.map(product => <li key={product.id}>{product.title}</li>)}</ul>}
  </main>;
}
