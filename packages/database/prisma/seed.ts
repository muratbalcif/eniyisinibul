import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.category.upsert({
    where: { slug: 'anne-bebek' },
    create: { slug: 'anne-bebek', name: 'Anne & Bebek' },
    update: { name: 'Anne & Bebek' },
  });
  console.log('Seed completed: anne-bebek category');
}
main().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
