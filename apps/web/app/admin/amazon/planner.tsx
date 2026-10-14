'use client';
import { useState } from 'react';

type Group = { key: string; label: string; keywords: string[] };
type Config = { status: string; canDiscover: boolean; message: string; searchGroups: Group[] };
export default function DiscoveryPlanner({ config }: { config: Config }) {
  const [group, setGroup] = useState(config.searchGroups[0]?.key ?? '');
  const [target, setTarget] = useState(200);
  const selected = config.searchGroups.find(item => item.key === group);
  return <section style={{ display: 'grid', gap: 16, padding: 24, border: '1px solid #cbd5e1', borderRadius: 16, background: '#fff' }}>
    <h2 style={{ margin: 0 }}>Otomatik ürün keşfi</h2>
    <p role="status">{config.message}</p>
    <label>Kategori<select value={group} onChange={e => setGroup(e.target.value)} style={{ display: 'block', padding: 10, width: '100%' }}>{config.searchGroups.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
    <label>Hedef ürün sayısı<select value={target} onChange={e => setTarget(Number(e.target.value))} style={{ display: 'block', padding: 10, width: '100%' }}>{[100, 200, 500].map(value => <option key={value} value={value}>{value}</option>)}</select></label>
    <h3>Planlanan aramalar</h3>
    <ul>{selected?.keywords.map(keyword => <li key={keyword}>{keyword}</li>)}</ul>
    <p>Hedef: {target} ürün. ASIN bazlı tekrar kontrolü ve admin onayı gerekecek.</p>
    <button disabled={!config.canDiscover} style={{ padding: 12, border: 0, borderRadius: 8, background: '#0f766e', color: '#fff', opacity: config.canDiscover ? 1 : 0.5 }}>Amazon'dan ürünleri getir</button>
    <small>API erişimi açılmadan gerçek arama başlatılmaz. Bu ekran yalnızca keşif planını gösterir.</small>
  </section>;
}
