'use client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

type Category = { id: string; name: string };
export default function AmazonImport({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [asinOrUrl, setAsinOrUrl] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin/amazon/import', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asinOrUrl: asinOrUrl.trim(), title: title.trim(), categoryId, description: description.trim() || null }),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        setAsinOrUrl(''); setTitle(''); setDescription('');
        setMessage('Ürün kaydedildi. Amazon bağlantısı güvenlik için pasif; Affiliate bağlantıları bölümünden kontrol edip etkinleştirin.');
        router.refresh();
      } else if (response.status === 409) setMessage('Bu ASIN daha önce eklenmiş.');
      else if (response.status === 503) setMessage('Sunucuda AMAZON_ASSOCIATE_TAG tanımlanmalı.');
      else if (response.status === 401) setMessage('Oturum süresi doldu. Yeniden giriş yapın.');
      else setMessage(typeof result.message === 'string' ? result.message : 'Ürün eklenemedi.');
    } catch { setMessage('Sunucu bağlantısı kurulamadı.'); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} style={{ background: '#f0fdfa', padding: 24, border: '1px solid #99f6e4', borderRadius: 16, display: 'grid', gap: 12, marginBottom: 24 }}>
    <h2 style={{ margin: 0 }}>Amazon ASIN ile ürün ekle</h2>
    <p style={{ margin: 0, color: '#475569' }}>Creators API erişimi gerektirmez. Ürün adı ve açıklaması elle girilir; Amazon ürün bilgileri otomatik çekilmez.</p>
    <label>Amazon ASIN veya ürün bağlantısı<input required maxLength={2048} value={asinOrUrl} onChange={e => setAsinOrUrl(e.target.value)} placeholder="B0XXXXXXXX veya https://www.amazon.com.tr/dp/..." style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: 10 }} /></label>
    <label>Ürün adı<input required maxLength={240} value={title} onChange={e => setTitle(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: 10 }} /></label>
    <label>Kategori<select required value={categoryId} onChange={e => setCategoryId(e.target.value)} style={{ display: 'block', width: '100%', padding: 10 }}><option value="">Kategori seçin</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    <label>Açıklama (isteğe bağlı)<textarea maxLength={5000} rows={3} value={description} onChange={e => setDescription(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: 10 }} /></label>
    <button disabled={busy || !categories.length} style={{ padding: 12, border: 0, borderRadius: 8, background: '#0f766e', color: '#fff' }}>{busy ? 'Ekleniyor…' : 'Amazon ürününü ekle'}</button>
    {message && <p role="status">{message}</p>}
  </form>;
}
