'use server';

import { getAuth } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function createPortRequest(formData: FormData) {
  const authHeaders = await headers(); // ✅ now awaited
  const { userId } = getAuth({ headers: authHeaders });

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
