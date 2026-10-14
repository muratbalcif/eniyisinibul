import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://eniyisinibul.com').replace(/\/$/, '');
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/go/'] }], sitemap: origin + '/sitemap.xml' };
}
