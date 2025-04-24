import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { priceId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userResponse = await fetch(
      `https://api.clerk.dev/v1/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`
        }
      }
    );

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
        .maybeSingle();

      const name = portData ? `${portData.firstname} ${portData.lastname}` : '';
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
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account?cancelled=1`
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('❌ Error in create-checkout-session:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
