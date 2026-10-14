import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Gizlilik Bilgilendirmesi', description: 'En İyisini Bul gizlilik ve veri işleme bilgilendirmesi.' };
export default function PrivacyPage() {
  return <main style={{ maxWidth: 850, margin: 'auto', padding: '48px 24px', lineHeight: 1.8 }}>
    <h1>Gizlilik bilgilendirmesi</h1>
    <h2>İşletmeci ve iletişim</h2><p>BALANCETECH Bilişim Danışmanlık Ltd. Şti. — Öğretmenler Mahallesi, 2927. Sokak, No: 9/2, Tarsus/Mersin, Türkiye. İletişim: <a href="mailto:muratbalci269@gmail.com">muratbalci269@gmail.com</a>.</p>
    <p>Bu sayfa, platformun mevcut işleyişine ilişkin ön bilgilendirme niteliğindedir. Yayına alınmadan önce veri sorumlusu kimliği, iletişim bilgileri ve gerçek veri işleme süreçleri doğrulanarak nihai KVKK aydınlatma metni hazırlanmalıdır.</p>
    <h2>Ürün keşfi</h2><p>Ürünleri incelemek ve karşılaştırmak için ziyaretçi hesabı açılması gerekmez. Arama terimleri ürün listeleme isteğinde kullanılabilir.</p>
    <h2>Yönlendirme tıklamaları</h2><p>Etkin mağaza bağlantısına tıklandığında ürün ve bağlantı kimlikleriyle bir tıklama kaydı oluşturulur. Bu kayıt yönlendirmelerin toplu olarak değerlendirilmesi amacıyla kullanılır; tek başına satış veya kazanç kanıtı değildir.</p>
    <h2>Mağaza bağlantıları</h2><p>Mağazaya geçişte üçüncü tarafın kendi gizlilik ve çerez uygulamaları geçerli olabilir. Satış ortaklığı bağlantıları kullanılabilir.</p>
    <h2>Çerezler ve analitik</h2><p>Yönetici oturumlarında güvenlik amaçlı oturum çerezi kullanılır. Ziyaretçi analitiği ve diğer üçüncü taraf hizmetleri yayına alınmadan önce ayrıca değerlendirilecektir.</p>
    <h2>İlgili kişi başvuruları</h2><p>Kişisel verilerin işlenmesine ilişkin sorularınızı ve KVKK kapsamındaki taleplerinizi <a href="mailto:muratbalci269@gmail.com">muratbalci269@gmail.com</a> adresine iletebilirsiniz. Başvuruların değerlendirilmesinde yürürlükteki mevzuat esas alınır.</p>
    <h2>Güncellemeler</h2><p>Bu bilgilendirme, hizmetin kapsamı değiştikçe gözden geçirilecektir.</p>
  </main>;
}
