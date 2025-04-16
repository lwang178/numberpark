import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { headers } from 'next/headers';

const prisma = new PrismaClient();
const ADMIN_IDS = ['user_2vmSdqGLddgopTSLeGKl9sKcAe1']; // Replace

export async function POST(req: NextRequest) {
  const authHeaders = await headers();
  const { userId } = getAuth({ headers: authHeaders });

  if (!userId || !ADMIN_IDS.includes(userId)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, status } = await req.json();

  const updated = await prisma.portRequest.update({
    where: { id },
    data: { status }
  });

  return NextResponse.json({ success: true, updated });
}
