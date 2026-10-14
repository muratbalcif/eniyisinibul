'use client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

type Category = { id: string; name: string };
type Row = { row: number; asin?: string; status: 'created' | 'duplicate' | 'invalid'; message?: string };
export default function AmazonBulkImport({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [lines, setLines] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ created: number; duplicate: number; invalid: number; results: Row[] } | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setResult(null);
    const inputLines = lines.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
    if (!inputLines.length || inputLines.length > 50) { setError('1-50 satır girin.'); return; }
    const items = inputLines.map(line => {
      const split = line.indexOf('|');
      return { asinOrUrl: split < 0 ? line : line.slice(0, split).trim(), title: split < 0 ? '' : line.slice(split + 1).trim() };
    });
    setBusy(true);
    try {
      const response = await fetch('/api/admin/amazon/bulk-import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ categoryId, items }) });
      const data = await response.json();
      if (!response.ok) setError(typeof data.message === 'string' ? data.message : 'Toplu ekleme başarısız.');
      else { setResult(data); router.refresh(); }
    } catch { setError('Bağlantı kurulamadı.'); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} style={{ background: '#fff', padding: 24, border: '1px solid #cbd5e1', borderRadius: 16, display: 'grid', gap: 12, marginBottom: 24 }}>
    <h2 style={{ margin: 0 }}>Toplu Amazon ASIN ekleme</h2>
    <p style={{ margin: 0, color: '#475569' }}>Her satır: ASIN veya Amazon ürün URL'si | Ürün başlığı. En fazla 50 ürün. Amazon API erişimi gerektirmez.</p>
    <label>Kategori<select required value={categoryId} onChange={e => setCategoryId(e.target.value)} style={{ display: 'block', width: '100%', padding: 10 }}><option value="">Kategori seçin</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    <label>Ürün listesi<textarea required rows={6} value={lines} onChange={e => setLines(e.target.value)} placeholder={'B0HCW79DLL | Çocuk gece lambası\nhttps://www.amazon.com.tr/dp/B0XXXXXXXX | Bebek ürünü'} style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: 10 }} /></label>
    <button type="submit" disabled={busy || !categoryId} style={{ background: '#0f766e', color: '#fff', border: 0, borderRadius: 8, padding: 12 }}>{busy ? 'Ekleniyor…' : 'Ürünleri toplu ekle'}</button>
    {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
    {result && <div role="status"><strong>Eklenen: {result.created} · Mükerrer: {result.duplicate} · Hatalı: {result.invalid}</strong><ul>{result.results.filter(r => r.status !== 'created').map(r => <li key={r.row}>Satır {r.row}: {r.message ?? r.status}</li>)}</ul><p>Bağlantılar pasif oluşturuldu; Affiliate bağlantıları bölümünden kontrol edip etkinleştirin.</p></div>}
  </form>;
}
