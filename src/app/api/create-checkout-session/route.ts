// /app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil'
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role key on server
);

export async function POST(req: Request) {
  const { userId } = auth();
  const { priceId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // get user email from Clerk
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

  // look up existing stripe customer
  let { data: existing, error } = await supabase
    .from('customers')
    .select('stripe_customer_id')
    .eq('clerk_id', userId)
    .single();

  let customerId = existing?.stripe_customer_id;

  if (!customerId) {
    // fetch latest port request to get name
    const { data: portData, error: portError } = await supabase
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
