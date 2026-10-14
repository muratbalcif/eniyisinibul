import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DiscoveryPlanner from './planner';

type Config = { status: string; canDiscover: boolean; message: string; searchGroups: { key: string; label: string; keywords: string[] }[] };
export default async function AmazonPage() {
  const token = (await cookies()).get('eib_admin_session')?.value;
  const api = process.env.ADMIN_API_INTERNAL_URL;
  if (!token || !api) redirect('/admin/login');
  let config: Config | null = null;
  try {
    const response = await fetch(new URL('/api/v1/admin/amazon/discovery/config', api), { headers: { Cookie: 'eib_admin_session=' + token }, cache: 'no-store' });
    if (response.ok) config = await response.json() as Config;
  } catch {}
  return <main style={{ maxWidth: 1040, margin: 'auto', padding: 32 }}>
    <p><Link href="/admin">← Yönetim paneli</Link></p>
    <h1>Amazon Otomatik Katalog</h1>
    <p>Amazon Türkiye kategorilerinden toplu ürün keşfi planlama ekranı.</p>
    {!config ? <p role="alert">API yapılandırması yüklenemedi.</p> : <DiscoveryPlanner config={config} />}
    <p><Link href="/admin/products">Ürün yönetimine dön →</Link></p>
  </main>;
}
