import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const all = await prisma.portRequest.findMany();
  console.log(all);
}

main();
