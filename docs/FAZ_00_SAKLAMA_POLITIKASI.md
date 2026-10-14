# Faz 0 — Saklama ve silme politikası taslağı

Durum: Teknik öneri. Hukuki saklama yükümlülükleri doğrulanmadan üretim politikası olarak uygulanmaz.

## Kayıt sınıfları

| Kayıt | Önerilen süre / olay | İşlem |
| --- | --- | --- |
| Yönetici oturumları | Son kullanma tarihi geçtiğinde | Süresi dolan oturumları sil |
| Affiliate tıklamaları | Son tıklamadan itibaren öneri: 90 gün | Ham tıklama kayıtlarını sil; rapor etkisini değerlendir |
| Yönetici hesabı | Yetki devam ettiği sürece | Yetki kaldırma ve güvenli silme prosedürü |
| Ürün/kategori | Yayın ve editoryal ihtiyaç sürdükçe | İlişkili kayıtları dikkate alarak silme |
| Keşif işi taslakları ve hata kayıtları | Öneri: 90 gün; hukuki/operasyonel gerekçe ayrıca değerlendirilmeli | Tamamlanan/iptal edilen işleri temizleme |
| Web/proxy erişim logları | Henüz bilinmiyor | Barındırma ayarlarını incele ve sınırla |
| Yedekler | Henüz bilinmiyor | Saklama ve geri yükleme süresini belgele |

## Güvenli silme kuralları
- Oturum temizliği, aktif kullanıcı oturumlarını etkilememelidir.
- Tıklama temizliği analitik sayaçlarını değiştirebilir; kullanıcıya geçmiş dönem toplamları kalıcıymış gibi sunulmamalıdır.
- Ham tıklama kayıtlarında kullanıcı kimliği tutulduğu varsayılmamalı; proxy logları ayrıca incelenmelidir.
- Silme işi önce dry-run olarak sayım vermeli; yetkili onayı ve denetim kaydı olmadan üretimde çalışmamalıdır.
- Yedeklerdeki kopyalar ve saklama süreleri ayrıca ele alınmalıdır.

## Kabul
- [x] Kayıt türleri ve taslak süreler belgelendi.
- [ ] Hukuki sebepler ve saklama süreleri yetkili kişi tarafından onaylandı.
- [ ] Üretim log/çerez envanteri doğrulandı.
- [ ] Dry-run, sınırlı silme ve geri dönüş senaryoları test edildi.
- [ ] Silme işlemi için operasyonel yetkilendirme oluşturuldu.

Bu belgedeki 90 günlük süreler **öneridir**, yürürlükteki mevzuatın kesin gereği olarak sunulmaz.
