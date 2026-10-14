import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { DatabaseService } from './database';
import { AdminSessionGuard } from './admin-auth';

@Controller('api/v1/admin/analytics')
@UseGuards(AdminSessionGuard)
export class AdminAnalyticsController {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  @Get('overview')
  async overview() {
    const now = new Date();
    const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const [products, activeLinks, clicksToday, clicksMonth, clicksAll, topProducts] = await Promise.all([
      this.db.product.count(),
      this.db.affiliateLink.count({ where: { active: true } }),
      this.db.affiliateClick.count({ where: { createdAt: { gte: dayStart } } }),
      this.db.affiliateClick.count({ where: { createdAt: { gte: monthStart } } }),
      this.db.affiliateClick.count(),
      this.db.affiliateClick.groupBy({ by: ['productId'], _count: { _all: true }, orderBy: { _count: { productId: 'desc' } }, take: 10 }),
    ]);
    const items = await this.db.product.findMany({ where: { id: { in: topProducts.map(p => p.productId) } }, select: { id: true, title: true, slug: true } });
    const names = new Map(items.map(p => [p.id, p]));
    return {
      products, activeLinks, clicksToday, clicksMonth, clicksAll,
      topProducts: topProducts.map(p => ({ productId: p.productId, title: names.get(p.productId)?.title ?? 'Silinmiş ürün', slug: names.get(p.productId)?.slug ?? null, clicks: p._count._all })),
      note: 'Tıklamalar yalnızca siteden Amazon yönlendirmelerini gösterir; sipariş veya kazanç değildir.',
    };
  }
}
