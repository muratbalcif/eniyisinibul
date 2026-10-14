import { BadRequestException, Body, Controller, Get, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { DatabaseService } from './database';
import { AdminSessionGuard } from './admin-auth';
import { AdminOriginGuard } from './admin-origin';

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
  @Get('jobs')
  async jobs() {
    return this.db.amazonDiscoveryJob.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  }

  @Get('jobs/:id')
  async job(@Param('id') id: string) {
    if (!/^[a-z0-9]{10,40}$/.test(id)) throw new BadRequestException('Geçersiz iş kimliği');
    return this.db.amazonDiscoveryJob.findUnique({ where: { id } });
  }

  @Post('jobs')
  @UseGuards(AdminOriginGuard)
  async createJob(@Body() input: unknown) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new BadRequestException('Geçersiz istek');
    const body = input as Record<string, unknown>;
    const selected = catalog.find(x => x.key === body.group);
    const target = body.target;
    if (!selected || typeof target !== 'number' || !Number.isSafeInteger(target) || target < 10 || target > 500) throw new BadRequestException('Geçersiz kategori veya hedef');
    if (typeof body.categoryId !== 'string' || body.categoryId.length > 64) throw new BadRequestException('Yerel kategori seçin');
    const category = await this.db.category.findUnique({ where: { id: body.categoryId }, select: { id: true } });
    if (!category) throw new BadRequestException('Kategori bulunamadı');
    return this.db.amazonDiscoveryJob.create({
      data: { groupKey: selected.key, categoryId: category.id, targetCount: target, keywords: [...selected.keywords], status: 'DRAFT' },
    });
  }

  @Post('jobs/:id/cancel')
  @UseGuards(AdminOriginGuard)
  async cancelJob(@Param('id') id: string) {
    if (!/^[a-z0-9]{10,40}$/.test(id)) throw new BadRequestException('Geçersiz iş kimliği');
    const result = await this.db.amazonDiscoveryJob.updateMany({ where: { id, status: { in: ['DRAFT', 'QUEUED'] } }, data: { status: 'CANCELLED', finishedAt: new Date() } });
    return { cancelled: result.count === 1 };
  }

}
