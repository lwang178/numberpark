import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();
const ADMIN_IDS = ['user_2vmSdqGLddgopTSLeGKl9sKcAe1']; // Replace

export async function POST(req: NextRequest) {
  const { userId } = await auth();

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
