'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return <div><button type="button" disabled={busy} onClick={async () => {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      if (!response.ok) { setError('Çıkış yapılamadı. Tekrar deneyin.'); return; }
      router.replace('/admin/login'); router.refresh();
    } catch { setError('Bağlantı hatası.'); }
    finally { setBusy(false); }
  }}>{busy ? 'Çıkış yapılıyor…' : 'Çıkış yap'}</button>{error && <p role="alert">{error}</p>}</div>;
}
