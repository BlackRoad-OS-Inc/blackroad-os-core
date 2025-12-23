'use client'

import { useState } from 'react'

interface Milestone {
  id: string
  year: string
  company: string
  role: string
  achievement: string
  salary: number
  skills: string[]
  impact: string
  type: 'past' | 'current' | 'future'
}

const CAREER_TIMELINE: Milestone[] = [
  {
    id: '1',
    year: '2019',
    company: 'Enterprise Holdings',
    role: 'Customer Experience Representative',
    achievement: '63% upsell conversion, 3× sales awards',
    salary: 35000,
    skills: ['Sales', 'Customer Service', 'Upselling'],
    impact: 'Foundation in sales fundamentals',
    type: 'past'
  },
  {
    id: '2',
    year: '2022-2023',
    company: 'EXP Realty',
    role: 'Real Estate Agent',
    achievement: '10% conversion on 1,000+ cold calls',
    salary: 65000,
    skills: ['Cold Calling', 'Negotiation', 'Real Estate'],
    impact: 'Mastered cold outreach and deal closing',
    type: 'past'
  },
  {
    id: '3',
    year: '2023-2024',
    company: 'Ameriprise Financial',
    role: 'Financial Advisor / Advisor in Training',
    achievement: 'Ranked #1 on training team, 2,400+ calls, 10% conversion',
    salary: 85000,
    skills: ['Financial Planning', 'Series 7/63/65', 'Call Automation'],
    impact: 'Earned FINRA licenses + Thought Leadership Award',
    type: 'past'
  },
  {
    id: '4',
    year: '2024-2025',
    company: 'Securian Financial',
    role: 'Internal Annuity Wholesaler / Senior Sales Analyst',
    achievement: '$26.8M in sales (92% of goal, +38% territory growth)',
    salary: 120000,
    skills: ['Enterprise Sales', 'Salesforce Automation', 'Presenting'],
    impact: 'LPL conference presenter, eliminated 3,000 CRM errors',
    type: 'past'
  },
  {
    id: '5',
    year: '2025-Present',
    company: 'BlackRoad OS, Inc.',
    role: 'Founder & Chief Architect',
    achievement: '466K LOC, 2,119 endpoints, 145 autonomous agents',
    salary: 0,
    skills: ['AI/ML', 'System Architecture', 'Kubernetes', 'Terraform', 'Python', 'TypeScript'],
    impact: 'Building production-grade cognitive AI operating system',
    type: 'current'
  },
  {
    id: '6',
    year: '2026',
    company: 'Anthropic / OpenAI / Top AI Startup',
    role: 'Senior AI Engineer / Staff Engineer',
    achievement: 'Target: $300K+ TC, lead AI safety initiatives',
    salary: 300000,
    skills: ['LLM Architecture', 'AI Safety', 'Distributed Systems', 'Leadership'],
    impact: 'Shape the future of safe, beneficial AI',
    type: 'future'
  },
  {
    id: '7',
    year: '2027-2028',
    company: 'Top AI Company',
    role: 'Principal Engineer / Engineering Manager',
    achievement: 'Target: $450K+ TC, manage 10-15 engineers',
    salary: 450000,
    skills: ['Technical Leadership', 'Team Building', 'Strategy', 'Product Vision'],
    impact: 'Lead critical AI infrastructure and safety projects',
    type: 'future'
  },
  {
    id: '8',
    year: '2029-2030',
    company: 'VP Engineering or Startup CTO',
    role: 'VP of Engineering / CTO',
    achievement: 'Target: $600K+ TC + significant equity',
    salary: 600000,
    skills: ['Executive Leadership', 'Fundraising', 'Org Building', 'Vision'],
    impact: 'Shape organizational strategy and AI ethics standards',
    type: 'future'
  }
]

const SKILL_PROGRESSION = [
  { skill: 'Sales & Revenue', past: 20, current: 95, future: 85, color: 'from-applier-orange to-applier-pink' },
  { skill: 'AI/ML Engineering', past: 0, current: 90, future: 98, color: 'from-applier-pink to-applier-purple' },
  { skill: 'System Architecture', past: 10, current: 85, future: 95, color: 'from-applier-purple to-applier-blue' },
  { skill: 'Leadership', past: 30, current: 70, future: 95, color: 'from-applier-blue to-green-500' },
  { skill: 'Financial Services', past: 40, current: 92, future: 75, color: 'from-green-500 to-emerald-500' }
]

