import Link from 'next/link';

type Product = { id: string; slug: string; title: string; description: string | null; category: { name: string } };
type Result = { items: Product[]; total: number; page: number; limit: number };
export default async function Products({ searchParams }: { searchParams: Promise<{ category?: string; page?: string }> }) {
  const params = await searchParams;
  const category = /^[a-z0-9-]{1,120}$/.test(params.category ?? '') ? params.category! : '';
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
      const response = await fetch(url, { next: { revalidate: 300 } });
      if (response.ok) result = await response.json() as Result;
    }
  } catch { /* Show a clear unavailable state */ }
  return <main style={{ maxWidth: 1120, margin: 'auto', padding: '48px 24px' }}>
    <p><Link href="/" style={{ color: '#0f766e' }}>← Ana sayfa</Link></p>
    <h1 style={{ fontSize: 42 }}>Ürünleri keşfet</h1>
    <p style={{ color: '#64748b' }}>İhtiyacına uygun ürünleri incele, özellikleri değerlendir.</p>
    {!result ? <p role="alert">Ürünler şu anda yüklenemiyor.</p> : <>
      <p>{result.total} ürün bulundu.</p>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18 }}>
        {result.items.map(item => <Link key={item.id} href={'/urunler/' + item.slug} style={{ padding: 24, background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', textDecoration: 'none', color: '#15352e' }}>
          <small style={{ color: '#0f766e' }}>{item.category.name}</small><h2>{item.title}</h2>
          <p style={{ color: '#64748b' }}>{item.description?.slice(0, 180) ?? 'Ürün detaylarını inceleyin.'}</p>
          <strong style={{ color: '#0f766e' }}>İncele →</strong>
        </Link>)}
      </section>
      {!result.items.length && <p>Bu kategoride henüz ürün bulunmuyor.</p>}
      <nav style={{ display: 'flex', gap: 24, marginTop: 32 }}>
        {page > 1 && <Link href={'/urunler?page=' + (page - 1) + (category ? '&category=' + category : '')}>← Önceki</Link>}
        {page * result.limit < result.total && <Link href={'/urunler?page=' + (page + 1) + (category ? '&category=' + category : '')}>Sonraki →</Link>}
      </nav>
    </>}
  </main>;
}
