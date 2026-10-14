import type { MetadataRoute } from 'next';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://eniyisinibul.com').replace(/\/$/, '');
  const pages: MetadataRoute.Sitemap = ['/', '/urunler', '/rehber', '/hakkimizda', '/gizlilik'].map(path => ({ url: origin + path, changeFrequency: 'weekly', priority: path === '/' ? 1 : 0.6 }));
  const api = process.env.ADMIN_API_INTERNAL_URL;
  if (!api) return pages;
  try {
    const categories = await fetch(new URL('/api/v1/categories', api), { next: { revalidate: 3600 } });
    if (categories.ok) {
      const items = await categories.json() as { slug: string }[];
      for (const item of items) if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) pages.push({ url: origin + '/urunler?category=' + encodeURIComponent(item.slug), priority: 0.5 });
    }
    for (let page = 1; page <= 20; page++) {
      const response = await fetch(new URL('/api/v1/products?limit=100&page=' + page, api), { next: { revalidate: 3600 } });
      if (!response.ok) break;
      const result = await response.json() as { items: { slug: string }[]; total: number };
      for (const item of result.items) if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) pages.push({ url: origin + '/urunler/' + item.slug, changeFrequency: 'weekly', priority: 0.7 });
      if (page * 100 >= result.total || result.items.length === 0) break;
    }
  } catch { /* Static pages remain discoverable */ }
  return pages;
}
