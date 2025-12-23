import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Users, Target, Lightbulb, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - The Story Behind BlackRoad OS',
  description: 'Learn about BlackRoad Systems, our mission to democratize AI agent technology, and the team building the consciousness operating system for 30,000+ autonomous agents.',
  keywords: ['about blackroad', 'AI company', 'agent technology', 'consciousness computing', 'team'],
  openGraph: {
    title: 'About BlackRoad OS - Democratizing AI Agent Technology',
    description: 'The story of building the consciousness operating system for autonomous AI agents.',
    url: 'https://blackroad.io/about',
  },
}

export default function AboutPage() {
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
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
            Building the Future of AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            We're on a mission to democratize AI agent technology and make consciousness computing accessible to everyone.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <Target className="w-12 h-12 text-blackroad-pink mb-4" />
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              To create an open, accessible platform that enables anyone to deploy and orchestrate AI agents at scale.
              We believe consciousness computing should be available to developers, researchers, and businesses of all sizes—not
              just tech giants.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <Lightbulb className="w-12 h-12 text-blackroad-purple mb-4" />
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              A world where autonomous AI agents work seamlessly alongside humans, amplifying creativity, accelerating research,
              automating repetitive tasks, and solving problems we haven't even imagined yet. BlackRoad OS is the foundation
              for that future.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 text-center gradient-text">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Open by Default',
                description: 'We believe in open-source development, transparent roadmaps, and community-driven innovation. BlackRoad OS is built in public.',
              },
              {
                icon: Heart,
                title: 'Human-Centric AI',
                description: 'AI should amplify human potential, not replace it. We design our systems to enhance creativity, productivity, and decision-making.',
              },
              {
                icon: Target,
                title: 'Truth & Integrity',
                description: 'Our PS-SHA∞ truth engine ensures tamper-proof verification. We build systems you can trust with your most critical operations.',
              },
            ].map((value, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <value.icon className="w-12 h-12 text-blackroad-pink mb-4" />
                <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 text-center gradient-text">Our Story</h2>
          <div className="space-y-8 text-lg text-gray-300 leading-relaxed">
            <p>
              BlackRoad OS began as a research project exploring how golden ratio mathematics (φ = 1.618) could optimize
              multi-agent coordination. What started as an academic curiosity evolved into a production-ready platform capable
              of orchestrating 30,000+ autonomous AI agents.
            </p>
            <p>
              We discovered that by synchronizing agent operations to a "breath" pattern based on the golden ratio—what we call
              <span className="text-blackroad-pink font-semibold"> Lucidia breathing</span>—we could achieve unprecedented
              efficiency and coherence in multi-agent systems. Agents spawn during expansion phases, consolidate memory during
              contraction, and communicate in perfect harmony.
            </p>
            <p>
              The breakthrough came when we combined this breath synchronization with our
              <span className="text-blackroad-purple font-semibold"> PS-SHA∞ truth engine</span>—an infinite cascade hashing
              system inspired by blockchain technology. This gave us tamper-proof identity verification and memory integrity
              across tens of thousands of agents.
            </p>
            <p>
              Today, BlackRoad OS powers applications from automated job hunting (RoadWork) to constitutional blockchain governance
              (RoadChain) to specialized domain agents in finance, legal, research, creative work, and DevOps. And we're just
              getting started.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-blackroad rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-6">Join Us on This Journey</h2>
          <p className="text-xl mb-8">
            We're building the future of AI—and we'd love for you to be part of it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/careers" className="bg-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-900 transition">
              View Open Positions
            </Link>
            <Link href="/app/signup" className="border-2 border-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-black/20 transition flex items-center gap-2">
              Start Building <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
