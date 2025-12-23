'use client'

import { useState } from 'react'

interface CompanyData {
  name: string
  rating: number
  ceo: string
  founded: string
  size: string
  industry: string
  headquarters: string
  revenue: string
  culture: {
    workLifeBalance: number
    compensation: number
    careerGrowth: number
    management: number
    diversity: number
  }
  pros: string[]
  cons: string[]
  interviewProcess: string[]
  salaryRanges: {
    role: string
    range: string
    equity?: string
  }[]
  recentNews: {
    title: string
    date: string
    sentiment: 'positive' | 'negative' | 'neutral'
  }[]
  redFlags: string[]
  greenFlags: string[]
}

const COMPANIES: Record<string, CompanyData> = {
  'Anthropic': {
    name: 'Anthropic',
    rating: 4.7,
    ceo: 'Dario Amodei',
    founded: '2021',
    size: '300-500 employees',
    industry: 'AI Research & Development',
    headquarters: 'San Francisco, CA',
    revenue: '$500M+ (estimated)',
    culture: {
      workLifeBalance: 85,
      compensation: 95,
      careerGrowth: 90,
      management: 88,
      diversity: 82
    },
    pros: [
      'Cutting-edge AI safety research',
      'World-class team (ex-OpenAI researchers)',
      'Strong mission alignment with AI safety',
      'Excellent compensation packages',
      'Flat hierarchy, high autonomy'
    ],
    cons: [
      'Fast-paced, high-pressure environment',
      'Limited work-life balance during critical launches',
      'Smaller team means wearing many hats',
      'High expectations for performance'
    ],
    interviewProcess: [
      '1. Initial Recruiter Screen (30 min)',
      '2. Technical Screen / Coding Challenge (90 min)',
      '3. Onsite Rounds (4-5 hours):',
      '   - System Design (60 min)',
      '   - Technical Deep Dive (60 min)',
      '   - AI Safety & Ethics Discussion (45 min)',
      '   - Team Fit / Culture (45 min)',
      '4. Final Decision (usually within 1 week)'
    ],
    salaryRanges: [
      { role: 'Senior AI Engineer', range: '$250K - $350K', equity: '0.1% - 0.3%' },
      { role: 'ML Research Scientist', range: '$280K - $400K', equity: '0.15% - 0.4%' },
      { role: 'Staff Engineer', range: '$300K - $450K', equity: '0.2% - 0.5%' }
    ],
    recentNews: [
      { title: 'Anthropic raises $7B Series C', date: '2 weeks ago', sentiment: 'positive' },
      { title: 'Claude 3.5 Sonnet outperforms GPT-4', date: '1 month ago', sentiment: 'positive' },
      { title: 'Partnership with Google Cloud announced', date: '2 months ago', sentiment: 'positive' }
    ],
    greenFlags: [
      'Top-tier funding ($7B+ raised)',
      'Clear mission: AI safety and interpretability',
      'Transparent about research and safety practices',
      'Strong technical team with deep expertise',
      'Competitive compensation (top 10% of industry)'
    ],
    redFlags: []
  },
  'OpenAI': {
    name: 'OpenAI',
    rating: 4.5,
    ceo: 'Sam Altman',
    founded: '2015',
    size: '1,000+ employees',
    industry: 'AI Research & Products',
    headquarters: 'San Francisco, CA',
    revenue: '$2B+ (2024 est.)',
    culture: {
      workLifeBalance: 70,
      compensation: 98,
      careerGrowth: 92,
      management: 75,
      diversity: 78
    },
    pros: [
      'Industry-leading AI products (ChatGPT, GPT-4)',
      'Highest compensation in AI space',
      'Massive impact and visibility',
      'Access to cutting-edge compute resources',
      'Strong brand recognition'
    ],
    cons: [
      'Very long hours during product launches',
      'High stress and burnout rates',
      'Organizational changes and leadership drama',
      'Intense competition internally',
      'Less focus on work-life balance'
    ],
    interviewProcess: [
      '1. Recruiter Phone Screen (30 min)',
      '2. Technical Assessment (take-home or live coding)',
      '3. Virtual Onsite (full day):',
      '   - Coding Interview (90 min)',
      '   - System Design (90 min)',
      '   - ML/AI Technical Discussion (60 min)',
      '   - Product Sense (45 min)',
      '   - Team Matching (30 min)',
      '4. Offer (usually 1-2 weeks after onsite)'
    ],
    salaryRanges: [
      { role: 'Senior Software Engineer', range: '$220K - $320K', equity: 'PPUs (Profit Participation Units)' },
      { role: 'ML Engineer', range: '$250K - $350K', equity: 'PPUs' },
      { role: 'Research Scientist', range: '$300K - $500K', equity: 'PPUs' }
    ],
    recentNews: [
      { title: 'Sam Altman reinstated as CEO', date: '3 months ago', sentiment: 'neutral' },
      { title: 'GPT-4 Turbo released', date: '1 month ago', sentiment: 'positive' },
      { title: 'Partnership with Microsoft extended', date: '2 months ago', sentiment: 'positive' }
    ],
    greenFlags: [
      'Market leader in generative AI',
      'Massive compute resources ($10B+ from Microsoft)',
      'Highest compensation packages',
      'Strong product-market fit (ChatGPT: 100M+ users)'
    ],
    redFlags: [
      'Leadership instability (board drama, CEO ousting)',
      'High burnout and turnover rates',
      'Unclear equity value (PPUs, not traditional equity)',
      'Work-life balance concerns reported by employees'
    ]
  }
}

