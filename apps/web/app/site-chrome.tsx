'use client';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import SiteHeader from './site-header';
import SiteFooter from './site-footer';
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  return <>{!isAdmin && <SiteHeader />}{children}{!isAdmin && <SiteFooter />}</>;
}
