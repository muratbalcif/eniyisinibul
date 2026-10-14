'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Product = { id: string; title: string; slug: string; description: string | null; imageUrl?: string | null };
export default function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(product.title);
  const [slug, setSlug] = useState(product.slug);
  const [description, setDescription] = useState(product.description ?? '');
  const [imageUrl, setImageUrl] = useState(product.imageUrl ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function save() {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/admin/products/' + product.id, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, description: description || null, imageUrl: imageUrl || null }),
      });
      if (!response.ok) { setError('Ürün güncellenemedi.'); return; }
      setEditing(false); router.refresh();
    } catch { setError('Bağlantı hatası.'); } finally { setBusy(false); }
  }
  async function remove() {
    if (!window.confirm('Bu ürünü kalıcı olarak silmek istiyor musunuz?')) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/admin/products/' + product.id, { method: 'DELETE' });
      if (!response.ok) { setError('Ürün silinemedi. Bağlı bağlantıları kontrol edin.'); return; }
      router.refresh();
    } catch { setError('Bağlantı hatası.'); } finally { setBusy(false); }
  }
  return <div style={{ display: 'grid', gap: 8 }}>
    <div style={{ display: 'flex', gap: 8 }}>
      <button disabled={busy} type="button" onClick={() => setEditing(!editing)}>{editing ? 'Vazgeç' : 'Düzenle'}</button>
      <button disabled={busy} type="button" onClick={remove}>Sil</button>
    </div>
    {editing && <div style={{ display: 'grid', gap: 8, minWidth: 220 }}>
      <input aria-label="Ürün adı" maxLength={240} value={title} onChange={e => setTitle(e.target.value)} />
      <input aria-label="Slug" maxLength={120} value={slug} onChange={e => setSlug(e.target.value)} />
      <input aria-label="Görsel URL" type="url" maxLength={2048} value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
      <textarea aria-label="Açıklama" maxLength={5000} value={description} onChange={e => setDescription(e.target.value)} />
      <button disabled={busy || !title.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)} type="button" onClick={save}>Kaydet</button>
    </div>}
    {error && <small role="alert">{error}</small>}
  </div>;
}
