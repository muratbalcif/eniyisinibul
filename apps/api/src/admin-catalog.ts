import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { DatabaseService } from './catalog';
import { AdminDevGuard } from './admin-auth';

function requiredString(value: unknown, field: string, max = 160): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
    throw new BadRequestException(field + ' must be a nonempty string (max ' + max + ')');
  }
  return value.trim();
}
function slug(value: unknown): string {
  const v = requiredString(value, 'slug', 120);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) throw new BadRequestException('Invalid slug');
  return v;
}

@Controller('api/v1/admin')
@UseGuards(AdminDevGuard)
export class AdminCatalogController {
  constructor(private readonly db: DatabaseService) {}

  @Get('categories')
  categories() { return this.db.category.findMany({ orderBy: { name: 'asc' } }); }

  @Post('categories')
  createCategory(@Body() body: Record<string, unknown>) {
    return this.db.category.create({ data: { slug: slug(body?.slug), name: requiredString(body?.name, 'name') } });
  }

  @Post('products')
  async createProduct(@Body() body: Record<string, unknown>) {
    const categoryId = requiredString(body?.categoryId, 'categoryId', 64);
    const category = await this.db.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new BadRequestException('Unknown categoryId');
    const description = body?.description == null ? null : requiredString(body.description, 'description', 5000);
    return this.db.product.create({
      data: { slug: slug(body?.slug), title: requiredString(body?.title, 'title', 240), description, categoryId },
    });
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    const data: { title?: string; description?: string | null; slug?: string } = {};
    if ('title' in body) data.title = requiredString(body.title, 'title', 240);
    if ('slug' in body) data.slug = slug(body.slug);
    if ('description' in body) data.description = body.description === null ? null : requiredString(body.description, 'description', 5000);
    if (!Object.keys(data).length) throw new BadRequestException('No editable fields');
    return this.db.product.update({ where: { id }, data });
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.db.product.delete({ where: { id }, select: { id: true } });
  }
}
