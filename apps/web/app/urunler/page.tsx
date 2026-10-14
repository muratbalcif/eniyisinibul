import Link from 'next/link';
import CompareSelector from './compare-selector';

type Product = { id: string; slug: string; title: string; description: string | null; imageUrl?: string | null; category: { name: string } };
type Result = { items: Product[]; total: number; page: number; limit: number };
export default async function Products({ searchParams }: { searchParams: Promise<{ category?: string; page?: string; q?: string }> }) {
  const params = await searchParams;
  const category = /^[a-z0-9-]{1,120}$/.test(params.category ?? '') ? params.category! : '';
  const q = (params.q ?? '').trim().slice(0, 100);
  const requested = Number(params.page ?? 1);
  const page = Number.isSafeInteger(requested) && requested > 0 && requested < 10000 ? requested : 1;
  let result: Result | null = null;
  try {
    const api = process.env.ADMIN_API_INTERNAL_URL;
    if (api) {
      const url = new URL('/api/v1/products', api);
      url.searchParams.set('page', String(page));
      url.searchParams.set('limit', '24');
      if (category) url.searchParams.set('category', category);
      if (q) url.searchParams.set('q', q);
      const response = await fetch(url, { next: { revalidate: 300 } });
      if (response.ok) result = await response.json() as Result;
    }
  } catch { /* Show a clear unavailable state */ }
  return <main style={{ maxWidth: 1120, margin: 'auto', padding: '48px 24px' }}>
    <p><Link href="/" style={{ color: '#0f766e' }}>← Ana sayfa</Link></p>
    <h1 style={{ fontSize: 42 }}>Ürünleri keşfet</h1>
    <p style={{ color: '#64748b' }}>İhtiyacına uygun ürünleri incele, özellikleri değerlendir.</p>
    <form action="/urunler" method="get" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '24px 0' }}>
      <input type="search" name="q" defaultValue={q} maxLength={100} placeholder="Ürün veya özellik ara" aria-label="Ürün ara" style={{ flex: '1 1 260px', padding: 14, borderRadius: 10, border: '1px solid #cbd5e1' }} />
      {category && <input type="hidden" name="category" value={category} />}
      <button type="submit" style={{ padding: '12px 24px', background: '#0f766e', color: '#fff', border: 0, borderRadius: 10 }}>Ara</button>
      {(q || category) && <Link href="/urunler" style={{ alignSelf: 'center', color: '#0f766e' }}>Filtreleri temizle</Link>}
    </form>
    <p style={{ color: '#64748b', fontSize: 14 }}>Ürünleri seçerek karşılaştırabilir, detay sayfalarında teknik özelliklerini inceleyebilirsiniz.</p>
    {!result ? <p role="alert">Ürünler şu anda yüklenemiyor.</p> : <>
      <p aria-live="polite">{result.total} ürün bulundu{q ? ' · Arama: ' + q : ''}.</p>
      <CompareSelector products={result.items} />
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18 }}>
        {result.items.map(item => <Link key={item.id} href={'/urunler/' + item.slug} style={{ padding: 24, background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', textDecoration: 'none', color: '#15352e' }}>
          {item.imageUrl && <img src={item.imageUrl} alt={item.title} loading="lazy" style={{ width: '100%', height: 190, objectFit: 'contain' }} />}
          <small style={{ color: '#0f766e' }}>{item.category.name}</small><h2>{item.title}</h2>
          <p style={{ color: '#64748b' }}>{item.description?.slice(0, 180) ?? 'Ürün detaylarını inceleyin.'}</p>
          <strong style={{ color: '#0f766e' }}>İncele →</strong>
        </Link>)}
      </section>
      {!result.items.length && <div style={{ padding: 28, background: '#fff', borderRadius: 16 }}><h2>Aradığınız ürün bulunamadı</h2><p>Farklı kelimeler deneyebilir veya tüm ürünleri inceleyebilirsiniz.</p><Link href="/urunler" style={{ color: '#0f766e' }}>Tüm ürünleri gör →</Link></div>}
      <nav style={{ display: 'flex', gap: 24, marginTop: 32 }}>
        {page > 1 && <Link href={'/urunler?page=' + (page - 1) + (category ? '&category=' + category : '') + (q ? '&q=' + encodeURIComponent(q) : '')}>← Önceki</Link>}
        {page * result.limit < result.total && <Link href={'/urunler?page=' + (page + 1) + (category ? '&category=' + category : '')}>Sonraki →</Link>}
      </nav>
    </>}
  </main>;
}
