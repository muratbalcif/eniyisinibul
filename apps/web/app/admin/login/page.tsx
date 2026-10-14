'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      if (!response.ok) { setError(response.status === 429 ? 'Çok fazla deneme. Daha sonra tekrar deneyin.' : 'Giriş yapılamadı. Bilgilerinizi kontrol edin.'); return; }
      router.replace('/admin');
      router.refresh();
    } catch { setError('Bağlantı kurulamadı.'); }
    finally { setBusy(false); }
  }
  return <main style={{ maxWidth: 420, margin: '12vh auto', padding: 28, border: '1px solid #e2e8f0', borderRadius: 18, background: '#fff' }}>
    <p style={{ color: '#0f766e', fontWeight: 700 }}>EN İYİSİNİ BUL</p>
    <h1>Yönetici girişi</h1>
    <form onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
      <label>E-posta<input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: 12, marginTop: 6 }} /></label>
      <label>Parola<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: 12, marginTop: 6 }} /></label>
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
      <button disabled={busy} type="submit" style={{ background: '#0f766e', color: '#fff', padding: 13, border: 0, borderRadius: 10 }}>{busy ? 'Kontrol ediliyor…' : 'Giriş yap'}</button>
    </form>
  </main>;
}
