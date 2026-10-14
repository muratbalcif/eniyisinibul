# Admin güvenlik kapısı

Admin yazma endpointleri **henüz açılmadı**. Ürün, kategori ve affiliate linkleri için public write endpoint eklenmeyecek.

Admin CRUD açılmadan önce:
1. Parola hash (Argon2id), güvenli session cookie ve CSRF koruması.
2. Login rate limit, audit log, oturum iptali.
3. Admin rol ve yetki kontrolleri (server-side).
4. DTO validasyonu ve URL allowlist.
5. CRUD entegrasyon testleri.

Ürün bilgileri bağımsız editoryal veri olmalıdır; Amazon fiyat, yorum, yıldız ve görselleri izinsiz scraping ile alınmamalıdır.
