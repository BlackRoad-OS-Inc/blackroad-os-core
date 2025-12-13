/**
 * BlackRoad Payment Gateway - Cloudflare Worker
 * Handles Stripe payments, subscriptions, and webhooks
 */

interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  SUBSCRIPTIONS_KV: KVNamespace;
  USERS_KV: KVNamespace;
  REVENUE_D1: D1Database;
}

interface PricingTier {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  agentLimit: number;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 29,
    priceYearly: 290,
    features: [
      '10 AI Agents',
      '1,000 tasks/month',
      'Basic analytics',
      'Email support',
      'Community access'
    ],
    agentLimit: 10,
    stripePriceIdMonthly: 'price_starter_monthly',
    stripePriceIdYearly: 'price_starter_yearly'
  },
  {
    id: 'pro',
    name: 'Professional',
    priceMonthly: 99,
    priceYearly: 990,
    features: [
      '100 AI Agents',
      '10,000 tasks/month',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
      'API access'
    ],
    agentLimit: 100,
    stripePriceIdMonthly: 'price_pro_monthly',
    stripePriceIdYearly: 'price_pro_yearly'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 499,
    priceYearly: 4990,
    features: [
      'Unlimited AI Agents',
      'Unlimited tasks',
      'Custom analytics',
      '24/7 phone support',
      'Dedicated account manager',
      'On-premise deployment',
      'SLA guarantees',
      'White-label options'
    ],
    agentLimit: -1, // unlimited
    stripePriceIdMonthly: 'price_enterprise_monthly',
    stripePriceIdYearly: 'price_enterprise_yearly'
  }
];

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route handling
      if (path === '/pricing') {
        return new Response(JSON.stringify(PRICING_TIERS), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (path === '/create-checkout-session' && request.method === 'POST') {
        return await createCheckoutSession(request, env, corsHeaders);
      }

      if (path === '/create-portal-session' && request.method === 'POST') {
        return await createPortalSession(request, env, corsHeaders);
      }

      if (path === '/webhook' && request.method === 'POST') {
        return await handleWebhook(request, env);
      }

      if (path === '/subscription-status' && request.method === 'GET') {
        return await getSubscriptionStatus(request, env, corsHeaders);
      }

      if (path === '/health') {
        return new Response(JSON.stringify({ status: 'healthy' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};

async function createCheckoutSession(request: Request, env: Env, corsHeaders: Record<string, string>) {
  const { tierId, billingPeriod, userId, email } = await request.json();

  const tier = PRICING_TIERS.find(t => t.id === tierId);
  if (!tier) {
    return new Response(JSON.stringify({ error: 'Invalid tier' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const priceId = billingPeriod === 'yearly' ? tier.stripePriceIdYearly : tier.stripePriceIdMonthly;

  // Create Stripe checkout session
  const checkoutSession = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'mode': 'subscription',
      'payment_method_types[]': 'card',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'success_url': 'https://blackroad.io/success?session_id={CHECKOUT_SESSION_ID}',
      'cancel_url': 'https://blackroad.io/pricing',
      'customer_email': email,
      'client_reference_id': userId,
      'metadata[tier_id]': tierId,
      'metadata[user_id]': userId,
    }).toString()
  });

  const session = await checkoutSession.json();

  return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function createPortalSession(request: Request, env: Env, corsHeaders: Record<string, string>) {
  const { customerId } = await request.json();

  const portalSession = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'customer': customerId,
      'return_url': 'https://blackroad.io/dashboard',
    }).toString()
  });

  const session = await portalSession.json();

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleWebhook(request: Request, env: Env) {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  const body = await request.text();

  // In production, verify the webhook signature here
  // For now, we'll parse the event directly
  const event = JSON.parse(body);

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object, env);
      break;

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object, env);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object, env);
      break;

    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object, env);
      break;

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object, env);
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleCheckoutCompleted(session: any, env: Env) {
  const userId = session.client_reference_id || session.metadata?.user_id;
  const tierId = session.metadata?.tier_id;

  if (!userId || !tierId) return;

  // Store subscription info in KV
  await env.SUBSCRIPTIONS_KV.put(
    `user:${userId}`,
    JSON.stringify({
      userId,
      tierId,
      customerId: session.customer,
      subscriptionId: session.subscription,
      status: 'active',
      createdAt: new Date().toISOString(),
    })
  );

  // Log revenue in D1
  await env.REVENUE_D1.prepare(
    'INSERT INTO revenue (user_id, tier_id, amount, currency, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(
    userId,
    tierId,
    session.amount_total / 100,
    session.currency,
    new Date().toISOString()
  ).run();
}

async function handleSubscriptionUpdate(subscription: any, env: Env) {
  const userId = subscription.metadata?.user_id;
  if (!userId) return;

  const existing = await env.SUBSCRIPTIONS_KV.get(`user:${userId}`, 'json') as any;
  if (!existing) return;

  await env.SUBSCRIPTIONS_KV.put(
    `user:${userId}`,
    JSON.stringify({
      ...existing,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    })
  );
}

async function handleSubscriptionDeleted(subscription: any, env: Env) {
  const userId = subscription.metadata?.user_id;
  if (!userId) return;

  const existing = await env.SUBSCRIPTIONS_KV.get(`user:${userId}`, 'json') as any;
  if (!existing) return;

  await env.SUBSCRIPTIONS_KV.put(
    `user:${userId}`,
    JSON.stringify({
      ...existing,
      status: 'canceled',
      canceledAt: new Date().toISOString(),
    })
  );
}

async function handlePaymentSucceeded(invoice: any, env: Env) {
  // Log successful payment
  const userId = invoice.subscription_details?.metadata?.user_id;
  if (!userId) return;

  await env.REVENUE_D1.prepare(
    'INSERT INTO revenue (user_id, amount, currency, created_at) VALUES (?, ?, ?, ?)'
  ).bind(
    userId,
    invoice.amount_paid / 100,
    invoice.currency,
    new Date().toISOString()
  ).run();
}

async function handlePaymentFailed(invoice: any, env: Env) {
  // Handle failed payment - send notification, update status, etc.
  console.log('Payment failed for invoice:', invoice.id);
}

async function getSubscriptionStatus(request: Request, env: Env, corsHeaders: Record<string, string>) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing userId' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const subscription = await env.SUBSCRIPTIONS_KV.get(`user:${userId}`, 'json');

  return new Response(JSON.stringify(subscription || { status: 'none' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
