import Link from 'next/link';
import LogoutButton from './logout-button';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const sections = [
  { title: 'Ürünler', href: '/admin/products', detail: 'Ürün kayıtları, açıklamalar ve yayın hazırlığı' },
  { title: 'Kategoriler', href: '/admin/categories', detail: 'Kategori listesi ve yeni kategori oluşturma' },
  { title: 'Affiliate bağlantıları', href: '/admin/affiliate-links', detail: 'Mağaza bağlantıları ve durum kontrolü' },
];

export default async function AdminPage() {
  const token = (await cookies()).get('eib_admin_session')?.value;
  const api = process.env.ADMIN_API_INTERNAL_URL;
  if (!token || !api) redirect('/admin/login');
  let valid = false;
  try {
    const response = await fetch(new URL('/api/v1/admin/auth/session', api), {
      headers: { Cookie: 'eib_admin_session=' + token }, cache: 'no-store',
    });
    valid = response.ok;
  } catch { valid = false; }
  if (!valid) redirect('/admin/login');
  type Overview = { products: number; activeLinks: number; clicksToday: number; clicksMonth: number; clicksAll: number; topProducts: { productId: string; title: string; slug: string | null; clicks: number }[]; note: string };
  let overview: Overview | null = null;
  try {
    const result = await fetch(new URL('/api/v1/admin/analytics/overview', api), {
      headers: { Cookie: 'eib_admin_session=' + token }, cache: 'no-store',
    });
    if (result.ok) overview = await result.json() as Overview;
  } catch { /* Analytics unavailable until database migration is applied. */ }
  return (
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px' }}>
      <header style={{ marginBottom: 36 }}>
        <p style={{ color: '#0f766e', fontWeight: 700, letterSpacing: 1 }}>EN İYİSİNİ BUL</p>
        <h1 style={{ fontSize: 38, marginBottom: 8 }}>Yönetim paneli</h1>
        <LogoutButton />
        <p style={{ color: '#64748b' }}>Ürünleri, kategorileri, Amazon bağlantılarını ve yönlendirme performansını buradan yönetin.</p>
      </header>
      <section aria-label="Amazon yönlendirme analitiği" style={{ marginBottom: 36 }}>
        <h2>Performans özeti</h2>
        {overview ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
              {[
                ['Bugünkü Amazon tıklaması', overview.clicksToday],
                ['Bu ay Amazon tıklaması', overview.clicksMonth],
                ['Toplam Amazon tıklaması', overview.clicksAll],
                ['Ürün sayısı', overview.products],
                ['Aktif Amazon bağlantısı', overview.activeLinks],
              ].map(([label, value]) => (
                <article key={label} style={{ padding: 18, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14 }}>
                  <p style={{ color: '#64748b', fontSize: 13 }}>{label}</p>
                  <strong style={{ fontSize: 30 }}>{value}</strong>
                </article>
              ))}
            </div>
            <p style={{ color: '#64748b', fontSize: 13 }}>{overview.note}</p>
            <h3>En çok Amazon'a yönlendiren ürünler</h3>
            {overview.topProducts.length ? (
              <ol>{overview.topProducts.map(item => <li key={item.productId} style={{ padding: '6px 0' }}>{item.title} — {item.clicks} tıklama</li>)}</ol>
            ) : <p>Henüz Amazon yönlendirme kaydı yok.</p>}
          </>
        ) : <p>Analitik henüz kullanılamıyor. Veritabanı migration ve API durumunu kontrol edin.</p>}
        <p>Gerçek siparişler ve komisyonlar: Amazon Gelir Ortaklığı rapor entegrasyonu bekleniyor.</p>
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 18 }}>
        {sections.map(section => (
          <article key={section.title} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 18, padding: 24 }}>
            <h2 style={{ fontSize: 20 }}>{section.title}</h2>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>{section.detail}</p>
            <Link href={section.href} style={{ color: '#0f766e', fontSize: 14 }}>Yönet →</Link>
          </article>
        ))}
      </section>
      <p style={{ marginTop: 32 }}><Link href="/">Ana sayfaya dön</Link></p>
    </main>
  );
}
