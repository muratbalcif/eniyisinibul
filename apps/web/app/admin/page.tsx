import Link from 'next/link';

const sections = [
  { title: 'Ürünler', detail: 'Ürün kayıtları, açıklamalar ve yayın hazırlığı' },
  { title: 'Kategoriler', detail: 'Kategori hiyerarşisi ve düzenleme' },
  { title: 'Affiliate bağlantıları', detail: 'Mağaza bağlantıları ve durum kontrolü' },
];

export default function AdminPage() {
  return (
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px' }}>
      <header style={{ marginBottom: 36 }}>
        <p style={{ color: '#0f766e', fontWeight: 700, letterSpacing: 1 }}>EN İYİSİNİ BUL</p>
        <h1 style={{ fontSize: 38, marginBottom: 8 }}>Yönetim paneli</h1>
        <p style={{ color: '#64748b' }}>Bu ekran geliştirme önizlemesidir; yönetim işlemleri henüz etkin değil.</p>
      </header>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 18 }}>
        {sections.map(section => (
          <article key={section.title} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 18, padding: 24 }}>
            <h2 style={{ fontSize: 20 }}>{section.title}</h2>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>{section.detail}</p>
            <span style={{ color: '#0f766e', fontSize: 14 }}>Yakında</span>
          </article>
        ))}
      </section>
      <p style={{ marginTop: 32 }}><Link href="/">Ana sayfaya dön</Link></p>
    </main>
  );
}