export default function CompanyResearchPage() {
  const [selectedCompany, setSelectedCompany] = useState<string>('Anthropic')
  const [searchQuery, setSearchQuery] = useState('')
  const [comparisonMode, setComparisonMode] = useState(false)
  const [compareWith, setCompareWith] = useState<string>('OpenAI')

  const company = COMPANIES[selectedCompany]
  const compareCompany = COMPANIES[compareWith]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold">
              <span className="text-gradient">applier</span>
              <span className="text-white">-pro</span>
            </a>
            <div className="flex gap-6">
              <a href="/" className="text-gray-300 hover:text-white transition">Home</a>
              <a href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</a>
              <a href="/jobs" className="text-gray-300 hover:text-white transition">Jobs</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🔍 Company Research</h1>
            <p className="text-gray-400">Deep insights into culture, compensation, and interview processes</p>
          </div>
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              comparisonMode
                ? 'bg-applier-pink text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {comparisonMode ? '✓ Comparison Mode' : '⚖️ Compare Companies'}
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies (Anthropic, OpenAI, Google, Meta, etc.)"
            className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:border-applier-pink focus:outline-none"
          />
        </div>

        {/* Company Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.keys(COMPANIES).map((companyName) => (
            <button
              key={companyName}
              onClick={() => setSelectedCompany(companyName)}
              className={`p-6 rounded-lg border-2 transition ${
                selectedCompany === companyName
                  ? 'bg-applier-pink/20 border-applier-pink'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <h3 className="font-bold text-white text-lg">{companyName}</h3>
              <p className="text-sm text-gray-400 mt-1">★ {COMPANIES[companyName].rating}</p>
            </button>
          ))}
        </div>

        {!comparisonMode ? (
          /* Single Company View */
          <div className="space-y-8">
            {/* Company Overview */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{company.name}</h2>
                  <p className="text-xl text-gray-400">{company.industry}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-applier-orange mb-1">{company.rating}</div>
                  <div className="text-sm text-gray-400">Overall Rating</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-gray-300">
                <div>
                  <p className="text-gray-400 text-sm">CEO</p>
                  <p className="font-semibold">{company.ceo}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Founded</p>
                  <p className="font-semibold">{company.founded}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Size</p>
                  <p className="font-semibold">{company.size}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Headquarters</p>
                  <p className="font-semibold">{company.headquarters}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Revenue</p>
                  <p className="font-semibold">{company.revenue}</p>
                </div>
              </div>
            </div>

            {/* Culture Scores */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">📊 Culture Breakdown</h3>
              <div className="space-y-4">
                {Object.entries(company.culture).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-white font-bold">{value}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          value >= 85 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          value >= 70 ? 'bg-gradient-to-r from-applier-orange to-applier-pink' :
                          'bg-gradient-to-r from-red-500 to-orange-500'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Pros */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-green-500/30 p-8">
                <h3 className="text-2xl font-bold text-white mb-4">✅ Pros</h3>
                <ul className="space-y-3">
                  {company.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="text-green-400">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-red-500/30 p-8">
                <h3 className="text-2xl font-bold text-white mb-4">❌ Cons</h3>
                <ul className="space-y-3">
                  {company.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="text-red-400">−</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interview Process */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">🎤 Interview Process</h3>
              <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm text-gray-300 space-y-2">
                {company.interviewProcess.map((step, i) => (
                  <p key={i}>{step}</p>
                ))}
              </div>
            </div>

            {/* Salary Ranges */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">💰 Salary Ranges</h3>
              <div className="space-y-4">
                {company.salaryRanges.map((salary, i) => (
                  <div key={i} className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-lg mb-1">{salary.role}</h4>
                        <p className="text-2xl text-applier-orange font-bold">{salary.range}</p>
                        {salary.equity && (
                          <p className="text-sm text-gray-400 mt-1">Equity: {salary.equity}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Red/Green Flags */}
            <div className="grid md:grid-cols-2 gap-8">
              {company.greenFlags.length > 0 && (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-green-500/30 p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">🟢 Green Flags</h3>
                  <ul className="space-y-2">
                    {company.greenFlags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                        <span className="text-green-400">✓</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {company.redFlags.length > 0 && (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-red-500/30 p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">🔴 Red Flags</h3>
                  <ul className="space-y-2">
                    {company.redFlags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                        <span className="text-red-400">⚠</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Recent News */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">📰 Recent News</h3>
              <div className="space-y-3">
                {company.recentNews.map((news, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-gray-900 rounded-lg">
                    <span className={`px-3 py-1 rounded text-xs font-bold ${
                      news.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                      news.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {news.sentiment}
                    </span>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{news.title}</p>
                      <p className="text-sm text-gray-400">{news.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Comparison Mode */
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <select
                value={compareWith}
                onChange={(e) => setCompareWith(e.target.value)}
                className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                {Object.keys(COMPANIES).filter(c => c !== selectedCompany).map((companyName) => (
                  <option key={companyName} value={companyName}>{companyName}</option>
                ))}
              </select>
              <span className="text-gray-400 text-xl">vs</span>
              <div className="px-6 py-3 bg-applier-pink/20 border border-applier-pink rounded-lg text-white font-bold">
                {selectedCompany}
              </div>
            </div>

            {/* Side-by-side comparison */}
            <div className="grid md:grid-cols-2 gap-8">
              {[compareCompany, company].map((comp) => (
                <div key={comp.name} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">{comp.name}</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-gray-400">Overall Rating</p>
                      <p className="text-2xl font-bold text-applier-orange">{comp.rating}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Work-Life Balance</p>
                      <p className="text-lg font-semibold text-white">{comp.culture.workLifeBalance}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Compensation</p>
                      <p className="text-lg font-semibold text-white">{comp.culture.compensation}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Career Growth</p>
                      <p className="text-lg font-semibold text-white">{comp.culture.careerGrowth}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Company Size</p>
                      <p className="text-white">{comp.size}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400 text-sm">
            Built with <span className="text-gradient">Claude Code</span> • Part of <span className="text-gradient">BlackRoad OS</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
