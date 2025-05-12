// /app/api/debug-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ key: process.env.RESEND_API_KEY });
}
