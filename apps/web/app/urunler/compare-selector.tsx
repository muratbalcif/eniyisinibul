'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
export default function CompareSelector({ products }: { products: { id: string; slug: string; title: string }[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const available = new Set(products.map(p => p.slug));
  const current = selected.filter(slug => available.has(slug));
  const toggle = (slug: string) => setSelected(items => items.includes(slug) ? items.filter(s => s !== slug) : items.length < 3 ? [...items, slug] : items);
  return <section style={{ padding: 20, background: '#e8f6f0', borderRadius: 12, margin: '20px 0' }}>
    <h2>Ürün karşılaştır ({current.length}/3)</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {products.map(p => <label key={p.id}><input type="checkbox" checked={current.includes(p.slug)} disabled={current.length >= 3 && !current.includes(p.slug)} onChange={() => toggle(p.slug)} />{p.title}</label>)}
    </div>
    <button disabled={current.length < 2} onClick={() => router.push('/karsilastir?urunler=' + current.join(','))}>Karşılaştır</button>
  </section>;
}
