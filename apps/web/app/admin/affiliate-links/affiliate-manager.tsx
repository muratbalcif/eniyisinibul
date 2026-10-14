'use client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

type Product = { id: string; title: string };
type Affiliate = { id: string; url: string; active: boolean; merchant: string };
export default function AffiliateManager({ products, selectedId, links }: { products: Product[]; selectedId: string; links: Affiliate[] }) {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  function select(id: string) { router.push('/admin/affiliate-links?productId=' + encodeURIComponent(id)); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selectedId) return;
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin/affiliate-links', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: selectedId, merchant: 'amazon-tr', url }) });
      if (!response.ok) { setMessage('Bağlantı eklenemedi. Amazon Türkiye adresini kontrol edin.'); return; }
      setUrl(''); setMessage('Bağlantı pasif olarak eklendi.'); router.refresh();
    } catch { setMessage('Bağlantı hatası.'); } finally { setBusy(false); }
  }
  async function action(id: string, method: 'PATCH' | 'DELETE', active?: boolean) {
    if (method === 'DELETE' && !window.confirm('Bu bağlantıyı silmek istiyor musunuz?')) return;
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin/affiliate-links/' + id, { method, headers: { 'Content-Type': 'application/json' }, ...(method === 'PATCH' ? { body: JSON.stringify({ active }) } : {}) });
      if (!response.ok) { setMessage('İşlem gerçekleştirilemedi.'); return; }
      router.refresh();
    } catch { setMessage('Bağlantı hatası.'); } finally { setBusy(false); }
  }
  return <section style={{ display: 'grid', gap: 20 }}>
    <label>Ürün seçin<select value={selectedId} onChange={e => select(e.target.value)} style={{ display: 'block', padding: 12, width: '100%' }}>
      <option value="">Ürün seçin</option>{products.map(product => <option key={product.id} value={product.id}>{product.title}</option>)}
    </select></label>
    {selectedId && <><form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
      <label>Amazon Türkiye bağlantısı<input type="url" required maxLength={2048} placeholder="https://www.amazon.com.tr/..." value={url} onChange={e => setUrl(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: 12 }} /></label>
      <button disabled={busy} type="submit">Bağlantı ekle</button>
    </form>
    <h2>Bağlantılar</h2>
    {links.length === 0 ? <p>Henüz bağlantı yok.</p> : links.map(link => <article key={link.id} style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 12, overflowWrap: 'anywhere' }}>
      <p><a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a></p>
      <p>{link.active ? 'Aktif' : 'Pasif'} · {link.merchant}</p>
      <button disabled={busy} onClick={() => action(link.id, 'PATCH', !link.active)}>{link.active ? 'Pasifleştir' : 'Aktifleştir'}</button>{' '}
      <button disabled={busy} onClick={() => action(link.id, 'DELETE')}>Sil</button>
    </article>)}</>}
    {message && <p role="status">{message}</p>}
  </section>;
}
