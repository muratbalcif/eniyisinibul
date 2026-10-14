'use client';
import { useState } from 'react';
type Entry = { key: string; value: string };
export default function SpecificationsField({ initial, onChange }: { initial?: Record<string, string> | null; onChange: (value: Record<string, string>) => void }) {
  const [rows, setRows] = useState<Entry[]>(Object.entries(initial ?? {}).map(([key, value]) => ({ key, value })));
  function change(next: Entry[]) {
    setRows(next);
    const result: Record<string, string> = {};
    for (const row of next) if (row.key.trim() && row.value.trim()) result[row.key.trim()] = row.value.trim();
    onChange(result);
  }
  return <fieldset style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
    <legend>Teknik özellikler</legend>
    {rows.map((row, index) => <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
      <input aria-label={'Özellik adı ' + (index + 1)} maxLength={60} placeholder="Özellik" value={row.key} onChange={e => change(rows.map((item, i) => i === index ? { ...item, key: e.target.value } : item))} />
      <input aria-label={'Özellik değeri ' + (index + 1)} maxLength={240} placeholder="Değer" value={row.value} onChange={e => change(rows.map((item, i) => i === index ? { ...item, value: e.target.value } : item))} />
      <button type="button" onClick={() => change(rows.filter((_, i) => i !== index))}>Kaldır</button>
    </div>)}
    <button type="button" disabled={rows.length >= 20} onClick={() => change([...rows, { key: '', value: '' }])}>Özellik ekle</button>
  </fieldset>;
}
