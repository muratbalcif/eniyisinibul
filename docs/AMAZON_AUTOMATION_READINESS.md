# Amazon otomatik katalog: START öncesi hazırlık

## Mevcut durum
- `/admin/amazon` kategori, hedef adet ve yerel kategori seçimini gösterir.
- Taslak keşif işleri `AmazonDiscoveryJob` tablosunda `DRAFT` olarak saklanır.
- Listeleme: `GET /api/v1/admin/amazon/discovery/jobs`.
- Oluşturma: `POST /api/v1/admin/amazon/discovery/jobs` (admin oturumu ve origin gerekir).
- İptal: `POST /api/v1/admin/amazon/discovery/jobs/:id/cancel`.
- Ürün keşfi **kapalıdır**; sahte sonuç, scraping veya canlı Amazon API çağrısı yapılmaz.
- Taslak oluşturmak, işi kuyruğa almak veya çalıştırmak değildir.

## START için gerekli işler
1. Amazon Türkiye hesabında Creators API erişimini ve güncel resmî API dokümantasyonunu doğrula.
2. Kimlik bilgilerini yalnız sunucu secret/env yapılandırmasında sakla; Git'e yazma.
3. Creators API için ayrı provider/adaptör, token yenileme, yanıt doğrulama ve zaman aşımı ekle.
4. Arama terimlerini ve resmî kategori kodlarını eşleştir; sayfalama ve oran limitlerini uygula.
5. Kalıcı kuyruk/worker, idempotency, retry/backoff, tekil iş kilidi ve durdurma kontrolü ekle.
6. ASIN tekilliği, ürün taslağı, editör onayı ve silinmiş/erişilemeyen ürün politikası ekle.
7. Amazon ürün görselleri, fiyatlar, önbellek ve güncelleme aralıkları için güncel lisans kurallarını uygula.
8. Mock sağlayıcı ile entegrasyon testleri; API hataları, kota, tekrar, kısmi sonuç, kesinti ve rollback senaryoları.
9. Veritabanı migration zincirini sıfırdan ve mevcut veriyi koruyarak doğrula; yerel build/CI'ı yeşile getir.
10. Operatör açıkça START demeden otomatik çalıştırma anahtarını açma. VPS dağıtımı en son.

## Yerel hazırlık
```bash
git pull origin main
pnpm install
pnpm --filter @eib/api build
pnpm build
# Migration geçmişini doğruladıktan sonra:
pnpm --filter @eib/database db:migrate
```

> Not: Bu belge bir hazırlık kontrol listesidir. Gerçek Amazon API adaptörü ve worker henüz tamamlanmış değildir.
