import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const BANDWIDTH_PLAN_ID = 'price_1RM6ILInEkfFxa3ERbHgDQs0';
const BANDWIDTH_SETUP_FEE_ID = 'price_1RM6KsInEkfFxa3EA8axQaDT';
const TMOBILE_PLAN_ID = 'price_1MPHx6InEkfFxa3E8JNeVXdm';
const PROMO_CODE_ID = 'promo_1RLS8kInEkfFxa3EbDTseGlI';

export async function POST(req: Request) {
  try {
    const authSession = auth();
    const userId = authSession?.userId;
    const { priceId, promoCode } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
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
        .single();

      const name = portData ? `${portData.firstname} ${portData.lastname}` : '';
      const description = portData?.number || '';

      const customer = await stripe.customers.create({
        email,
        name,
        description
      });
      customerId = customer.id;

      await supabase
        .from('port_requests')
        .update({ stripe_customer_id: customer.id })
        .eq('user_id', userId);
    }

    const { data: userPort } = await supabase
      .from('port_requests')
      .select('referrerPhone')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let applyAutoPromo = false;
    if (userPort?.referrerPhone) {
      const { data: match } = await supabase
        .from('port_requests')
        .select('id')
        .eq('number', userPort.referrerPhone)
        .limit(1)
        .single();

      applyAutoPromo = !!match;
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      priceId === BANDWIDTH_PLAN_ID
        ? [
            { price: BANDWIDTH_PLAN_ID, quantity: 1 },
            { price: BANDWIDTH_SETUP_FEE_ID, quantity: 1 }
          ]
        : [{ price: priceId, quantity: 1 }];

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: 'subscription',
      line_items: lineItems,

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account?cancelled=1`
    };

    // Apply auto promo only
    if (applyAutoPromo && priceId === TMOBILE_PLAN_ID) {
      sessionPayload.discounts = [{ promotion_code: PROMO_CODE_ID }];
    } else {
      delete sessionPayload.discounts;
      sessionPayload.allow_promotion_codes = true;
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('❌ Stripe Checkout Error:', err.message, err);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: err.message },
      { status: 500 }
    );
  }
}
