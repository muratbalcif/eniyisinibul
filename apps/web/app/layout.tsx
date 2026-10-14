import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import SiteHeader from './site-header';
import SiteFooter from './site-footer';
import './site.css';

export const metadata: Metadata = {
  title: { default: 'En İyisini Bul | Bilinçli ürün seçimi', template: '%s | En İyisini Bul' },
  description: 'Anne ve bebek ürünleri başta olmak üzere ürünleri keşfet, özellikleri incele ve ihtiyaçlarına uygun seçenekleri değerlendir.',
  robots: { index: true, follow: true },
  openGraph: { type: 'website', locale: 'tr_TR', siteName: 'En İyisini Bul', title: 'En İyisini Bul', description: 'Ürünleri keşfet, karşılaştırmaya hazırlan ve bilinçli karar ver.' },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="tr"><body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f8faf9', color: '#15352e' }}><SiteHeader />{children}<SiteFooter /></body></html>;
}
