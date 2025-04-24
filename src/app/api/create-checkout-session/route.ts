// /app/api/create-checkout-session/route.ts
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil'
});

export async function POST(req: Request) {
  const { userId } = auth();
  const { priceId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createRouteHandlerClient({ cookies });

  // fetch Clerk user email
  const userResponse = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`
    }
  });
  const user = await userResponse.json();
  const email = user?.email_addresses?.[0]?.email_address;

  if (!email) {
    return NextResponse.json({ error: 'Email not found' }, { status: 400 });
  }

  let { data: existing } = await supabase
    .from('customers')
    .select('stripe_customer_id')
    .eq('clerk_id', userId)
    .single();

  let customerId = existing?.stripe_customer_id;

  if (!customerId) {
    const { data: portData } = await supabase
      .from('port_requests')
      .select('firstname, lastname, number')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const name = portData
      ? `${portData.firstname} ${portData.lastname}`.trim()
      : '';
    const description = portData?.number || '';

    const customer = await stripe.customers.create({
      email,
      name,
      description
    });

    customerId = customer.id;

    await supabase
      .from('customers')
      .insert({ clerk_id: userId, stripe_customer_id: customer.id });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account?cancelled=1`
  });

  return NextResponse.json({ url: session.url });
}
