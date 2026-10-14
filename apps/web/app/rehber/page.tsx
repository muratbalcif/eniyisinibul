import Link from 'next/link';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Anne ve Bebek Satın Alma Rehberi', description: 'Bebek arabası, oto koltuğu ve bebek monitörü seçerken değerlendirilmesi gereken temel özellikler.' };
const guides = [
  { title: 'Bebek arabası seçerken', slug: 'bebek-arabasi', intro: 'Günlük kullanım, katlanma kolaylığı ve taşıma kapasitesi gibi kriterlere odaklanın.', points: ['Ürünün kullanım yaş ve ağırlık sınırını kontrol edin.', 'Katlanmış ölçülerini ev, asansör ve araç bagajıyla karşılaştırın.', 'Fren, kemer ve tekerlek yapısını kullanım koşullarına göre değerlendirin.'] },
  { title: 'Oto koltuğu seçerken', slug: 'oto-koltugu', intro: 'Çocuğun boyuna, ağırlığına ve aracınıza uyum en önemli değerlendirme noktalarıdır.', points: ['Güncel güvenlik onayını ve ürünün kullanım aralığını doğrulayın.', 'Aracınızla montaj uyumluluğunu üretici belgelerinden kontrol edin.', 'Kurulum talimatlarına uyun; ikinci el ürünlerde kaza geçmişini araştırın.'] },
  { title: 'Bebek monitörü seçerken', slug: 'bebek-monitoru', intro: 'Görüntü kalitesi kadar bağlantı güvenliği ve kullanım kolaylığı da önemlidir.', points: ['Wi-Fi gereksinimini ve bağlantı türünü karşılaştırın.', 'Şifreleme, yazılım güncellemeleri ve hesap güvenliğini inceleyin.', 'Pil süresi, gece görüşü ve kapsama alanını ihtiyaçlarınıza göre değerlendirin.'] },
];
export default function GuidePage() {
  return <main style={{ maxWidth: 1120, margin: 'auto', padding: '48px 24px', color: '#15352e' }}>
    <p><Link href="/" style={{ color: '#0f766e' }}>← Ana sayfa</Link></p>
    <p style={{ color: '#0f766e', fontWeight: 700 }}>ALIŞVERİŞ REHBERİ</p>
    <h1 style={{ fontSize: 'clamp(34px,5vw,52px)' }}>Anne ve bebek ürünleri nasıl seçilir?</h1>
    <p style={{ color: '#64748b', lineHeight: 1.7, maxWidth: 720 }}>Tek bir ürün herkes için en iyi seçenek olmayabilir. Karar verirken güvenlik, kullanım alışkanlıkları ve bütçenizi birlikte değerlendirin.</p>
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginTop: 36 }}>
      {guides.map(guide => <article key={guide.slug} style={{ padding: 28, background: '#fff', border: '1px solid #e0eae5', borderRadius: 18 }}>
        <h2 style={{ fontSize: 24 }}>{guide.title}</h2><p style={{ color: '#64748b', lineHeight: 1.6 }}>{guide.intro}</p>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>{guide.points.map(point => <li key={point}>{point}</li>)}</ul>
        <Link href={'/urunler?q=' + encodeURIComponent(guide.slug.replaceAll('-', ' '))} style={{ color: '#0f766e', fontWeight: 700 }}>İlgili ürünleri ara →</Link>
      </article>)}
    </section>
    <p style={{ marginTop: 36, color: '#64748b' }}>Bu içerikler genel bilgilendirme amaçlıdır. Ürünlerin güncel güvenlik ve kullanım talimatları için üretici belgelerini esas alın.</p>
  </main>;
}
