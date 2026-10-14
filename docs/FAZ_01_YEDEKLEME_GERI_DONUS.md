# Faz 1 — Veritabanı yedekleme ve geri dönüş prosedürü

Durum: Taslak; izole test ortamında henüz doğrulanmadı. VPS dağıtımı Faz 13'tedir.

## Ön kontrol
1. Hedef ortamın test/üretim olduğunu ve `DATABASE_URL` değerinin doğru sunucuya ait olduğunu teyit et.
2. Migration geçmişini `pnpm --filter @eib/database exec prisma migrate status` ile kontrol et.
3. Bakım penceresi, uygulama sürümü, yedek sorumlusu ve geri dönüş kriterlerini kaydet.
4. Şifreleri, tam bağlantı URL'sini ve yedek içeriğini loglara/Git'e yazma.

## Yedek
- PostgreSQL için `pg_dump --format=custom --no-owner --no-acl --file=<secure-backup-path> --dbname=<database-connection>` kullan.
- Yedeği erişimi kısıtlı, şifrelenmiş konumda sakla; checksum ve boyutunu kaydet.
- Geri yükleme testini ayrı, boş test veritabanında yap; canlı veritabanı üzerinde deneme yapma.
- Saklama süresi, erişim yetkisi ve yedek imhası henüz hukuk/operasyon onayı gerektirir.

## Migration ve geri dönüş
- `prisma migrate deploy` uygulanan SQL'i otomatik olarak geri almaz.
- Başarısız migration sonrası önce hata, migration geçmişi ve veri bütünlüğünü incele.
- Geri dönüş için onaylı yedekten **ayrı bir veritabanına** restore et; uygulamayı ancak kontrol sonrası bu veritabanına yönlendir.
- `prisma migrate reset`, `db push --force-reset` veya üretim tablolarını silme komutlarını kullanma.
- Veri kaybı riski varsa otomatik rollback yapma; değişiklikleri durdurup yetkili incelemesi iste.

## Kabul
- [ ] Test ortamında yedek alındı.
- [ ] İzole test veritabanına geri yükleme doğrulandı.
- [ ] Uygulama migration öncesi ve sonrası smoke testlerinden geçti.
- [ ] Kurtarma süresi ve veri kaybı hedefleri belirlendi.
- [ ] Yetkilendirme ve saklama politikası onaylandı.
