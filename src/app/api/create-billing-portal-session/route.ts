// /app/api/create-billing-portal-session/route.ts

import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const { userId } = auth();

    if (!userId) {
      console.warn('❌ Unauthorized request: no user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔍 Looking up Stripe customer ID for user:', userId);

    const { data, error } = await supabase
      .from('port_requests')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch customer record' },
        { status: 500 }
      );
    }

    const stripeCustomerId = data?.stripe_customer_id;

    if (!stripeCustomerId) {
      console.warn('⚠️ No stripe_customer_id found for user:', userId);
      return NextResponse.json(
        { error: 'No Stripe customer ID found' },
        { status: 400 }
      );
    }

    console.log('✅ Found Stripe customer ID:', stripeCustomerId);

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account`
    });

    console.log('✅ Created billing portal session:', session.url);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('❌ Unexpected error in create-billing-portal-session:', err);
    return NextResponse.json(
      { error: 'Stripe session creation failed' },
      { status: 500 }
    );
  }
}
