# Faz 1 — Altyapı ve migration denetimi

Durum: Başladı. Üretim dağıtımı yapılmaz.

## Mevcut durum
- pnpm 9.15.9 monorepo; API NestJS 10, Prisma 6 ve PostgreSQL; web Next.js.
- CI: Prisma schema validate, Prisma client generate, retention unit tests, build.
- `packages/database/prisma/migrations/migration_lock.toml` mevcut.
- Beklenen `packages/database/prisma/migrations/20261001000000_init/migration.sql` yolunda dosya bulunamadı. Bu, migration geçmişinin henüz doğrulanamadığı anlamına gelir; veritabanına `db push` veya reset uygulanmamalıdır.
- GitHub Actions başarılı çalışma sonucu henüz doğrulanmadı.

## Sıradaki güvenli adımlar
1. Depodaki migration dosyalarının gerçek listesini doğrula; varsa mevcut geçmişi esas al.
2. Migration yoksa mevcut Prisma şemasından başlangıç SQL'ini **yeni veritabanı için** oluştur; mevcut veritabanında uygulanmış gibi varsayma.
3. Boş PostgreSQL test veritabanında `prisma migrate deploy`, `prisma migrate status` ve şema doğrulaması çalıştır.
4. API build, web build ve retention testlerinin CI sonuçlarını doğrula.
5. Ortam değişkenleri, sırların yönetimi, healthcheck ve rollback prosedürünü denetle.

## Kapılar
- [ ] Migration geçmişi doğrulandı.
- [ ] Boş test veritabanında migration başarıyla uygulandı.
- [ ] CI test/build başarılı.
- [ ] Geri alma ve yedekleme prosedürü belgelendi.
- [ ] VPS dağıtımı Faz 13'e kadar ertelendi.

Amazon keşif/senkronizasyonu START onayı olmadan kapalı kalır.
