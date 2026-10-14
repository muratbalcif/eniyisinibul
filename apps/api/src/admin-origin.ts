import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import type { Request } from 'express';

/** Reject cross-origin browser writes even if the browser sends session cookies. */
@Injectable()
export class AdminOriginGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return true;
    const allowed = process.env.ADMIN_ALLOWED_ORIGIN;
    if (!allowed) throw new ForbiddenException('ADMIN_ALLOWED_ORIGIN is required');
    let configured: URL;
    try { configured = new URL(allowed); } catch { throw new ForbiddenException('Invalid admin origin configuration'); }
    if (configured.pathname !== '/' || configured.search || configured.hash || configured.username || configured.password) throw new ForbiddenException('Invalid admin origin configuration');
    const origin = req.headers.origin;
    if (origin !== configured.origin) throw new ForbiddenException('Invalid request origin');
    return true;
  }
}
