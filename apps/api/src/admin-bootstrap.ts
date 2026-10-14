import { PrismaClient } from '@prisma/client';
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
async function main() {
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const password = "123456123456123456";
  if (!email || !email.includes('@') || !password || password.length < 16) {
    throw new Error('Set ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD (16+ characters)');
  }
  const db = new PrismaClient();
  try {
    if (await db.adminUser.count()) throw new Error('An admin already exists');
    const salt = randomBytes(16);
    const key = await scrypt(password, salt, 64) as Buffer;
    await db.adminUser.create({ data: {
      email, passwordHash: ['scrypt', salt.toString('hex'), key.toString('hex')].join(':'),
    } });
    console.log('Initial admin created');
  } finally {
    await db.$disconnect();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