export default function CareerRoadmapPage() {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [viewMode, setViewMode] = useState<'timeline' | 'skills' | 'salary'>('timeline')

  const pastMilestones = CAREER_TIMELINE.filter(m => m.type === 'past')
  const currentMilestone = CAREER_TIMELINE.find(m => m.type === 'current')
  const futureMilestones = CAREER_TIMELINE.filter(m => m.type === 'future')

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
              <a href="/analytics" className="text-gray-300 hover:text-white transition">Analytics</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🗺️ Career Roadmap</h1>
          <p className="text-gray-400">Visualize your career journey from Enterprise to AI leadership</p>
        </div>

        {/* View Selector */}
        <div className="flex gap-4 mb-8">
          {[
            { id: 'timeline', label: '📅 Timeline View', icon: '📅' },
            { id: 'skills', label: '📊 Skills Growth', icon: '📊' },
            { id: 'salary', label: '💰 Compensation', icon: '💰' }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setViewMode(view.id as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                viewMode === view.id
                  ? 'bg-gradient-to-r from-applier-orange to-applier-pink text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {viewMode === 'timeline' && (
          <div className="space-y-12">
            {/* Past Milestones */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">📚 Past Experience (2019-2025)</h2>
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-700 to-gray-800"></div>

                <div className="space-y-8">
                  {pastMilestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex gap-6">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-4 border-gray-900 flex items-center justify-center z-10">
                        <span className="text-white font-bold text-sm">{milestone.year}</span>
                      </div>
                      <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{milestone.role}</h3>
                            <p className="text-applier-orange font-semibold">{milestone.company}</p>
                          </div>
                          <span className="px-4 py-2 bg-gray-700 text-gray-300 rounded-full text-sm">
                            ${(milestone.salary / 1000).toFixed(0)}K
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{milestone.achievement}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {milestone.skills.map((skill) => (
                            <span key={skill} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-applier-purple">💡 {milestone.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Current */}
            {currentMilestone && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">⭐ Current Role</h2>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-applier-orange to-applier-pink border-4 border-gray-900 flex items-center justify-center z-10 animate-pulse">
                    <span className="text-white font-bold text-sm">NOW</span>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-applier-orange/20 to-applier-pink/20 rounded-lg border-2 border-applier-pink p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{currentMilestone.role}</h3>
                        <p className="text-xl text-applier-orange font-semibold">{currentMilestone.company}</p>
                      </div>
                      <span className="px-6 py-3 bg-applier-pink text-white rounded-full font-bold">
                        Founder
                      </span>
                    </div>
                    <p className="text-white text-lg mb-4">{currentMilestone.achievement}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentMilestone.skills.map((skill) => (
                        <span key={skill} className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="text-applier-purple font-semibold text-lg">🚀 {currentMilestone.impact}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Future Projections */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">🔮 Future Trajectory (2026-2030)</h2>
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-applier-pink via-applier-purple to-applier-blue"></div>

                <div className="space-y-8">
                  {futureMilestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex gap-6">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-applier-purple to-applier-blue border-4 border-gray-900 flex items-center justify-center z-10">
                        <span className="text-white font-bold text-sm">{milestone.year.split('-')[0]}</span>
                      </div>
                      <div className="flex-1 bg-gradient-to-br from-applier-purple/10 to-applier-blue/10 rounded-lg border border-applier-purple p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{milestone.role}</h3>
                            <p className="text-applier-blue font-semibold">{milestone.company}</p>
                          </div>
                          <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-bold">
                            ${(milestone.salary / 1000).toFixed(0)}K TC
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{milestone.achievement}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {milestone.skills.map((skill) => (
                            <span key={skill} className="px-3 py-1 bg-applier-blue/20 text-applier-blue rounded-full text-xs font-semibold">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-green-400">🎯 {milestone.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'skills' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">📊 Skills Evolution Over Time</h2>
              <div className="space-y-8">
                {SKILL_PROGRESSION.map((skill) => (
                  <div key={skill.skill}>
                    <h3 className="text-lg font-bold text-white mb-4">{skill.skill}</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Past (2019-2023)</p>
                        <div className="w-full bg-gray-700 rounded-full h-4">
                          <div
                            className={`bg-gradient-to-r ${skill.color} h-4 rounded-full transition-all`}
                            style={{ width: `${skill.past}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{skill.past}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Current (2025)</p>
                        <div className="w-full bg-gray-700 rounded-full h-4">
                          <div
                            className={`bg-gradient-to-r ${skill.color} h-4 rounded-full transition-all`}
                            style={{ width: `${skill.current}%` }}
                          />
                        </div>
                        <p className="text-xs text-white font-bold mt-1">{skill.current}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Target (2028)</p>
                        <div className="w-full bg-gray-700 rounded-full h-4">
                          <div
                            className={`bg-gradient-to-r ${skill.color} h-4 rounded-full transition-all`}
                            style={{ width: `${skill.future}%` }}
                          />
                        </div>
                        <p className="text-xs text-green-400 font-bold mt-1">{skill.future}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Paths */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-applier-purple p-8">
              <h2 className="text-2xl font-bold text-white mb-6">📚 Recommended Learning Paths</h2>
              <div className="space-y-4">
                {[
                  { topic: 'Advanced System Design', reason: 'For Staff+ engineering roles', duration: '3-6 months', resources: ['System Design Interview book', 'Grokking the System Design Interview'] },
                  { topic: 'AI Safety & Ethics', reason: 'Critical for AI leadership positions', duration: '2-4 months', resources: ['AI Alignment Forum', 'Anthropic research papers'] },
                  { topic: 'Engineering Management', reason: 'Transition to leadership track', duration: '6-12 months', resources: ['The Manager\'s Path', 'Stripe Atlas'] },
                  { topic: 'Executive Communication', reason: 'VP/CTO level presentations', duration: '3-6 months', resources: ['Executive Presence', 'TED Talk coaching'] }
                ].map((path, i) => (
                  <div key={i} className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white">{path.topic}</h3>
                      <span className="px-3 py-1 bg-applier-purple/20 text-applier-purple rounded text-xs font-semibold">
                        {path.duration}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{path.reason}</p>
                    <div className="flex flex-wrap gap-2">
                      {path.resources.map((resource) => (
                        <span key={resource} className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                          📖 {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'salary' && (
          <div className="space-y-8">
            {/* Salary Progression Chart */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">💰 Compensation Progression</h2>
              <div className="relative h-96">
                {CAREER_TIMELINE.map((milestone, index) => {
                  const maxSalary = 600000
                  const height = (milestone.salary / maxSalary) * 100
                  const left = (index / (CAREER_TIMELINE.length - 1)) * 100

                  return (
                    <div
                      key={milestone.id}
                      className="absolute bottom-0"
                      style={{ left: `${left}%`, height: `${height}%`, width: '8%' }}
                    >
                      <div className={`h-full rounded-t-lg ${
                        milestone.type === 'past' ? 'bg-gradient-to-t from-gray-600 to-gray-700' :
                        milestone.type === 'current' ? 'bg-gradient-to-t from-applier-orange to-applier-pink' :
                        'bg-gradient-to-t from-applier-purple to-applier-blue'
                      }`}>
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <p className="text-white font-bold text-sm">${(milestone.salary / 1000).toFixed(0)}K</p>
                          <p className="text-gray-400 text-xs">{milestone.year}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-4 text-xs text-gray-400">
                {CAREER_TIMELINE.map((m) => (
                  <div key={m.id} className="text-center" style={{ width: `${100 / CAREER_TIMELINE.length}%` }}>
                    {m.company.split(' ')[0]}
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Metrics */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6 text-center">
                <h3 className="text-sm text-gray-400 mb-2">Total Career Growth</h3>
                <p className="text-4xl font-bold text-gradient mb-2">+1,614%</p>
                <p className="text-xs text-gray-500">$35K → $600K (projected)</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6 text-center">
                <h3 className="text-sm text-gray-400 mb-2">Avg. Annual Growth</h3>
                <p className="text-4xl font-bold text-applier-orange mb-2">+25%</p>
                <p className="text-xs text-gray-500">Per year since 2019</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6 text-center">
                <h3 className="text-sm text-gray-400 mb-2">Time to $600K</h3>
                <p className="text-4xl font-bold text-applier-pink mb-2">5 years</p>
                <p className="text-xs text-gray-500">From current (2025 → 2030)</p>
              </div>
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
