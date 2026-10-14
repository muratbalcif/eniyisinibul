import { BadRequestException, Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { DatabaseService } from './database';

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
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
  ) {
    const page = pageRaw === undefined ? 1 : Number(pageRaw);
    const limit = limitRaw === undefined ? 20 : Number(limitRaw);
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new BadRequestException('page must be >= 1 and limit must be between 1 and 100');
    }
    const where = category ? { category: { slug: category } } : {};
    const [items, total] = await this.db.$transaction([
      this.db.product.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, slug: true, title: true, description: true,
          category: { select: { slug: true, name: true } },
        },
      }),
      this.db.product.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  @Get('products/:slug')
  async product(@Param('slug') slug: string) {
    const item = await this.db.product.findUnique({
      where: { slug },
      select: {
        id: true, slug: true, title: true, description: true,
        category: { select: { slug: true, name: true } },
        links: { where: { active: true }, select: { id: true, merchant: true } },
      },
    });
    if (!item) throw new NotFoundException('Product not found');
    return item;
  }
}
