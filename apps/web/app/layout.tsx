import type { ReactNode } from 'react';
export const metadata = { title: 'En İyisini Bul', description: 'Aradığını değil, sana en uygun olanı bul.' };
export default function RootLayout({ children }: { children: ReactNode }) { return <html lang="tr"><body style={{margin:0,fontFamily:'system-ui,sans-serif',background:'#f8fafc',color:'#152238'}}>{children}</body></html>; }
