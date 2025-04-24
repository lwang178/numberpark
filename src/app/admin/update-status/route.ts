import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const form = await req.formData();
  const id = form.get('id') as string;
  const status = form.get('status') as string;

  if (!id || !status) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  try {
    await prisma.portRequest.update({
      where: { id },
      data: { status }
    });

    return NextResponse.redirect(new URL('/admin', req.url));
  } catch (error) {
    console.error('Status update failed:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
