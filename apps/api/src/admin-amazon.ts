import { BadRequestException, Body, ConflictException, Controller, Inject, Post, ServiceUnavailableException, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from './database';
import { AdminSessionGuard } from './admin-auth';
import { AdminOriginGuard } from './admin-origin';

function asinFrom(value: unknown): string {
  if (typeof value !== 'string' || value.length > 2048) throw new BadRequestException('Amazon ASIN veya URL gerekli');
  const input = value.trim();
  if (/^[A-Za-z0-9]{10}$/.test(input)) return input.toUpperCase();
  let url: URL;
  try { url = new URL(input); } catch { throw new BadRequestException('Geçersiz Amazon bağlantısı'); }
  if (url.protocol !== 'https:' || !['amazon.com.tr', 'www.amazon.com.tr'].includes(url.hostname.toLowerCase()) || url.username || url.password || url.port) throw new BadRequestException('Yalnızca Amazon Türkiye bağlantıları kabul edilir');
  const match = url.pathname.match(/\/(?:dp|gp\/product)\/([A-Za-z0-9]{10})(?:\/|$)/);
  if (!match) throw new BadRequestException('Bağlantıda ASIN bulunamadı');
  return match[1].toUpperCase();
}

@Controller('api/v1/admin/amazon')
@UseGuards(AdminOriginGuard, AdminSessionGuard)
export class AdminAmazonController {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  @Post('import')
  async importProduct(@Body() input: unknown) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new BadRequestException('JSON object required');
    const body = input as Record<string, unknown>;
    const asin = asinFrom(body.asinOrUrl);
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const categoryId = typeof body.categoryId === 'string' ? body.categoryId : '';
    if (!title || title.length > 240 || !categoryId || categoryId.length > 64) throw new BadRequestException('Başlık ve kategori gerekli');
    const description = body.description == null || body.description === '' ? null : body.description;
    if (description !== null && (typeof description !== 'string' || description.length > 5000)) throw new BadRequestException('Geçersiz açıklama');
    const tag = process.env.AMAZON_ASSOCIATE_TAG;
    if (!tag || !/^[a-z0-9-]{3,64}$/.test(tag)) throw new ServiceUnavailableException('AMAZON_ASSOCIATE_TAG yapılandırılmamış');
    const category = await this.db.category.findUnique({ where: { id: categoryId }, select: { id: true } });
    if (!category) throw new BadRequestException('Kategori bulunamadı');
    const slug = 'amazon-' + asin.toLowerCase();
    const url = 'https://www.amazon.com.tr/dp/' + asin + '?tag=' + encodeURIComponent(tag);
    try {
      return await this.db.$transaction(async tx => {
        const product = await tx.product.create({ data: { slug, title, categoryId, description: description as string | null, specifications: { ASIN: asin } } });
        const link = await tx.affiliateLink.create({ data: { productId: product.id, merchant: 'amazon-tr', url, active: false } });
        return { productId: product.id, slug: product.slug, asin, affiliateLinkId: link.id, linkActive: false };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('Bu ASIN zaten eklenmiş');
      throw error;
    }
  }
  @Post('bulk-import')
  async bulkImport(@Body() input: unknown) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new BadRequestException('JSON object required');
    const body = input as Record<string, unknown>;
    if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 50) throw new BadRequestException('1-50 ürün gönderin');
    if (typeof body.categoryId !== 'string' || body.categoryId.length > 64) throw new BadRequestException('Kategori gerekli');
    const tag = process.env.AMAZON_ASSOCIATE_TAG;
    if (!tag || !/^[a-z0-9-]{3,64}$/.test(tag)) throw new ServiceUnavailableException('AMAZON_ASSOCIATE_TAG yapılandırılmamış');
    const category = await this.db.category.findUnique({ where: { id: body.categoryId }, select: { id: true } });
    if (!category) throw new BadRequestException('Kategori bulunamadı');
    const results: { row: number; asin?: string; status: 'created' | 'duplicate' | 'invalid'; message?: string }[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < body.items.length; i++) {
      const item = body.items[i];
      if (!item || typeof item !== 'object' || Array.isArray(item)) { results.push({ row: i + 1, status: 'invalid', message: 'Geçersiz satır' }); continue; }
      const entry = item as Record<string, unknown>;
      let asin: string;
      try { asin = asinFrom(entry.asinOrUrl); }
      catch { results.push({ row: i + 1, status: 'invalid', message: 'Geçersiz ASIN veya bağlantı' }); continue; }
      const title = typeof entry.title === 'string' ? entry.title.trim() : '';
      if (!title || title.length > 240) { results.push({ row: i + 1, asin, status: 'invalid', message: 'Başlık 1-240 karakter olmalı' }); continue; }
      if (seen.has(asin)) { results.push({ row: i + 1, asin, status: 'duplicate', message: 'Dosya içinde tekrar' }); continue; }
      seen.add(asin);
      const slug = 'amazon-' + asin.toLowerCase();
      const url = 'https://www.amazon.com.tr/dp/' + asin + '?tag=' + encodeURIComponent(tag);
      try {
        await this.db.$transaction(async tx => {
          const product = await tx.product.create({ data: { slug, title, categoryId: body.categoryId as string, specifications: { ASIN: asin } } });
          await tx.affiliateLink.create({ data: { productId: product.id, merchant: 'amazon-tr', url, active: false } });
        });
        results.push({ row: i + 1, asin, status: 'created' });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') results.push({ row: i + 1, asin, status: 'duplicate', message: 'Zaten kayıtlı' });
        else throw error;
      }
    }
    return { created: results.filter(x => x.status === 'created').length, duplicate: results.filter(x => x.status === 'duplicate').length, invalid: results.filter(x => x.status === 'invalid').length, results };
  }

}
