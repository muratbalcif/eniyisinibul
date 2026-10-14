import 'reflect-metadata';
import { Controller, Get, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CatalogController } from './catalog';
import { DatabaseService } from './database';
import { AdminCatalogController } from './admin-catalog';
import { AdminLinksController } from './admin-links';
import { AdminSessionGuard, AdminAuthController } from './admin-auth';
import { AdminOriginGuard } from './admin-origin';
import { LoginThrottle } from './login-throttle';
import { AdminAnalyticsController } from './admin-analytics';

@Controller()
class HealthController {
  @Get('health') health() { return { status: 'ok', service: 'eniyisinibul-api' }; }
}
@Module({ controllers: [HealthController, CatalogController, AdminCatalogController, AdminLinksController, AdminAuthController, AdminAnalyticsController], providers: [DatabaseService, AdminSessionGuard, AdminOriginGuard, LoginThrottle] })
class AppModule {}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT ?? 3200), process.env.HOST ?? '127.0.0.1');
}
bootstrap().catch((error) => { console.error(error); process.exitCode = 1; });
