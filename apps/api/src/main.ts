import 'reflect-metadata';
import { Controller, Get, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CatalogController } from './catalog';
import { DatabaseService } from './database';
import { AdminCatalogController } from './admin-catalog';
import { AdminLinksController } from './admin-links';
import { AdminDevGuard } from './admin-auth';

@Controller()
class HealthController {
  @Get('health') health() { return { status: 'ok', service: 'eniyisinibul-api' }; }
}
@Module({ controllers: [HealthController, CatalogController, AdminCatalogController, AdminLinksController], providers: [DatabaseService, AdminDevGuard] })
class AppModule {}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT ?? 3200), process.env.HOST ?? '127.0.0.1');
}
bootstrap().catch((error) => { console.error(error); process.exitCode = 1; });
