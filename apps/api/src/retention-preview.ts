import { PrismaClient } from '@prisma/client';

export async function retentionPreview(db: PrismaClient) {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 90 * 86400000);
  const expiredSessions = await db.adminSession.count({ where: { expiresAt: { lt: now } } });
  const oldClicks = await db.affiliateClick.count({ where: { createdAt: { lt: cutoff } } });
  return { mode: 'DRY_RUN_ONLY', cutoff: cutoff.toISOString(), expiredSessions, oldClicks, deleted: 0 };
}
