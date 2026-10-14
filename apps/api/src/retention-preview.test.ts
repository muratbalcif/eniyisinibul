import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { PrismaClient } from '@prisma/client';
import { retentionPreview } from './retention-preview';

test('retention preview only counts records and never writes', async () => {
  const calls: string[] = [];
  const db = {
    adminSession: {
      count: async (args: { where: { expiresAt: { lt: Date } } }) => {
        calls.push('session.count');
        assert.ok(args.where.expiresAt.lt instanceof Date);
        return 4;
      },
    },
    affiliateClick: {
      count: async (args: { where: { createdAt: { lt: Date } } }) => {
        calls.push('click.count');
        const diff = Date.now() - args.where.createdAt.lt.getTime();
        assert.ok(diff >= 89 * 86400000 && diff <= 91 * 86400000);
        return 9;
      },
    },
  } as unknown as PrismaClient;
  const report = await retentionPreview(db);
  assert.equal(report.mode, 'DRY_RUN_ONLY');
  assert.equal(report.expiredSessions, 4);
  assert.equal(report.oldClicks, 9);
  assert.equal(report.deleted, 0);
  assert.deepEqual(calls, ['session.count', 'click.count']);
  assert.ok(!Number.isNaN(Date.parse(report.cutoff)));
});

test('retention preview propagates query failures without attempting cleanup', async () => {
  const db = {
    adminSession: { count: async () => { throw new Error('db unavailable'); } },
    affiliateClick: { count: async () => 0 },
  } as unknown as PrismaClient;
  await assert.rejects(() => retentionPreview(db), /db unavailable/);
});
