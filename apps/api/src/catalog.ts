import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
const categories = [{ slug: 'anne-bebek', name: 'Anne & Bebek' }];
@Controller('api/v1')
export class CatalogController {
  @Get('categories') categories() { return categories; }
  @Get('products') products(@Query('category') category?: string) {
    return { items: [], total: 0, category: category ?? null };
  }
  @Get('products/:slug') product(@Param('slug') slug: string) {
    throw new NotFoundException(`Product not found: ${slug}`);
  }
}
