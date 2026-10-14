import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

type Product = { id: string; slug: string; title: string; category: { name: string } };
type Result = { items: Product[]; total: number; page: number; limit: number };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const token = (await cookies()).get('eib_admin_session')?.value;
  const api = process.env.ADMIN_API_INTERNAL_URL;
  if (!token || !api) redirect('/admin/login');
  const requested = Number((await searchParams).page ?? 1);
  const page = Number.isSafeInteger(requested) && requested > 0 && requested <= 50000 ? requested : 1;
  let result: Result | null = null;
  let failed = false;
  try {
    const url = new URL('/api/v1/admin/products', api);
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', '20');
    const response = await fetch(url, { headers: { Cookie: 'eib_admin_session=' + token }, cache: 'no-store' });
    if (response.status === 401) redirect('/admin/login');
    if (response.ok) result = await response.json() as Result;
    else failed = true;
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    failed = true;
  }
  return <main style={{ maxWidth: 1080, margin: 'auto', padding: 32 }}>
    <p><Link href="/admin">← Yönetim paneli</Link></p>
    <h1>Ürünler</h1>
    {failed || !result ? <p role="alert">Ürünler yüklenemedi.</p> :
      <><p>Toplam {result.total} ürün</p>
        {result.items.length === 0 ? <p>Henüz ürün bulunmuyor.</p> :
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse' }}>
            <thead><tr><th align="left">Ürün</th><th align="left">Kategori</th><th align="left">Slug</th></tr></thead>
            <tbody>{result.items.map(item => <tr key={item.id}><td style={{ padding: 12 }}>{item.title}</td><td>{item.category.name}</td><td>{item.slug}</td></tr>)}</tbody>
          </table></div>}
        <nav style={{ display: 'flex', gap: 20, marginTop: 24 }}>
          {page > 1 && <Link href={'/admin/products?page=' + (page - 1)}>← Önceki</Link>}
          {page * result.limit < result.total && <Link href={'/admin/products?page=' + (page + 1)}>Sonraki →</Link>}
        </nav>
      </>}
  </main>;
}
