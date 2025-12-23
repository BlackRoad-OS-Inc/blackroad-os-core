'use client';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-applier-orange/20 via-transparent to-applier-pink/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Logo/Brand */}
          <div className="text-center mb-12">
            <h1 className="text-7xl font-bold mb-4">
              <span className="text-gradient">applier</span>
              <span className="text-white">-pro</span>
            </h1>
            <p className="text-2xl text-gray-300 mb-4">The AI-Powered Job Application Suite</p>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-400 mb-2">
                By <span className="text-gradient font-semibold">Alexa Amundson</span>
              </p>
              <p className="text-base text-gray-500">
                Founder, BlackRoad OS • $26.8M Sales • 466K LOC Orchestrated • Series 7/63/65
              </p>
            </div>
          </div>

          {/* Main CTA */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Get Hired <span className="text-gradient">10x Faster</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Complete AI-powered job hunting system. 5x more applications, 50% higher response rate, better offers.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/profile"
                className="px-8 py-4 bg-gradient-to-r from-applier-orange to-applier-pink text-white font-bold rounded-lg hover:shadow-lg hover:shadow-applier-pink/50 transition-all"
              >
                View Profile
              </a>
              <a
                href="https://github.com/blackboxprogramming"
                className="px-8 py-4 border-2 border-applier-pink text-white font-bold rounded-lg hover:bg-applier-pink/10 transition-all"
              >
                GitHub
              </a>
              <a
                href="#features"
                className="px-8 py-4 border-2 border-applier-orange text-white font-bold rounded-lg hover:bg-applier-orange/10 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Real Stats from Alexa's Profile */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
            {[
              { label: "Sales Closed", value: "$26.8M", vs: "11 months" },
              { label: "Codebase", value: "466K LOC", vs: "5,937 commits" },
              { label: "Architecture", value: "2,119", vs: "API endpoints" },
              { label: "Automation", value: "145", vs: "autonomous agents" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.vs}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="text-gradient">10 Powerful Tools</span> in One Suite
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "✍️",
                title: "AI Cover Letters",
                description: "Claude Sonnet 4-powered personalized cover letters in seconds. Multiple tones, A/B testing.",
                impact: "30-40% higher response rate",
                link: "/dashboard"
              },
              {
                icon: "🚀",
                title: "Batch Applications",
                description: "Apply to 10-20+ jobs automatically. Smart rate limiting, LinkedIn Easy Apply automation.",
                impact: "10x faster applications",
                link: "/jobs"
              },
              {
                icon: "🎤",
                title: "Interview Prep AI",
                description: "Mock interviews with real-time feedback. Question prediction, STAR method coaching.",
                impact: "Better prepared, more offers",
                link: "/interview"
              },
              {
                icon: "💰",
                title: "Salary Negotiation",
                description: "Data-driven negotiation strategies. Market analysis, counter-offer scripts.",
                impact: "10-20% higher compensation",
                link: "/dashboard"
              },
              {
                icon: "🔍",
                title: "Company Research",
                description: "Instant company insights. Culture analysis, red flag detection, interview process.",
                impact: "Better targeting & decisions",
                link: "/jobs"
              },
              {
                icon: "🌐",
                title: "Advanced Platforms",
                description: "Scrape 50+ specialized boards: Y Combinator, AngelList, Remote OK, Web3, AI/ML jobs.",
                impact: "Access hidden job market",
                link: "/jobs"
              },
              {
                icon: "🤝",
                title: "AI Networking",
                description: "Professional networking automation. Connection messages, referral paths, cold outreach.",
                impact: "4x more referrals",
                link: "/network"
              },
              {
                icon: "✨",
                title: "Brand Builder",
                description: "Build your professional brand. LinkedIn optimization, blog posts, Twitter threads.",
                impact: "Stand out from crowd",
                link: "/dashboard"
              },
              {
                icon: "📈",
                title: "Market Intelligence",
                description: "Job market trends, skill demand analysis, salary forecasting, career trajectory.",
                impact: "Make informed decisions",
                link: "/analytics"
              },
              {
                icon: "📊",
                title: "Complete System",
                description: "All tools integrated. Resume builder, company research, offer comparison, career roadmap.",
                impact: "End-to-end solution",
                link: "/dashboard"
              },
            ].map((feature) => (
              <a
                key={feature.title}
                href={(feature as any).link || '#'}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 hover:border-applier-pink transition-all block"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                <div className="text-sm text-gradient font-semibold">{feature.impact}</div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            How <span className="text-gradient">applier-pro</span> Works
          </h2>

          <div className="space-y-12">
            {[
              {
                step: "1",
                title: "Install & Setup",
                description: "One-time setup: install dependencies, set API key, configure your profile.",
                code: "pip install anthropic playwright requests\nexport ANTHROPIC_API_KEY='sk-ant-...'\n./applier-pro help",
              },
              {
                step: "2",
                title: "Discover Hidden Jobs",
                description: "Scrape 50+ specialized platforms beyond LinkedIn/Indeed/Workday.",
                code: "./applier-pro platforms --category tech_startup\n./applier-pro platforms --platform ycombinator",
              },
              {
                step: "3",
                title: "Build Your Brand",
                description: "Optimize LinkedIn, create GitHub README, generate blog posts.",
                code: "./applier-pro brand --profile linkedin\n./applier-pro brand --blog 'Building AI Systems'",
              },
              {
                step: "4",
                title: "Network & Get Referrals",
                description: "AI-powered connection messages and referral path finding.",
                code: "./applier-pro network --target 'Anthropic' --goal referral",
              },
              {
                step: "5",
                title: "Generate AI Cover Letters",
                description: "Create personalized cover letters in seconds for your top job matches.",
                code: "./applier-pro cover --job-title 'Senior SWE' \\\n  --company 'Google' --variants 3",
              },
              {
                step: "6",
                title: "Batch Apply",
                description: "Apply to 10-20+ jobs automatically with smart rate limiting.",
                code: "./applier-pro batch --max 20 --min-score 75",
              },
              {
                step: "7",
                title: "Market Intelligence",
                description: "Analyze market trends, skill demand, and forecast your career.",
                code: "./applier-pro market --role 'Senior AI Engineer'\n./applier-pro market --forecast",
              },
              {
                step: "8",
                title: "Prepare for Interviews",
                description: "Practice with AI mock interviews and company research.",
                code: "./applier-pro interview\n./applier-pro research 'Anthropic'",
              },
              {
                step: "9",
                title: "Negotiate Offers",
                description: "Get data-driven salary negotiation strategies and scripts.",
                code: "./applier-pro salary --company 'Meta' --target 250000",
              },
            ].map((step) => (
              <div key={step.step} className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-applier-orange to-applier-pink flex items-center justify-center text-2xl font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 mb-4">{step.description}</p>
                  <pre className="bg-black/50 p-4 rounded-lg border border-gray-700 text-sm text-gray-300 overflow-x-auto">
                    {step.code}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-24 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            Your <span className="text-gradient">4-Week</span> Journey to a New Job
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { week: "Week 1", goal: "50 applications", detail: "5 custom cover letters" },
              { week: "Week 2", goal: "8-12 responses", detail: "5-7 phone screens" },
              { week: "Week 3", goal: "2-3 onsites", detail: "Systematic prep" },
              { week: "Week 4", goal: "1-2 offers", detail: "New job! 🎉" },
            ].map((milestone) => (
              <div
                key={milestone.week}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 text-center"
              >
                <div className="text-sm text-gray-400 mb-2">{milestone.week}</div>
                <div className="text-2xl font-bold text-gradient mb-2">{milestone.goal}</div>
                <div className="text-sm text-gray-300">{milestone.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to <span className="text-gradient">Get Hired</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands using applier-pro to land their dream jobs faster.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/profile"
              className="px-12 py-6 bg-gradient-to-r from-applier-orange to-applier-pink text-white text-xl font-bold rounded-lg hover:shadow-2xl hover:shadow-applier-pink/50 transition-all"
            >
              View Full Resume
            </a>
            <a
              href="/dashboard"
              className="px-12 py-6 border-2 border-applier-pink text-white text-xl font-bold rounded-lg hover:bg-applier-pink/10 transition-all"
            >
              Dashboard
            </a>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Open source • Privacy-first • Powered by Claude Sonnet 4
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p className="mb-2">
              Built with <span className="text-gradient">Claude Code</span> • Powered by{" "}
              <span className="text-gradient">Claude Sonnet 4</span>
            </p>
            <p className="text-sm">
              Part of the <span className="text-gradient">BlackRoad OS</span> ecosystem
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
