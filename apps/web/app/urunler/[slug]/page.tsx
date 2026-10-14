import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Product = { id: string; title: string; slug: string; description: string | null; imageUrl?: string | null; specifications?: Record<string, string> | null; category: { name: string; slug: string }; links: { id: string; merchant: string }[] };
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { title: 'Ürün bulunamadı' };
  const api = process.env.ADMIN_API_INTERNAL_URL;
  if (!api) return { title: 'Ürün detayı' };
  try {
    const response = await fetch(new URL('/api/v1/products/' + encodeURIComponent(slug), api), { next: { revalidate: 300 } });
    if (!response.ok) return { title: 'Ürün detayı' };
    const product = await response.json() as Product;
    return { title: product.title, description: product.description?.slice(0, 155) || product.title, openGraph: { title: product.title, description: product.description?.slice(0, 155) || product.title, type: 'website', ...(product.imageUrl ? { images: [{ url: product.imageUrl, alt: product.title }] } : {}) } };
  } catch { return { title: 'Ürün detayı' }; }
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) notFound();
  let product: Product | null = null;
  try {
    const api = process.env.ADMIN_API_INTERNAL_URL;
    if (api) {
      const response = await fetch(new URL('/api/v1/products/' + encodeURIComponent(slug), api), { next: { revalidate: 300 } });
      if (response.status === 404) notFound();
      if (response.ok) product = await response.json() as Product;
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
  }
  if (!product) return <main style={{ maxWidth: 920, margin: 'auto', padding: 48 }}><p role="alert">Ürün bilgisi şu anda yüklenemiyor.</p><Link href="/urunler">Ürünlere dön</Link></main>;
  return <main style={{ maxWidth: 920, margin: 'auto', padding: '48px 24px' }}>
    <p><Link href="/urunler" style={{ color: '#0f766e' }}>← Tüm ürünler</Link></p>
    <p style={{ color: '#0f766e', fontWeight: 700 }}>{product.category.name}</p>
    <h1 style={{ fontSize: 'clamp(34px,5vw,54px)' }}>{product.title}</h1>
    {product.imageUrl && <img src={product.imageUrl} alt={product.title} style={{ width: '100%', maxHeight: 430, objectFit: 'contain' }} />}
    <section style={{ padding: 30, background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', lineHeight: 1.8 }}>
      <h2>Ürün hakkında</h2>
      <p style={{ whiteSpace: 'pre-wrap' }}>{product.description ?? 'Bu ürünün açıklaması henüz eklenmedi.'}</p>
    </section>
    {product.specifications && Object.keys(product.specifications).length > 0 && <section style={{ marginTop: 30, padding: 24, background: '#fff', borderRadius: 16 }}><h2>Teknik özellikler</h2><dl>{Object.entries(product.specifications).map(([key, value]) => <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid #e2e8f0', padding: '12px 0' }}><dt>{key}</dt><dd style={{ margin: 0, fontWeight: 600 }}>{value}</dd></div>)}</dl></section>}
    <section style={{ marginTop: 36 }}>
      <h2>Mağaza seçenekleri</h2>
      <p style={{ color: '#64748b' }}>Yalnızca doğrulanmış ve aktif mağaza bağlantıları gösterilir. Bazı bağlantılar satış ortaklığı kapsamında olabilir.</p>
      {product.links.length ? <div style={{ display: 'grid', gap: 12 }}>{product.links.map(link => <a key={link.id} href={'/go/' + link.id} target="_blank" rel="sponsored noopener noreferrer" style={{ display: 'block', padding: 18, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#0f766e', fontWeight: 700 }}>Amazon Türkiye mağazasına git ↗</a>)}</div> : <p>Henüz aktif mağaza bağlantısı bulunmuyor.</p>}
    </section>
  </main>;
}
