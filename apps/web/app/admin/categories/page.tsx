import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

type Category = { id: string; slug: string; name: string };
export default async function CategoriesPage() {
  const token = (await cookies()).get('eib_admin_session')?.value;
  const api = process.env.ADMIN_API_INTERNAL_URL;
  if (!token || !api) redirect('/admin/login');
  let categories: Category[] = [];
  let failed = false;
  try {
    const response = await fetch(new URL('/api/v1/admin/categories', api), {
      headers: { Cookie: 'eib_admin_session=' + token }, cache: 'no-store',
    });
    if (response.status === 401) redirect('/admin/login');
    if (!response.ok) failed = true;
    else categories = await response.json() as Category[];
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    failed = true;
  }
  return <main style={{ maxWidth: 1000, margin: 'auto', padding: 32 }}>
    <p><Link href="/admin">← Yönetim paneli</Link></p>
    <h1>Kategoriler</h1>
    {failed ? <p role="alert">Kategoriler yüklenemedi.</p> :
      categories.length === 0 ? <p>Henüz kategori bulunmuyor.</p> :
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr><th align="left">Kategori</th><th align="left">Slug</th></tr></thead>
        <tbody>{categories.map(category => <tr key={category.id}><td style={{ padding: 12 }}>{category.name}</td><td>{category.slug}</td></tr>)}</tbody>
      </table>}
  </main>;
}
