import 'reflect-metadata';
import { Controller, Get, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CatalogController } from './catalog';
@Controller() class HealthController { @Get('health') health() { return { status: 'ok', service: 'eniyisinibul-api' }; } }
@Module({ controllers: [HealthController, CatalogController] }) class AppModule {}
async function bootstrap() { const app = await NestFactory.create(AppModule); app.enableShutdownHooks(); await app.listen(Number(process.env.PORT ?? 3200), '127.0.0.1'); }
bootstrap();
