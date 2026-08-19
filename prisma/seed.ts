import { PrismaClient } from '@prisma/client';

import { PrismaLandWorkspaceRepository } from '../src/data/land-workspace-repository';
import { hashPassword } from '../lib/password';

const prisma = new PrismaClient();

async function main() {
  await new PrismaLandWorkspaceRepository(prisma).seed();

  const email = process.env.LAND_DEMO_EMAIL;
  const password = process.env.LAND_DEMO_PASSWORD;
  if (email && password) {
    const user = await prisma.user.upsert({
      where: { email: email.trim().toLowerCase() },
      update: { passwordHash: await hashPassword(password) },
      create: { email: email.trim().toLowerCase(), passwordHash: await hashPassword(password) },
    });
    await prisma.projectMembership.upsert({
      where: { userId_projectId: { userId: user.id, projectId: 'land-project' } },
      update: { role: 'owner' },
      create: { userId: user.id, projectId: 'land-project', role: 'owner' },
    });
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
