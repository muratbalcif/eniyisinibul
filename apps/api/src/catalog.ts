import { BadRequestException, Controller, Get, NotFoundException, Param, Query, Res } from '@nestjs/common';
import { DatabaseService } from './database';
import type { Response } from 'express';

@Controller('api/v1')
export class CatalogController {
  constructor(private readonly db: DatabaseService) {}

  @Get('categories')
  categories() {
    return this.db.category.findMany({
      select: { id: true, slug: true, name: true },
      orderBy: { name: 'asc' },
    });
  }

  @Get('products')
  async products(
    @Query('category') category?: string,
    @Query('q') query?: string,
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
  ) {
    const page = pageRaw === undefined ? 1 : Number(pageRaw);
    const limit = limitRaw === undefined ? 20 : Number(limitRaw);
    if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100 || (page - 1) * limit > 1000000) {
      throw new BadRequestException('page must be >= 1 and limit must be between 1 and 100');
    }
    const q = typeof query === 'string' ? query.trim() : '';
    if (q.length > 100) throw new BadRequestException('Search query too long');
    const where = {
      ...(category ? { category: { slug: category } } : {}),
      ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' as const } }, { description: { contains: q, mode: 'insensitive' as const } }] } : {}),
    };
    const [items, total] = await this.db.$transaction([
      this.db.product.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, slug: true, title: true, description: true, imageUrl: true, specifications: true,
          category: { select: { slug: true, name: true } },
        },
      }),
      this.db.product.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  @Get('go/:id')
  async affiliateRedirect(@Param('id') id: string, @Res() response: Response) {
    if (!/^[a-z0-9]{10,64}$/.test(id)) throw new NotFoundException('Link not found');
    const link = await this.db.affiliateLink.findFirst({ where: { id, active: true }, select: { url: true } });
    if (!link) throw new NotFoundException('Link not found');
    const destination = new URL(link.url);
    if (destination.protocol !== 'https:' || !['amazon.com.tr', 'www.amazon.com.tr'].includes(destination.hostname.toLowerCase()) || destination.username || destination.password || destination.port) throw new NotFoundException('Link not available');
    response.setHeader('Cache-Control', 'no-store');
    return response.redirect(302, destination.toString());
  }

  @Get('products/:slug')
  async product(@Param('slug') slug: string) {
    const item = await this.db.product.findUnique({
      where: { slug },
      select: {
        id: true, slug: true, title: true, description: true, imageUrl: true, specifications: true,
        category: { select: { slug: true, name: true } },
        links: { where: { active: true }, select: { id: true, merchant: true } },
      },
    });
    if (!item) throw new NotFoundException('Product not found');
    return item;
  }
}
