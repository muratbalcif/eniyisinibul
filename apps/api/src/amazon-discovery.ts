import { BadRequestException, Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { DatabaseService } from './database';
import { AdminSessionGuard } from './admin-auth';

const catalog = [
  { key: 'baby', label: 'Anne & Bebek', keywords: ['bebek arabası', 'bebek oto koltuğu', 'bebek telsizi', 'emzirme yastığı', 'bebek gece lambası', 'bebek bezi', 'biberon', 'bebek bakım çantası'] },
  { key: 'toys', label: 'Oyuncak', keywords: ['eğitici oyuncak', 'bebek oyuncakları', 'ahşap oyuncak', 'yapboz'] },
  { key: 'home', label: 'Ev & Yaşam', keywords: ['hava temizleyici', 'robot süpürge', 'kahve makinesi', 'mutfak robotu'] },
  { key: 'electronics', label: 'Elektronik', keywords: ['kulaklık', 'tablet', 'akıllı saat', 'bluetooth hoparlör'] },
] as const;

@Controller('api/v1/admin/amazon/discovery')
@UseGuards(AdminSessionGuard)
export class AmazonDiscoveryController {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  @Get('config')
  async config() {
    const categories = await this.db.category.findMany({ select: { id: true, slug: true, name: true }, orderBy: { name: 'asc' } });
    return {
      provider: 'amazon-creators-api',
      status: 'awaiting_api_access',
      canDiscover: false,
      canSchedule: false,
      message: 'Amazon Creators API erişimi doğrulanmadı. Gerçek ürün keşfi ve otomatik senkronizasyon henüz etkin değil.',
      categories,
      searchGroups: catalog,
      limits: { minTarget: 10, maxTarget: 500, pageSize: 10 },
      publication: 'admin-review-required',
    };
  }

  @Get('preview')
  preview(@Query('group') group: string, @Query('target') targetRaw: string) {
    const selected = catalog.find(x => x.key === group);
    const target = Number(targetRaw);
    if (!selected || !Number.isSafeInteger(target) || target < 10 || target > 500) throw new BadRequestException('Geçersiz kategori veya hedef sayı');
    return {
      group: selected.key,
      target,
      status: 'awaiting_api_access',
      keywords: selected.keywords,
      suggestedSearches: selected.keywords.map(keyword => ({ keyword, status: 'not_started' })),
      discovered: 0,
      imported: 0,
      note: 'Bu plan gerçek Amazon sonuçları içermez. API yetkisi olmadan istek yapılmaz.',
    };
  }
}
