import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Hakkımızda', description: 'En İyisini Bul ürün keşif platformunun amacı ve çalışma ilkeleri.' };
export default function AboutPage() {
  return <main style={{ maxWidth: 850, margin: 'auto', padding: '48px 24px', lineHeight: 1.8 }}>
    <h1>Hakkımızda</h1>
    <p>En İyisini Bul, ürünleri araştırırken farklı seçenekleri daha anlaşılır biçimde değerlendirmeye yardımcı olmak amacıyla geliştirilen bağımsız bir ürün keşif platformudur.</p>
    <h2>İşletmeci ve iletişim</h2>
    <p>En İyisini Bul, BALANCETECH Bilişim Danışmanlık Ltd. Şti. tarafından işletilmektedir. Adres: Öğretmenler Mahallesi, 2927. Sokak, No: 9/2, Tarsus/Mersin, Türkiye. E-posta: <a href="mailto:muratbalci269@gmail.com">muratbalci269@gmail.com</a>.</p>
    <h2>Nasıl değerlendiriyoruz?</h2>
    <p>Ürünlerin teknik özelliklerini ve kullanım alanlarını karşılaştırılabilir biçimde sunmayı hedefliyoruz. Herkes için geçerli tek bir “en iyi” ürün olduğunu iddia etmiyoruz; ihtiyaçlar kişiden kişiye değişir.</p>
    <h2>Satış ortaklığı açıklaması</h2>
    <p>Bazı mağaza bağlantılarından alışveriş yapıldığında komisyon kazanılabilir. Satış ve ödeme işlemleri yönlendirilen mağazada gerçekleşir. Fiyat, stok, teslimat ve iade koşulları ilgili mağazaya aittir.</p>
    <h2>Bilgilerin güncelliği</h2>
    <p>Ürün özellikleri zaman içinde değişebilir. Satın almadan önce üreticinin güncel teknik belgelerini ve mağazanın ürün sayfasını kontrol etmenizi öneririz.</p>
  </main>;
}
