'use client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export default function CategoryForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim() }),
      });
      if (response.ok) {
        setName(''); setSlug(''); setMessage('Kategori eklendi.');
        router.refresh();
      } else if (response.status === 409) setMessage('Bu kategori slug değeri zaten kullanılıyor.');
      else if (response.status === 401) setMessage('Oturumunuz sona erdi. Yeniden giriş yapın.');
      else setMessage('Kategori eklenemedi. Bilgileri kontrol edin.');
    } catch { setMessage('Bağlantı hatası.'); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', display: 'grid', gap: 14, marginBottom: 28 }}>
    <h2 style={{ margin: 0 }}>Yeni kategori</h2>
    <label>Kategori adı<input required maxLength={160} value={name} onChange={e => setName(e.target.value)} style={{ display: 'block', padding: 10, width: '100%', boxSizing: 'border-box' }} /></label>
    <label>Slug<input required maxLength={120} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={slug} onChange={e => setSlug(e.target.value)} placeholder="anne-bebek" style={{ display: 'block', padding: 10, width: '100%', boxSizing: 'border-box' }} /></label>
    <button type="submit" disabled={busy} style={{ padding: 12, background: '#0f766e', color: '#fff', border: 0, borderRadius: 8 }}>{busy ? 'Kaydediliyor…' : 'Kategori ekle'}</button>
    {message && <p role="status">{message}</p>}
  </form>;
}
