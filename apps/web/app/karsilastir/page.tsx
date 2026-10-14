import Link from 'next/link';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Ürün karşılaştırma', robots: { index: false, follow: true } };
type Product = { id: string; title: string; slug: string; imageUrl?: string | null; specifications?: Record<string,string> | null };
export default async function Compare({ searchParams }: { searchParams: Promise<{ urunler?: string }> }) {
  const { urunler } = await searchParams;
  const slugs = [...new Set((urunler ?? '').split(',').filter(s => /^[a-z0-9-]{1,120}$/.test(s)))].slice(0,3);
  const api = process.env.ADMIN_API_INTERNAL_URL;
  const products: Product[] = [];
  if (api) for (const slug of slugs) {
    try {
      const response = await fetch(new URL('/api/v1/products/' + slug, api), { next: { revalidate: 300 } });
      if (response.ok) products.push(await response.json() as Product);
    } catch { /* Ignore unavailable products */ }
  }
  const keys = [...new Set(products.flatMap(p => Object.keys(p.specifications ?? {})))];
  return <main style={{ maxWidth: 1100, margin: 'auto', padding: 32 }}>
    <p><Link href="/urunler">Ürünlere dön</Link></p><h1>Ürün karşılaştırma</h1>
    {products.length < 2 ? <p>Karşılaştırmak için en az iki ürün seçin.</p> :
      <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse' }}>
        <thead><tr><th>Özellik</th>{products.map(p => <th key={p.id} style={{ padding: 16, minWidth: 180 }}>{p.imageUrl && <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: 130, objectFit: 'contain' }} />}<p><Link href={'/urunler/' + p.slug}>{p.title}</Link></p></th>)}</tr></thead>
        <tbody>{keys.map(key => <tr key={key}><th style={{ textAlign: 'left', padding: 14, borderTop: '1px solid #e2e8f0' }}>{key}</th>{products.map(p => <td key={p.id} style={{ padding: 14, borderTop: '1px solid #e2e8f0' }}>{p.specifications?.[key] ?? '—'}</td>)}</tr>)}</tbody>
      </table>{!keys.length && <p>Teknik özellikler henüz girilmemiş.</p>}</div>}
  </main>;
}
