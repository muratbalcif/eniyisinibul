import { CanActivate, Controller, ExecutionContext, Get, HttpCode, Injectable, Post, Req, Res, UnauthorizedException, Body } from '@nestjs/common';
import { DatabaseService } from './database';
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { Request, Response } from 'express';
const scrypt = promisify(scryptCallback);
const cookieName = 'eib_admin_session';
const durationMs = 8 * 60 * 60 * 1000;
function digest(token: string) { return createHash('sha256').update(token).digest('hex'); }
function tokenFrom(request: Request): string | undefined {
  const header = request.headers.cookie ?? '';
  return header.split(';').map(x => x.trim()).find(x => x.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
}
export async function passwordHash(password: string): Promise<string> {
  if (password.length < 12 || password.length > 1024) throw new Error('Password length must be 12-1024');
  const salt = randomBytes(16).toString('hex');
  const key = await scrypt(password, Buffer.from(salt, 'hex'), 64) as Buffer;
  return 'scrypt:' + salt + ':' + key.toString('hex');
}
async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [kind, salt, expected] = stored.split(':');
  if (kind !== 'scrypt' || !/^[a-f0-9]{32}$/.test(salt ?? '') || !/^[a-f0-9]{128}$/.test(expected ?? '')) return false;
  const key = await scrypt(password, Buffer.from(salt, 'hex'), 64) as Buffer;
  return timingSafeEqual(key, Buffer.from(expected, 'hex'));
}
@Injectable()
export class AdminSessionGuard implements CanActivate {
  constructor(private readonly db: DatabaseService) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token = tokenFrom(req);
    if (!token || !/^[a-f0-9]{64}$/.test(token)) throw new UnauthorizedException();
    const session = await this.db.adminSession.findUnique({ where: { tokenHash: digest(token) }, include: { user: true } });
    if (!session || session.expiresAt <= new Date() || !session.user.active) throw new UnauthorizedException();
    return true;
  }
}
@Controller('api/v1/admin/auth')
export class AdminAuthController {
  constructor(private readonly db: DatabaseService) {}
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: unknown, @Res({ passthrough: true }) res: Response) {
    const data = body && typeof body === 'object' && !Array.isArray(body) ? body as Record<string, unknown> : {};
    if (typeof data.email !== 'string' || typeof data.password !== 'string' || data.password.length > 1024) throw new UnauthorizedException();
    const user = await this.db.adminUser.findUnique({ where: { email: data.email.trim().toLowerCase() } });
    if (!user || !user.active || !await verifyPassword(data.password, user.passwordHash)) throw new UnauthorizedException();
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + durationMs);
    await this.db.adminSession.create({ data: { userId: user.id, tokenHash: digest(token), expiresAt } });
    res.cookie(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api/v1/admin', expires: expiresAt });
    return { authenticated: true, expiresAt };
  }
  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = tokenFrom(req);
    if (token && /^[a-f0-9]{64}$/.test(token)) await this.db.adminSession.deleteMany({ where: { tokenHash: digest(token) } });
    res.clearCookie(cookieName, { path: '/api/v1/admin', sameSite: 'strict', secure: process.env.NODE_ENV === 'production', httpOnly: true });
  }
  @Get('session')
  async session(@Req() req: Request) {
    const token = tokenFrom(req);
    if (!token || !/^[a-f0-9]{64}$/.test(token)) throw new UnauthorizedException();
    const session = await this.db.adminSession.findUnique({ where: { tokenHash: digest(token) }, include: { user: true } });
    if (!session || session.expiresAt <= new Date() || !session.user.active) throw new UnauthorizedException();
    return { authenticated: true, email: session.user.email, expiresAt: session.expiresAt };
  }
}
