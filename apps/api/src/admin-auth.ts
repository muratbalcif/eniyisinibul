import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual } from 'node:crypto';

/**
 * Temporary development-only gate. Not a production login/session system.
 * Disabled unless ADMIN_DEV_TOKEN is explicitly configured.
 */
@Injectable()
export class AdminDevGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const expected = process.env.ADMIN_DEV_TOKEN;
    if (!expected || expected.length < 32 || process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException('Admin development access disabled');
    }
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined> }>();
    const auth = request.headers.authorization ?? '';
    const prefix = 'Bearer ';
    if (!auth.startsWith(prefix)) throw new UnauthorizedException();
    const provided = auth.slice(prefix.length);
    const a = Buffer.from(expected);
    const b = Buffer.from(provided);
    if (a.length !== b.length || !timingSafeEqual(a, b)) throw new UnauthorizedException();
    return true;
  }
}
