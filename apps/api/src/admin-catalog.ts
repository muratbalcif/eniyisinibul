import { BadRequestException, Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from './database';
import { AdminDevGuard } from './admin-auth';

function obj(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new BadRequestException('JSON object required');
  return value as Record<string, unknown>;
}
function requiredString(value: unknown, field: string, max = 160): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new BadRequestException(field + ' must be a nonempty string (max ' + max + ')');
  return value.trim();
}
function slug(value: unknown): string {
  const v = requiredString(value, 'slug', 120);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) throw new BadRequestException('Invalid slug');
  return v;
}
function pageParams(pageRaw?: string, limitRaw?: string) {
  const page = pageRaw === undefined ? 1 : Number(pageRaw);
  const limit = limitRaw === undefined ? 20 : Number(limitRaw);
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100 || (page - 1) * limit > 1000000) throw new BadRequestException('Invalid pagination');
  return { page, limit };
}
async function safeWrite<T>(operation: () => Promise<T>): Promise<T> {
  try { return await operation(); }
  catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') throw new ConflictException('Unique value already exists');
      if (error.code === 'P2025') throw new NotFoundException('Record not found');
      if (error.code === 'P2003') throw new ConflictException('Record is referenced by another record');
    }
    throw error;
  }
}

@Controller('api/v1/admin')
@UseGuards(AdminDevGuard)
export class AdminCatalogController {
  constructor(private readonly db: DatabaseService) {}

  @Get('categories')
  categories() { return this.db.category.findMany({ orderBy: { name: 'asc' } }); }

  @Post('categories')
  createCategory(@Body() input: unknown) {
    const body = obj(input);
    return safeWrite(() => this.db.category.create({ data: { slug: slug(body.slug), name: requiredString(body.name, 'name') } }));
  }

  @Get('products')
  async products(@Query('page') pageRaw?: string, @Query('limit') limitRaw?: string) {
    const { page, limit } = pageParams(pageRaw, limitRaw);
    const [items, total] = await this.db.$transaction([
      this.db.product.findMany({ skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }, include: { category: { select: { slug: true, name: true } } } }),
      this.db.product.count(),
    ]);
    return { items, total, page, limit };
  }

  @Post('products')
  async createProduct(@Body() input: unknown) {
    const body = obj(input);
    const categoryId = requiredString(body.categoryId, 'categoryId', 64);
    const category = await this.db.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new BadRequestException('Unknown categoryId');
    const description = body.description == null ? null : requiredString(body.description, 'description', 5000);
    return safeWrite(() => this.db.product.create({
      data: { slug: slug(body.slug), title: requiredString(body.title, 'title', 240), description, categoryId },
    }));
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() input: unknown) {
    const body = obj(input);
    const data: { title?: string; description?: string | null; slug?: string } = {};
    if ('title' in body) data.title = requiredString(body.title, 'title', 240);
    if ('slug' in body) data.slug = slug(body.slug);
    if ('description' in body) data.description = body.description === null ? null : requiredString(body.description, 'description', 5000);
    if (!Object.keys(data).length) throw new BadRequestException('No editable fields');
    return safeWrite(() => this.db.product.update({ where: { id }, data }));
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return safeWrite(() => this.db.product.delete({ where: { id }, select: { id: true } }));
  }
}
