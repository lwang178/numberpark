'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function updatePortRequestStatus(id: string, status: string) {
  await prisma.portRequest.update({
    where: { id },
    data: { status }
  });

  // Re-render the /admin page
  revalidatePath('/admin');
}
