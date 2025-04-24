import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId } = auth({ headers: headers() }); // ⚠ triggers Next.js warning

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Missing phone number' },
        { status: 400 }
      );
    }

    await prisma.portabilityCheck.create({
      data: {
        userId,
        phoneNumber
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving portability check:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
