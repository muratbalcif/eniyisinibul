import Link from 'next/link';
export default function SiteFooter() {
  return <footer className="site-footer">
    <div className="site-footer-inner">
      <div><strong>eniyisinibul<span style={{ color: '#f97316' }}>.</span></strong><p>Ürünleri daha bilinçli seçmenize yardımcı olan bağımsız keşif platformu.</p></div>
      <nav aria-label="Alt menü"><Link href="/urunler">Ürünler</Link><Link href="/rehber">Satın alma rehberi</Link><Link href="/hakkimizda">Hakkımızda</Link><Link href="/gizlilik">Gizlilik</Link></nav>
      <p className="site-disclosure">Bir Amazon Gelir Ortağı olarak nitelikli satın alımlar üzerinden kazanç elde ediyorum. Amazon mağaza bağlantıları satış ortaklığı bağlantısıdır. Bu bağlantılar üzerinden alışveriş yapılması hâlinde komisyon kazanılabilir. Ürün fiyatları ve stok durumu mağazada değişebilir.</p>
    </div>
  </footer>;
}
