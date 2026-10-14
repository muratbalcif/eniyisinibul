import Link from 'next/link';

type Category = { id: string; slug: string; name: string };
type Product = { id: string; slug: string; title: string; description: string | null; imageUrl?: string | null; category: { name: string; slug: string } };
type ProductResult = { items: Product[]; total: number };

async function catalog() {
  const api = process.env.ADMIN_API_INTERNAL_URL;
  if (!api) return { categories: [] as Category[], products: [] as Product[], available: false };
  try {
    const [categoriesResponse, productsResponse] = await Promise.all([
      fetch(new URL('/api/v1/categories', api), { next: { revalidate: 300 } }),
      fetch(new URL('/api/v1/products?limit=6', api), { next: { revalidate: 300 } }),
    ]);
    if (!categoriesResponse.ok || !productsResponse.ok) throw new Error('Catalog unavailable');
    const categories = await categoriesResponse.json() as Category[];
    const result = await productsResponse.json() as ProductResult;
    return { categories, products: result.items, available: true };
  } catch { return { categories: [] as Category[], products: [] as Product[], available: false }; }
}

export default async function Home() {
  const { categories, products, available } = await catalog();
  return <main style={{ minHeight: '100vh', background: '#f8faf9', color: '#15352e' }}>
    <header style={{ borderBottom: '1px solid #e2ebe7', background: '#fff' }}>
      <div style={{ maxWidth: 1180, margin: 'auto', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: '#0f766e', textDecoration: 'none', fontWeight: 800, fontSize: 22 }}>eniyisinibul<span style={{ color: '#f97316' }}>.</span></Link>
        <nav aria-label="Ana menü" style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          <Link href="/urunler" style={{ color: '#34564c' }}>Tüm ürünler</Link>
          <Link href="#kategoriler" style={{ color: '#34564c' }}>Kategoriler</Link>
          <Link href="#urunler" style={{ color: '#34564c' }}>Ürünler</Link>
          <Link href="/rehber" style={{ color: '#34564c' }}>Satın alma rehberi</Link>
          <Link href="#nasil-calisir" style={{ color: '#34564c' }}>Nasıl çalışır?</Link>
        </nav>
      </div>
    </header>
    <section style={{ background: 'linear-gradient(135deg,#e8f6f0 0%,#fff6e9 100%)', padding: '90px 24px 100px' }}>
      <div style={{ maxWidth: 1180, margin: 'auto' }}>
        <p style={{ color: '#0f766e', fontWeight: 800, letterSpacing: 1.5 }}>DAHA BİLİNÇLİ ALIŞVERİŞ</p>
        <h1 style={{ fontSize: 'clamp(40px,6vw,72px)', maxWidth: 800, lineHeight: 1.09, letterSpacing: '-0.045em', margin: '18px 0 24px' }}>Çok seçenek arasında <span style={{ color: '#0f766e' }}>sana uygun olanı</span> bul.</h1>
        <p style={{ fontSize: 20, maxWidth: 660, color: '#48645b', lineHeight: 1.7 }}>Ürün özelliklerini sadeleştiriyoruz. İhtiyacına, kullanım alışkanlıklarına ve bütçene göre daha bilinçli karar vermene yardımcı oluyoruz.</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap' }}>
          <Link href="#urunler" style={{ background: '#0f766e', color: '#fff', padding: '15px 24px', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>Ürünleri keşfet →</Link>
          <Link href="#nasil-calisir" style={{ background: '#fff', color: '#0f766e', padding: '15px 24px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, border: '1px solid #c9dfd5' }}>Nasıl çalışır?</Link>
        </div>
      </div>
    </section>
    <section style={{ maxWidth: 1180, margin: 'auto', padding: '32px 24px 0' }}><form action="/urunler" method="get" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: 20, background: '#fff', border: '1px solid #dce9e2', borderRadius: 16 }}><input name="q" type="search" maxLength={100} placeholder="Hangi ürünü arıyorsunuz?" aria-label="Ürün ara" style={{ flex: '1 1 260px', padding: 14, border: '1px solid #cbd5e1', borderRadius: 10 }} /><button type="submit" style={{ padding: '14px 26px', border: 0, borderRadius: 10, background: '#0f766e', color: '#fff', fontWeight: 700 }}>Ürün ara</button></form></section>
    <section id="kategoriler" style={{ maxWidth: 1180, margin: 'auto', padding: '70px 24px 24px' }}>
      <p style={{ color: '#0f766e', fontWeight: 700 }}>KEŞFET</p>
      <h2 style={{ fontSize: 34, margin: '8px 0 12px' }}>İhtiyacına göre keşfet</h2>
      <p style={{ color: '#64766f' }}>İlk odağımız anne ve bebek ürünleri. Kategori içerikleri geliştikçe burada yer alacak.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16, marginTop: 26 }}>
        {categories.length ? categories.map(category => <Link key={category.id} href={'/urunler?category=' + encodeURIComponent(category.slug)} style={{ padding: 28, background: '#fff', border: '1px solid #e0eae5', borderRadius: 18, color: '#15352e', textDecoration: 'none' }}><span style={{ fontSize: 26 }}>✦</span><h3>{category.name}</h3><span style={{ color: '#0f766e' }}>Ürünleri incele →</span></Link>) :
          <div style={{ padding: 28, background: '#fff', border: '1px solid #e0eae5', borderRadius: 18 }}><span style={{ fontSize: 30 }}>♡</span><h3>Anne & Bebek</h3><p style={{ color: '#64766f' }}>Kategori içerikleri hazırlanıyor.</p></div>}
      </div>
    </section>
    <section id="urunler" style={{ maxWidth: 1180, margin: 'auto', padding: '60px 24px 80px' }}>
      <p style={{ color: '#0f766e', fontWeight: 700 }}>ÜRÜN REHBERİ</p>
      <h2 style={{ fontSize: 34, margin: '8px 0 24px' }}>Son eklenen ürünler</h2>
      {products.length ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18 }}>{products.map(product => <Link href={'/urunler/' + product.slug} key={product.id} style={{ background: '#fff', border: '1px solid #e0eae5', borderRadius: 18, padding: 26, textDecoration: 'none', color: '#15352e' }}>{product.imageUrl && <img src={product.imageUrl} alt={product.title} loading="lazy" style={{ width: '100%', height: 180, objectFit: 'contain', marginBottom: 12 }} />}
          <p style={{ color: '#0f766e', fontSize: 13, fontWeight: 700 }}>{product.category.name}</p><h3 style={{ fontSize: 21 }}>{product.title}</h3><p style={{ color: '#64766f', lineHeight: 1.6 }}>{product.description ? product.description.slice(0, 160) : 'Ürün detaylarını inceleyin.'}</p><span style={{ color: '#0f766e', fontWeight: 700 }}>Detayları gör →</span></Link>)}</div> : <div style={{ background: '#fff', padding: 28, borderRadius: 18, border: '1px solid #e0eae5' }}>{available ? 'Henüz yayınlanmış ürün bulunmuyor.' : 'Ürün listesi şu anda yüklenemiyor.'}</div>}
      <p style={{ marginTop: 28 }}><Link href="/urunler" style={{ color: '#0f766e', fontWeight: 700 }}>Tüm ürünleri görüntüle →</Link></p>
    </section>
    <section id="nasil-calisir" style={{ background: '#eaf4ef', padding: '70px 24px' }}><div style={{ maxWidth: 1180, margin: 'auto' }}><h2 style={{ fontSize: 34 }}>Nasıl çalışır?</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}><div><h3>01 · İhtiyacını belirle</h3><p>Önceliklerini ve kullanım amacını netleştir.</p></div><div><h3>02 · Özellikleri incele</h3><p>Ürün bilgilerini anlaşılır bir şekilde değerlendir.</p></div><div><h3>03 · Kararını ver</h3><p>Mağaza bağlantılarına geçmeden önce seçenekleri gözden geçir.</p></div></div></div></section>
    <footer style={{ maxWidth: 1180, margin: 'auto', padding: '36px 24px', color: '#64766f' }}><strong>eniyisinibul.</strong><p>Bağımsız ürün keşif platformu. Bazı mağaza bağlantıları satış ortaklığı bağlantısı olabilir.</p></footer>
  </main>;
}
