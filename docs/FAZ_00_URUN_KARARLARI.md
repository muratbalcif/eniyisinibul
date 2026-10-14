# Faz 0 — Ürün stratejisi ve yayın kuralları

Durum: GELİŞTİRİLİYOR. Bu belge uygulama kararlarını ve yayından önce doğrulanması gereken koşulları ayırır.

## 0.1 Ürün ve hedef kitle
- Ürün: **En İyisini Bul**, Türkiye odaklı bağımsız ürün keşfi ve karşılaştırma sitesi.
- İlk yayın kategorisi: **Anne & Bebek**. Diğer kategoriler ancak editoryal hazırlık ve veri kalitesi sağlandıktan sonra açılır.
- Kullanıcı, hesap açmadan ürünleri araştırabilir, karşılaştırabilir ve Amazon Türkiye'ye yönlendirilebilir.
- Site satıcı değildir; ödeme, teslimat, stok ve iade işlemleri Amazon/ilgili satıcı tarafındadır.
- Amaç karar desteğidir; mutlak veya kanıtlanmamış “en iyi ürün” iddiası değildir.

## 0.2 İşletmeci ve veri sorumlusu
- Projenin işletmecisi: **BALANCETECH Bilişim Danışmanlık Ltd. Şti.** (proje sahibinin beyanı).
- KVKK metninde veri sorumlusu sıfatı, şirketin fiilî veri işleme rolü ve güncel sicil bilgileriyle doğrulanacaktır.
- Proje için bildirilen iletişim e-postası: **muratbalci269@gmail.com**. Şirketin resmî iletişim adresi olarak kullanılacağı proje sahibi tarafından ayrıca doğrulanmalıdır.
- Proje sahibinin bildirdiği şirket adresi: **Öğretmenler Mahallesi, 2927. Sokak, No: 9/2, Tarsus/Mersin, Türkiye**. Resmî sicil kaydıyla eşleşmesi yayından önce doğrulanacaktır.
- Gerekli şirket tanımlayıcıları henüz sağlanmadı; tahmin edilmez.

## 0.3 Gelir modeli ve bağımsızlık
- Başlangıç modeli Amazon Türkiye Gelir Ortaklığı yönlendirmeleridir.
- Satış ortaklığı ilişkisi kullanıcıya açıkça belirtilir; yönlendirme bağlantısı bir satış garantisi değildir.
- Affiliate komisyonu ürün sıralamasını otomatik olarak belirlemez. Sıralama ve editoryal öneri gerekçeleri açıklanabilir olmalıdır.
- Site ölçtüğü yönlendirme tıklamalarını, Amazon tarafından doğrulanmış satış veya kazanç olarak sunmaz.

## 0.4 Ürün kaynağı ve veri kalitesi
- Ürünler manuel olarak veya **yalnızca yetkili/resmî Amazon API erişimiyle** keşfedilebilir.
- Amazon sayfalarını izinsiz scraping ile toplama, resim veya fiyatları lisanssız kopyalama yapılmaz.
- ASIN tekilliği kontrol edilir; mevcut ürünün üzerine izinsiz veri yazılmaz.
- Başlık, açıklama, teknik özellik, görsel ve fiyatın kaynağı/son güncellemesi ileride kayıt altına alınır.
- Fiyat, stok, değerlendirme ve görseller için Amazon'un yürürlükteki lisans, önbellek, gösterim ve atıf koşulları ayrıca doğrulanır.
- Kaynağı doğrulanamayan ürün alanları uydurulmaz; eksik alanlar boş bırakılır veya kullanıcıya açıklanır.

## 0.5 Otomatik keşif ve yayın ilkeleri
- Kategori bazlı keşif hedefi: 100/200/500 ürün; bu sayılar **hedef**, sonuç garantisi değildir.
- Keşif, içe aktarma, güncelleme ve yayın ayrı aşamalardır.
- Yeni otomatik keşfedilen ürünler öncelikle **taslak** olmalıdır; yönetici onayı olmadan yayımlanmaz.
- Affiliate bağlantıları başlangıçta pasiftir; yönetici doğrulamasından sonra etkinleşir.
- API erişimi olsa bile otomatik iş başlatma ayrı **START** onayı ve sunucu tarafı etkinleştirme kilidi gerektirir.
- Hata, kota, kısmi sonuç ve iptal durumları izlenebilir olmalıdır; aynı işin tekrar çalışması kopya ürün üretmemelidir.

## 0.6 Kullanıcı deneyimi
- İlk akış: kategori keşfi → ürün listesi → ürün detayı → karşılaştırma → mağazaya geçiş.
- Ürünleri karşılaştırmak için hesap açma zorunluluğu yoktur.
- Mobil uyum, erişilebilirlik, açık kaynak/affiliate bilgilendirmesi ve hızlı sayfa yükleme temel gereksinimlerdir.
- Amazon'a geçiş, site dışına yönlendirme olarak anlaşılır olmalıdır.

## 0.7 Hukuki ve editoryal kontrol — yayından önce zorunlu
- Veri sorumlusu/işletme bilgileri ve iletişim adresi kesinleştirilmeli.
- KVKK aydınlatma metni, gerçek veri akışlarına göre hukuk incelemesinden geçirilmeli.
- Çerez/analitik kullanımı için gereken bilgilendirme ve tercihler uygulanmalı.
- Amazon Türkiye Gelir Ortaklığı programının güncel açıklama, marka, fiyat ve görsel kuralları kontrol edilmeli.
- Çocuk/bebek güvenliğiyle ilgili iddialar doğrulanmalı; sağlık veya güvenlik garantisi verilmemeli.
- Mevcut `/gizlilik` metni açıkça ön bilgilendirme niteliğindedir; nihai yasal onay değildir.

## 0.8 Yayın ve geliştirme kapıları
- Fazlar sırasıyla ilerler. Her faz için kod incelemesi, test ve açık işlerin kapanması gerekir.
- **VPS deployment son fazdır.** Öncesinde yerel build, migration, entegrasyon ve E2E testleri tamamlanır.
- Amazon API onayı tek başına START değildir; ayrı operatör kararı gerekir.
- Üretim sırları GitHub'a eklenmez.

## Faz 0 kabul listesi
- [x] Ürün amacı, hedef kullanıcı ve ilk kategori belgelendi.
- [x] Gelir modeli ve affiliate şeffaflığı kuralı belgelendi.
- [x] Otomatik keşif ve yayın onayı ilkeleri belgelendi.
- [x] Yetkili veri kaynağı ve sahte veri yasağı belgelendi.
- [ ] Amazon'un güncel program koşulları yetkili kaynak üzerinden doğrulandı.
- [x] İşletmeci şirketin unvanı proje sahibi tarafından doğrulandı.
- [x] Proje iletişim e-posta adresi alındı.
- [x] Şirket adresi proje sahibi tarafından bildirildi.
- [ ] Adresin sicil kaydıyla eşleşmesi ve veri sorumlusu sıfatı doğrulandı.
- [ ] Nihai KVKK, çerez ve affiliate metinleri hukuk/uyum açısından onaylandı.
- [ ] Faz 0 ürün kararları proje sahibi tarafından onaylandı.

Faz 0 **henüz tamamlanmadı**; açık maddeler kapatılmadan Faz 1'e geçilmez.
