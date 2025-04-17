'use server';

console.log('🧪 Loaded DATABASE_URL:', process.env.DATABASE_URL);

import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function createPortRequest(formData: FormData) {
  const { userId } = await auth();

  if (!userId) throw new Error('Unauthorized');

  const data = {
    userId,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    zip: formData.get('zip') as string,
    accountNumber: formData.get('accountNumber') as string,
    transferPin: formData.get('transferPin') as string,
    status: 'pending'
  };

  await prisma.portRequest.create({ data });

  redirect('/dashboard/history');
}
