import Link from 'next/link';
import { notFound } from 'next/navigation';

type Product = { id: string; title: string; slug: string; description: string | null; category: { name: string; slug: string }; links: { id: string; merchant: string }[] };
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
    <section style={{ padding: 30, background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', lineHeight: 1.8 }}>
      <h2>Ürün hakkında</h2>
      <p style={{ whiteSpace: 'pre-wrap' }}>{product.description ?? 'Bu ürünün açıklaması henüz eklenmedi.'}</p>
    </section>
    <section style={{ marginTop: 36 }}>
      <h2>Mağaza seçenekleri</h2>
      <p style={{ color: '#64748b' }}>Yalnızca doğrulanmış ve aktif mağaza bağlantıları gösterilir. Bazı bağlantılar satış ortaklığı kapsamında olabilir.</p>
      {product.links.length ? <p>Bu ürün için {product.links.length} aktif mağaza seçeneği bulunuyor. Bağlantı yönlendirmeleri yakında açılacak.</p> : <p>Henüz aktif mağaza bağlantısı bulunmuyor.</p>}
    </section>
  </main>;
}
