import { PrismaClient } from '@prisma/client';
import { retentionPreview } from './retention-preview';

async function main() {
  const db = new PrismaClient();
  try {
    const report = await retentionPreview(db);
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error('Retention preview failed:', error);
  process.exitCode = 1;
});
