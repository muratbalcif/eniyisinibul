'use client';
import Link from 'next/link';
import { useState } from 'react';

const links = [
  { href: '/urunler', label: 'Ürünler' },
  { href: '/rehber', label: 'Satın alma rehberi' },
  { href: '/karsilastir', label: 'Karşılaştır' },
];
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="site-header-inner">
      <Link href="/" className="site-logo" onClick={() => setOpen(false)}>eniyisinibul<span>.</span></Link>
      <button className="site-menu-button" type="button" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(value => !value)}>{open ? 'Menüyü kapat' : 'Menü'}</button>
      <nav id="site-navigation" className={'site-nav' + (open ? ' site-nav-open' : '')} aria-label="Ana menü">
        {links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
      </nav>
    </div>
  </header>;
}
