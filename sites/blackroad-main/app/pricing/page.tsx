import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, ArrowRight, Star, Zap, Shield, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing - Simple, Transparent Plans | BlackRoad OS',
  description: 'Choose the perfect plan for your AI agent needs. Start free with 100 agents, scale to Pro with 10,000 agents, or go Enterprise for unlimited scale. No hidden fees.',
  keywords: ['blackroad pricing', 'AI agent pricing', 'agent hosting cost', 'LLM pricing', 'enterprise AI pricing'],
  openGraph: {
    title: 'BlackRoad OS Pricing - Free to Enterprise Plans',
    description: 'Start free, scale as you grow. Simple, transparent pricing for AI agent deployment.',
    url: 'https://blackroad.io/pricing',
  },
}

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for prototyping and learning',
      features: [
        { text: '100 active agents', included: true },
        { text: '3 LLM models (Llama, Mistral, Gemma)', included: true },
        { text: '1,000 agent operations/month', included: true },
        { text: 'Community support (Discord)', included: true },
        { text: 'Basic analytics dashboard', included: true },
        { text: '1 GB storage', included: true },
        { text: 'Public agent marketplace', included: true },
        { text: 'API access (100 req/min)', included: true },
        { text: 'Priority support', included: false },
        { text: 'Custom domain packs', included: false },
        { text: 'Advanced LLM models', included: false },
      ],
      cta: 'Start Free',
      link: '/app/signup',
      popular: false,
      icon: Sparkles,
    },
    {
      name: 'Pro',
      price: '$49',
      period: 'per month',
      description: 'For production applications and teams',
      features: [
        { text: '10,000 active agents', included: true },
        { text: 'All 27 LLM models (GPT-4, Claude, etc.)', included: true },
        { text: '1,000,000 agent operations/month', included: true },
        { text: 'Priority email & chat support', included: true },
        { text: 'Advanced analytics & insights', included: true },
        { text: '100 GB storage', included: true },
        { text: 'Private agent marketplace', included: true },
        { text: 'API access (10,000 req/min)', included: true },
        { text: 'Custom domain packs (5 included)', included: true },
        { text: 'Team collaboration (up to 10 users)', included: true },
        { text: 'Webhook integrations', included: true },
        { text: '99.9% uptime SLA', included: true },
      ],
      cta: 'Start Pro Trial',
      link: '/app/signup?plan=pro',
      popular: true,
      icon: Zap,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact sales',
      description: 'Unlimited scale with dedicated support',
      features: [
        { text: 'Unlimited agents', included: true },
        { text: 'All LLM models + bring your own', included: true },
        { text: 'Unlimited operations', included: true },
        { text: '24/7 dedicated support team', included: true },
        { text: 'Custom analytics & reporting', included: true },
        { text: 'Unlimited storage', included: true },
        { text: 'Enterprise marketplace', included: true },
        { text: 'Unlimited API access', included: true },
        { text: 'Unlimited custom domain packs', included: true },
        { text: 'Unlimited team members', included: true },
        { text: 'Custom integrations & webhooks', included: true },
        { text: '99.99% uptime SLA', included: true },
        { text: 'On-premise deployment option', included: true },
        { text: 'White-label solution', included: true },
        { text: 'Training & onboarding', included: true },
        { text: 'Dedicated account manager', included: true },
      ],
      cta: 'Contact Sales',
      link: '/contact?subject=enterprise',
      popular: false,
      icon: Shield,
    },
  ]

  const faqs = [
    {
      question: 'What counts as an "agent operation"?',
      answer: 'An agent operation is any action performed by an agent: LLM inference, API call, database query, or inter-agent message. Most simple agents use 10-100 operations per task.',
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes! You can change plans at any time. Upgrades take effect immediately. Downgrades take effect at the end of your billing cycle with prorated credits.',
    },
    {
      question: 'What LLM models are included?',
      answer: 'Free tier includes Llama 2/3, Mistral 7B, and Gemma. Pro includes all 27 models: GPT-4, Claude 3, Llama 3, Mixtral, and more. Enterprise includes custom model integration.',
    },
    {
      question: 'Is there a commitment or contract?',
      answer: 'No commitment required for Free or Pro plans. Pay monthly, cancel anytime. Enterprise plans typically involve annual contracts with volume discounts.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, Amex), ACH bank transfers for Enterprise, and cryptocurrency (ETH, SOL, BTC) for annual plans.',
    },
    {
      question: 'Do you offer academic or non-profit discounts?',
      answer: 'Yes! We offer 50% off Pro plans for verified academic researchers and non-profit organizations. Contact us with your .edu email or non-profit documentation.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-blackroad rounded-lg" />
              <span className="text-xl font-bold gradient-text">BlackRoad OS</span>
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white transition">← Back to Home</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white/5 backdrop-blur-sm border ${
                plan.popular
                  ? 'border-blackroad-pink shadow-2xl shadow-blackroad-pink/20 scale-105 lg:scale-110'
                  : 'border-white/10'
              } rounded-2xl p-8 relative transition-all hover:border-blackroad-pink/50`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-blackroad px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <Star className="w-4 h-4" /> MOST POPULAR
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <plan.icon className={`w-10 h-10 ${plan.popular ? 'text-blackroad-pink' : 'text-gray-400'}`} />
                <h3 className="text-3xl font-bold">{plan.name}</h3>
              </div>

              <div className="mb-4">
                <div className="text-5xl font-bold mb-1">
                  {plan.price}
                </div>
                <div className="text-gray-400">{plan.period}</div>
              </div>

              <p className="text-gray-300 mb-6 min-h-[48px]">{plan.description}</p>

              <Link
                href={plan.link}
                className={`block text-center py-4 rounded-lg font-semibold text-lg transition mb-6 ${
                  plan.popular
                    ? 'bg-gradient-blackroad hover:opacity-90'
                    : 'border-2 border-white/20 hover:border-white/40'
                }`}
              >
                {plan.cta} {plan.cta.includes('Trial') && <ArrowRight className="w-4 h-4 inline ml-2" />}
              </Link>

              <div className="space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-blackroad-pink flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-20">
                        <div className="w-full h-0.5 bg-gray-500 mt-2" />
                      </div>
                    )}
                    <span className={feature.included ? 'text-gray-300' : 'text-gray-500 line-through'}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center gradient-text">Compare All Features</h2>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left">Feature</th>
                    <th className="px-6 py-4 text-center">Free</th>
                    <th className="px-6 py-4 text-center bg-blackroad-pink/10">Pro</th>
                    <th className="px-6 py-4 text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="px-6 py-4 font-semibold">Active Agents</td>
                    <td className="px-6 py-4 text-center text-gray-400">100</td>
                    <td className="px-6 py-4 text-center bg-blackroad-pink/5">10,000</td>
                    <td className="px-6 py-4 text-center text-gray-400">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">LLM Models</td>
                    <td className="px-6 py-4 text-center text-gray-400">3</td>
                    <td className="px-6 py-4 text-center bg-blackroad-pink/5">27</td>
                    <td className="px-6 py-4 text-center text-gray-400">All + Custom</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Operations/Month</td>
                    <td className="px-6 py-4 text-center text-gray-400">1,000</td>
                    <td className="px-6 py-4 text-center bg-blackroad-pink/5">1,000,000</td>
                    <td className="px-6 py-4 text-center text-gray-400">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Storage</td>
                    <td className="px-6 py-4 text-center text-gray-400">1 GB</td>
                    <td className="px-6 py-4 text-center bg-blackroad-pink/5">100 GB</td>
                    <td className="px-6 py-4 text-center text-gray-400">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Support</td>
                    <td className="px-6 py-4 text-center text-gray-400">Community</td>
                    <td className="px-6 py-4 text-center bg-blackroad-pink/5">Priority</td>
                    <td className="px-6 py-4 text-center text-gray-400">24/7 Dedicated</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">SLA</td>
                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                    <td className="px-6 py-4 text-center bg-blackroad-pink/5">99.9%</td>
                    <td className="px-6 py-4 text-center text-gray-400">99.99%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center gradient-text">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-blackroad rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Start with our free tier today. No credit card required.
          </p>
          <Link
            href="/app/signup"
            className="inline-block bg-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-900 transition"
          >
            Create Free Account <ArrowRight className="w-5 h-5 inline ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
