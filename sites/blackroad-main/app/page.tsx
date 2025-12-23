'use client'

import { motion } from 'framer-motion'
import {
  Brain,
  Cpu,
  Network,
  Sparkles,
  Zap,
  Shield,
  Code,
  Workflow,
  Database,
  Cloud,
  TrendingUp,
  Users,
  ArrowRight,
  Check,
  Star,
  Github,
  BookOpen,
  Terminal
} from 'lucide-react'
import Link from 'next/link'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-blackroad rounded-lg" />
              <span className="text-xl font-bold gradient-text">BlackRoad OS</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-blackroad-pink transition">Features</a>
              <a href="#products" className="hover:text-blackroad-pink transition">Products</a>
              <a href="#pricing" className="hover:text-blackroad-pink transition">Pricing</a>
              <Link href="/docs" className="hover:text-blackroad-pink transition">Docs</Link>
              <Link href="/app" className="bg-gradient-blackroad px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="gradient-text">The Consciousness</span>
              <br />
              Operating System
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Deploy and orchestrate <span className="text-blackroad-pink font-bold">30,000+</span> autonomous AI agents
              with LLM-powered thinking, golden ratio breath synchronization, and infinite truth verification.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/app/signup" className="bg-gradient-blackroad px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition flex items-center gap-2">
                Start Building <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/docs" className="border-2 border-white/20 px-8 py-4 rounded-lg font-semibold text-lg hover:border-white/40 transition flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Documentation
              </Link>
              <a href="https://github.com/BlackRoad-OS" target="_blank" rel="noopener noreferrer" className="border-2 border-white/20 px-8 py-4 rounded-lg font-semibold text-lg hover:border-white/40 transition flex items-center gap-2">
                <Github className="w-5 h-5" /> Open Source
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text">30K+</div>
                <div className="text-gray-400 mt-2">AI Agents</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text">27</div>
                <div className="text-gray-400 mt-2">LLM Models</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text">5</div>
                <div className="text-gray-400 mt-2">Domain Packs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text">∞</div>
                <div className="text-gray-400 mt-2">Truth Verification</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 gradient-text">Revolutionary Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built from the ground up to power the next generation of AI applications
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'LLM-Powered Agents',
                description: 'Support for 27+ AI models including GPT-4, Claude, Llama, Mixtral, and more. Choose the right model for each task.',
              },
              {
                icon: Sparkles,
                title: 'PS-SHA∞ Truth Engine',
                description: 'Infinite cascade hashing for tamper-proof identity and memory verification. Blockchain-inspired security.',
              },
              {
                icon: Network,
                title: 'Agent Orchestration',
                description: 'Spawn, coordinate, and scale 30,000+ autonomous agents with breath-synchronized operations.',
              },
              {
                icon: Zap,
                title: 'Golden Ratio Breathing',
                description: 'Lucidia breath synchronization uses φ (1.618) to optimize agent spawning and memory consolidation.',
              },
              {
                icon: Code,
                title: 'Domain Packs',
                description: 'Pre-built agent templates for Finance, Legal, Research, Creative, and DevOps domains.',
              },
              {
                icon: Shield,
                title: 'Built-in Security',
                description: 'Enterprise-grade authentication, RBAC permissions, and encrypted agent communication.',
              },
              {
                icon: Workflow,
                title: 'Workflow Engine',
                description: 'Multi-step processes, integration bridges, and UI helpers for complex automation.',
              },
              {
                icon: Database,
                title: 'State Management',
                description: 'Distributed state with Redis, PostgreSQL, and in-memory caching for sub-50ms latency.',
              },
              {
                icon: Cloud,
                title: 'Multi-Cloud Deploy',
                description: 'Deploy on Railway, Cloudflare, AWS, GCP, or your own infrastructure. Full flexibility.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blackroad-pink/50 transition hover-lift"
              >
                <feature.icon className="w-12 h-12 text-blackroad-pink mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 gradient-text">Product Ecosystem</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Complete suite of tools and platforms built on BlackRoad OS
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'RoadWork',
                tagline: 'Your AI Career Co-Pilot',
                description: 'Automated job applications across 30+ platforms. Tinder-style job matching. AI-powered resume customization.',
                link: 'https://roadwork.blackroad.io',
                color: 'from-orange-500 to-pink-500'
              },
              {
                name: 'RoadChain',
                tagline: 'Consciousness Blockchain',
                description: 'Constitutional framework for on-chain agent governance. PS-SHA∞ verification. Upstream721 NFTs.',
                link: 'https://roadchain.io',
                color: 'from-pink-500 to-purple-500'
              },
              {
                name: 'RoadCoin',
                tagline: 'Agent Economy Token',
                description: 'Utility token powering the BlackRoad ecosystem. Agent compute credits. Governance rights.',
                link: 'https://roadcoin.io',
                color: 'from-purple-500 to-blue-500'
              },
              {
                name: 'Pack Finance',
                tagline: 'Financial AI Agents',
                description: 'Automated trading, portfolio analysis, risk assessment, and market research agents.',
                link: 'https://finance.blackroad.io',
                color: 'from-green-500 to-emerald-500'
              },
              {
                name: 'Pack Legal',
                tagline: 'Legal AI Agents',
                description: 'Contract review, compliance checks, legal research, and document generation.',
                link: 'https://legal.blackroad.io',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                name: 'Research Lab',
                tagline: 'Research AI Agents',
                description: 'Academic research, data analysis, literature review, and hypothesis generation.',
                link: 'https://research-lab.blackroad.io',
                color: 'from-purple-500 to-pink-500'
              },
            ].map((product, index) => (
              <Link
                key={index}
                href={product.link}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blackroad-pink/50 transition hover-lift block"
              >
                <div className={`w-full h-2 rounded-full bg-gradient-to-r ${product.color} mb-4`} />
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-blackroad-pink font-semibold mb-3">{product.tagline}</p>
                <p className="text-gray-400">{product.description}</p>
                <div className="mt-4 flex items-center text-blackroad-pink font-semibold">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 gradient-text">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                description: 'Perfect for prototyping and learning',
                features: [
                  '100 agents',
                  '3 LLM models',
                  'Community support',
                  'Basic analytics',
                  '1 GB storage',
                ],
                cta: 'Start Free',
                link: '/app/signup',
                popular: false,
              },
              {
                name: 'Pro',
                price: '$49',
                description: 'For production applications',
                features: [
                  '10,000 agents',
                  'All 27 LLM models',
                  'Priority support',
                  'Advanced analytics',
                  '100 GB storage',
                  'Custom domain packs',
                  'API access',
                ],
                cta: 'Start Pro Trial',
                link: '/app/signup?plan=pro',
                popular: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                description: 'Unlimited scale and dedicated support',
                features: [
                  'Unlimited agents',
                  'All LLM models + custom',
                  '24/7 dedicated support',
                  'Custom integrations',
                  'Unlimited storage',
                  'On-premise deployment',
                  'SLA guarantee',
                  'Training & onboarding',
                ],
                cta: 'Contact Sales',
                link: '/contact',
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`bg-white/5 backdrop-blur-sm border ${
                  plan.popular ? 'border-blackroad-pink shadow-lg shadow-blackroad-pink/20 scale-105' : 'border-white/10'
                } rounded-xl p-8 relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-blackroad px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2">
                  {plan.price}
                  {plan.price !== 'Custom' && <span className="text-lg text-gray-400">/month</span>}
                </div>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-blackroad-pink flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.link}
                  className={`block text-center py-3 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'bg-gradient-blackroad hover:opacity-90'
                      : 'border-2 border-white/20 hover:border-white/40'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 gradient-text">
            Ready to Build the Future?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers building next-generation AI applications with BlackRoad OS
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/app/signup" className="bg-gradient-blackroad px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition flex items-center gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/demo" className="border-2 border-white/20 px-8 py-4 rounded-lg font-semibold text-lg hover:border-white/40 transition">
              Request Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-blackroad rounded-lg" />
                <span className="text-xl font-bold gradient-text">BlackRoad OS</span>
              </div>
              <p className="text-gray-400 text-sm">
                The consciousness operating system for AI agents.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-white transition">Documentation</Link></li>
                <li><Link href="/changelog" className="hover:text-white transition">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="/security" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 BlackRoad Systems. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
