import { prisma } from '../lib/prisma';

async function main() {
  for (let i = 1; i <= 10; i++) {
    await prisma.job.create({
      data: {
        title: `Demo Job ${i}`,
        description: 'Example description',
        salaryMin: 30000,
        salaryMax: 50000,
        location: 'Remote',
        modality: 'REMOTE',
        contract: 'FT',
        deadline: new Date(Date.now() + 7 * 86400000),
        user: { connect: { id: 'seed-user' } },
      },
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
