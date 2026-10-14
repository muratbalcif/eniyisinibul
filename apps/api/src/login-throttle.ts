import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';

@Injectable()
export class LoginThrottle {
  private readonly attempts = new Map<string, { count: number; until: number }>();

  check(address: string, email: string): void {
    const now = Date.now();
    const key = createHash('sha256').update(address + ':' + email).digest('hex');
    if (this.attempts.size > 5000) {
      for (const [k, value] of this.attempts) {
        if (value.until <= now) this.attempts.delete(k);
      }
    }
    const previous = this.attempts.get(key);
    if (previous && previous.until > now && previous.count >= 5) {
      throw new HttpException('Please retry later', HttpStatus.TOO_MANY_REQUESTS);
    }
    this.attempts.set(key, {
      count: previous && previous.until > now ? previous.count + 1 : 1,
      until: previous && previous.until > now ? previous.until : now + 900000,
    });
  }
}
