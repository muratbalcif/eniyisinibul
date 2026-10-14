'use client';
import { useState } from 'react';

type Group = { key: string; label: string; keywords: string[] };
type Config = { status: string; canDiscover: boolean; message: string; searchGroups: Group[]; categories: { id: string; name: string }[] };
export default function DiscoveryPlanner({ config }: { config: Config }) {
  const [group, setGroup] = useState(config.searchGroups[0]?.key ?? '');
  const [target, setTarget] = useState(200);
  const [categoryId, setCategoryId] = useState(config.categories[0]?.id ?? '');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  async function saveDraft() {
    setSaving(true); setNotice('');
    try {
      const response = await fetch('/api/admin/amazon/discovery/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ group, target, categoryId }) });
      const result = await response.json();
      setNotice(response.ok ? 'Keşif taslağı kaydedildi. API erişimi açılana ve START verilene kadar çalıştırılmayacak. İş: ' + result.id : (typeof result.message === 'string' ? result.message : 'Kaydedilemedi'));
    } catch { setNotice('API bağlantısı kurulamadı'); }
    finally { setSaving(false); }
  }
  const selected = config.searchGroups.find(item => item.key === group);
  return <section style={{ display: 'grid', gap: 16, padding: 24, border: '1px solid #cbd5e1', borderRadius: 16, background: '#fff' }}>
    <h2 style={{ margin: 0 }}>Otomatik ürün keşfi</h2>
    <p role="status">{config.message}</p>
    <label>Kategori<select value={group} onChange={e => setGroup(e.target.value)} style={{ display: 'block', padding: 10, width: '100%' }}>{config.searchGroups.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
    <label>Hedef ürün sayısı<select value={target} onChange={e => setTarget(Number(e.target.value))} style={{ display: 'block', padding: 10, width: '100%' }}>{[100, 200, 500].map(value => <option key={value} value={value}>{value}</option>)}</select></label>
    <label>Ürünlerin kaydedileceği site kategorisi<select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={{ display: 'block', padding: 10, width: '100%' }}>{config.categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <h3>Planlanan aramalar</h3>
    <ul>{selected?.keywords.map(keyword => <li key={keyword}>{keyword}</li>)}</ul>
    <p>Hedef: {target} ürün. ASIN bazlı tekrar kontrolü ve admin onayı gerekecek.</p>
    <button type="button" onClick={saveDraft} disabled={saving || !categoryId} style={{ padding: 12, border: '1px solid #0f766e', borderRadius: 8, color: '#0f766e', background: '#fff' }}>{saving ? 'Kaydediliyor…' : 'Keşif planını taslak olarak kaydet'}</button>
    {notice && <p role="status">{notice}</p>}
    <button disabled={!config.canDiscover} style={{ padding: 12, border: 0, borderRadius: 8, background: '#0f766e', color: '#fff', opacity: config.canDiscover ? 1 : 0.5 }}>Amazon'dan ürünleri getir</button>
    <small>API erişimi açılmadan gerçek arama başlatılmaz. Bu ekran yalnızca keşif planını gösterir.</small>
  </section>;
}
