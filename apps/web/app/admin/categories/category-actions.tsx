'use client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export default function CategoryActions({ category }: { category: { id: string; name: string; slug: string } }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin/categories/' + category.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, slug }) });
      if (response.ok) { setEditing(false); router.refresh(); }
      else setMessage(response.status === 409 ? 'Bu slug zaten kullanılıyor.' : 'Kategori güncellenemedi.');
    } catch { setMessage('Bağlantı hatası.'); } finally { setBusy(false); }
  }
  async function remove() {
    if (!window.confirm('Kategoriyi silmek istiyor musunuz? Bağlı ürün varsa silinemez.')) return;
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin/categories/' + category.id, { method: 'DELETE' });
      if (response.ok) router.refresh();
      else setMessage(response.status === 409 ? 'Önce kategoriye bağlı ürünleri kaldırın.' : 'Kategori silinemedi.');
    } catch { setMessage('Bağlantı hatası.'); } finally { setBusy(false); }
  }
  return <div>
    <button type="button" disabled={busy} onClick={() => setEditing(!editing)}>{editing ? 'Vazgeç' : 'Düzenle'}</button>{' '}
    <button type="button" disabled={busy} onClick={remove}>Sil</button>
    {editing && <form onSubmit={save} style={{ display: 'grid', gap: 8, marginTop: 12 }}>
      <label>Ad<input required maxLength={160} value={name} onChange={e => setName(e.target.value)} /></label>
      <label>Slug<input required maxLength={120} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={slug} onChange={e => setSlug(e.target.value)} /></label>
      <button type="submit" disabled={busy}>Kaydet</button>
    </form>}
    {message && <p role="alert">{message}</p>}
  </div>;
}
