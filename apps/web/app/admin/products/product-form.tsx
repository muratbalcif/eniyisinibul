'use client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

type Category = { id: string; name: string };
export default function ProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), slug: slug.trim(), categoryId, description: description.trim() || null }),
      });
      if (response.ok) {
        setTitle(''); setSlug(''); setDescription(''); setMessage('Ürün kaydedildi.'); router.refresh();
      } else if (response.status === 409) setMessage('Bu slug zaten kullanılıyor.');
      else if (response.status === 401) setMessage('Oturum sona erdi. Yeniden giriş yapın.');
      else setMessage('Ürün kaydedilemedi. Bilgileri kontrol edin.');
    } catch { setMessage('Bağlantı hatası.'); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} style={{ background: 'white', padding: 24, border: '1px solid #e2e8f0', borderRadius: 16, display: 'grid', gap: 14, marginBottom: 28 }}>
    <h2 style={{ margin: 0 }}>Yeni ürün</h2>
    <label>Ürün adı<input required maxLength={240} value={title} onChange={e => setTitle(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: 10 }} /></label>
    <label>Slug<input required maxLength={120} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={slug} onChange={e => setSlug(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: 10 }} /></label>
    <label>Kategori<select required value={categoryId} onChange={e => setCategoryId(e.target.value)} style={{ display: 'block', width: '100%', padding: 10 }}><option value="">Kategori seçin</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
    <label>Açıklama<textarea maxLength={5000} rows={4} value={description} onChange={e => setDescription(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: 10 }} /></label>
    <button type="submit" disabled={busy || !categories.length} style={{ padding: 12, border: 0, borderRadius: 8, background: '#0f766e', color: 'white' }}>{busy ? 'Kaydediliyor…' : 'Ürün ekle'}</button>
    {!categories.length && <p>Önce kategori oluşturmalısınız.</p>}
    {message && <p role="status">{message}</p>}
  </form>;
}
