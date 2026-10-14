import { Inject, BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminSessionGuard } from './admin-auth';
import { AdminOriginGuard } from './admin-origin';
import { DatabaseService } from './database';

function validUrl(value: unknown): string {
  if (typeof value !== 'string' || value.length > 2048) throw new BadRequestException('Invalid URL');
  let url: URL;
  try { url = new URL(value); } catch { throw new BadRequestException('Invalid URL'); }
  if (url.protocol !== 'https:' || !['amazon.com.tr', 'www.amazon.com.tr'].includes(url.hostname.toLowerCase()) || url.username || url.password || url.port) throw new BadRequestException('Merchant URL not allowed');
  return url.toString();
}
function bodyObject(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new BadRequestException('JSON object required');
  return input as Record<string, unknown>;
}
@Controller('api/v1/admin/affiliate-links')
@UseGuards(AdminOriginGuard, AdminSessionGuard)
export class AdminLinksController {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}
  @Get('product/:productId')
  list(@Param('productId') productId: string) {
    return this.db.affiliateLink.findMany({ where: { productId }, orderBy: { createdAt: 'desc' } });
  }
  @Get('audit')
  async audit() {
    const tag = process.env.AMAZON_ASSOCIATE_TAG;
    const links = await this.db.affiliateLink.findMany({ where: { merchant: 'amazon-tr' }, select: { id: true, productId: true, url: true, active: true }, take: 1000, orderBy: { createdAt: 'desc' } });
    return { checked: links.length, limited: links.length === 1000, results: links.map(link => {
      const issues: string[] = [];
      try {
        const url = new URL(link.url);
        if (url.protocol !== 'https:' || !['amazon.com.tr', 'www.amazon.com.tr'].includes(url.hostname.toLowerCase()) || url.username || url.password || url.port) issues.push('Geçersiz Amazon adresi');
        if (!tag) issues.push('Ortak kimliği yapılandırılmamış');
        else if (url.searchParams.get('tag') !== tag) issues.push('Ortak kimliği eşleşmiyor');
        if (!/\\/(?:dp|gp\\/product)\\/[A-Za-z0-9]{10}(?:\\/|$)/.test(url.pathname)) issues.push('Ürün ASIN yolu doğrulanamadı');
      } catch { issues.push('Geçersiz URL'); }
      return { id: link.id, productId: link.productId, active: link.active, validFormat: issues.length === 0, issues };
    }) };
  }

  @Post()
  async create(@Body() input: unknown) {
    const body = bodyObject(input);
    if (typeof body.productId !== 'string' || !body.productId || body.productId.length > 64) throw new BadRequestException('Invalid productId');
    if (body.merchant !== 'amazon-tr') throw new BadRequestException('Unsupported merchant');
    const product = await this.db.product.findUnique({ where: { id: body.productId } });
    if (!product) throw new NotFoundException('Product not found');
    return this.db.affiliateLink.create({ data: { productId: body.productId, merchant: 'amazon-tr', url: validUrl(body.url), active: false } });
  }
  @Patch(':id')
  async update(@Param('id') id: string, @Body() input: unknown) {
    const body = bodyObject(input);
    const data: { url?: string; active?: boolean } = {};
    if ('url' in body) data.url = validUrl(body.url);
    if ('active' in body) {
      if (typeof body.active !== 'boolean') throw new BadRequestException('active must be boolean');
      data.active = body.active;
    }
    if (!Object.keys(data).length) throw new BadRequestException('No editable fields');
    const existing = await this.db.affiliateLink.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Link not found');
    return this.db.affiliateLink.update({ where: { id }, data });
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const existing = await this.db.affiliateLink.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Link not found');
    return this.db.affiliateLink.delete({ where: { id }, select: { id: true } });
  }
}
