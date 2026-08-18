import { PrismaClient } from '@prisma/client';

import { PrismaLandWorkspaceRepository } from '../src/data/land-workspace-repository';

const prisma = new PrismaClient();

async function main() {
  await new PrismaLandWorkspaceRepository(prisma).seed();
}

main().finally(async () => {
  await prisma.$disconnect();
});
