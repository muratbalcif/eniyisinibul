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
}
