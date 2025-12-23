'use client'

import { useState } from 'react'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

  const weeklyData = [
    { week: 'Week 1', applications: 12, responses: 2, interviews: 0 },
    { week: 'Week 2', applications: 18, responses: 4, interviews: 1 },
    { week: 'Week 3', applications: 15, responses: 3, interviews: 2 },
    { week: 'Week 4', applications: 22, responses: 5, interviews: 1 },
  ]

  const platformData = [
    { platform: 'LinkedIn', count: 28, percentage: 42 },
    { platform: 'Indeed', count: 15, percentage: 22 },
    { platform: 'AngelList', count: 10, percentage: 15 },
    { platform: 'YC Jobs', count: 8, percentage: 12 },
    { platform: 'Other', count: 6, percentage: 9 },
  ]

  const companyData = [
    { company: 'Anthropic', status: 'Interview', salary: '$250K-$350K', stage: 75 },
    { company: 'OpenAI', status: 'Applied', salary: '$220K-$320K', stage: 25 },
    { company: 'Google', status: 'Phone Screen', salary: '$280K-$400K', stage: 50 },
    { company: 'Meta', status: 'Applied', salary: '$260K-$380K', stage: 25 },
    { company: 'Scale AI', status: 'Rejected', salary: '$180K-$280K', stage: 0 },
  ]

  const skillsData = [
    { skill: 'AI/ML', demand: 95, yourLevel: 90 },
    { skill: 'Sales', demand: 70, yourLevel: 95 },
    { skill: 'Kubernetes', demand: 85, yourLevel: 85 },
    { skill: 'Python', demand: 90, yourLevel: 88 },
    { skill: 'Leadership', demand: 75, yourLevel: 82 },
    { skill: 'Financial Services', demand: 40, yourLevel: 92 },
  ]

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
              <a href="/profile" className="text-gray-300 hover:text-white transition">Profile</a>
              <a href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</a>
              <a href="/jobs" className="text-gray-300 hover:text-white transition">Jobs</a>
              <a href="/interview" className="text-gray-300 hover:text-white transition">Interview</a>
              <a href="/network" className="text-gray-300 hover:text-white transition">Network</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">📊 Analytics</h1>
            <p className="text-gray-400">Track your job search progress and optimize your strategy</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Applications</h3>
            <p className="text-4xl font-bold text-gradient mb-2">67</p>
            <p className="text-sm text-green-400">+23% vs last month</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Response Rate</h3>
            <p className="text-4xl font-bold text-applier-orange mb-2">21%</p>
            <p className="text-sm text-green-400">+6% vs last month</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Interviews</h3>
            <p className="text-4xl font-bold text-applier-pink mb-2">4</p>
            <p className="text-sm text-green-400">+2 this week</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Avg. Salary</h3>
            <p className="text-4xl font-bold text-applier-purple mb-2">$267K</p>
            <p className="text-sm text-gray-400">Across all applications</p>
          </div>
        </div>

        {/* Application Trend */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">📈 Application Activity</h2>
          <div className="space-y-6">
            {weeklyData.map((week, i) => {
              const maxValue = Math.max(...weeklyData.map(w => w.applications))
              const appWidth = (week.applications / maxValue) * 100
              const resWidth = (week.responses / maxValue) * 100
              const intWidth = (week.interviews / maxValue) * 100

              return (
                <div key={week.week}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 font-medium w-24">{week.week}</span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-white">{week.applications} apps</span>
                      <span className="text-applier-orange">{week.responses} responses</span>
                      <span className="text-applier-pink">{week.interviews} interviews</span>
                    </div>
                  </div>
                  <div className="relative h-8 bg-gray-900 rounded-lg overflow-hidden">
                    <div
                      className="absolute h-full bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg transition-all"
                      style={{ width: `${appWidth}%` }}
                    />
                    <div
                      className="absolute h-full bg-gradient-to-r from-applier-orange to-applier-pink rounded-lg transition-all"
                      style={{ width: `${resWidth}%` }}
                    />
                    <div
                      className="absolute h-full bg-gradient-to-r from-applier-pink to-applier-purple rounded-lg transition-all"
                      style={{ width: `${intWidth}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Platform Breakdown */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">🌐 Platform Breakdown</h2>
            <div className="space-y-4">
              {platformData.map((platform) => (
                <div key={platform.platform}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{platform.platform}</span>
                    <span className="text-gray-400">{platform.count} ({platform.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-applier-orange to-applier-pink h-3 rounded-full transition-all"
                      style={{ width: `${platform.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Gap Analysis */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">🎯 Skills Match Analysis</h2>
            <div className="space-y-4">
              {skillsData.map((skill) => {
                const isStrength = skill.yourLevel >= skill.demand
                const gap = Math.abs(skill.yourLevel - skill.demand)

                return (
                  <div key={skill.skill}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{skill.skill}</span>
                      <span className={`text-sm ${isStrength ? 'text-green-400' : 'text-yellow-400'}`}>
                        {isStrength ? `+${gap}% strength` : `-${gap}% gap`}
                      </span>
                    </div>
                    <div className="relative w-full bg-gray-900 rounded-full h-3">
                      <div
                        className="absolute h-3 bg-gray-700 rounded-full"
                        style={{ width: `${skill.demand}%` }}
                        title={`Market demand: ${skill.demand}%`}
                      />
                      <div
                        className={`absolute h-3 rounded-full ${
                          isStrength
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gradient-to-r from-applier-orange to-applier-pink'
                        }`}
                        style={{ width: `${skill.yourLevel}%` }}
                        title={`Your level: ${skill.yourLevel}%`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 p-4 bg-applier-blue/10 border border-applier-blue/30 rounded-lg">
              <p className="text-sm text-gray-300">
                💡 <span className="font-semibold text-applier-blue">Green bars</span> = Your strengths |{' '}
                <span className="font-semibold text-gray-500">Gray bars</span> = Market demand
              </p>
            </div>
          </div>
        </div>

        {/* Active Pipelines */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">🎯 Active Pipelines</h2>
          <div className="space-y-4">
            {companyData.map((company) => (
              <div key={company.company} className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{company.company}</h3>
                    <p className="text-gray-400">{company.salary}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    company.status === 'Interview' ? 'bg-green-500/20 text-green-400' :
                    company.status === 'Phone Screen' ? 'bg-yellow-500/20 text-yellow-400' :
                    company.status === 'Applied' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {company.status}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      company.stage === 0 ? 'bg-red-500' :
                      company.stage < 50 ? 'bg-gradient-to-r from-applier-orange to-applier-pink' :
                      'bg-gradient-to-r from-green-500 to-emerald-500'
                    }`}
                    style={{ width: `${company.stage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-applier-pink p-8">
            <h2 className="text-2xl font-bold text-white mb-4">💡 Key Insights</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-applier-pink">✓</span>
                <span>Your response rate (21%) is <strong className="text-white">2x higher</strong> than the market average (10%)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-applier-pink">✓</span>
                <span>LinkedIn applications convert <strong className="text-white">35% better</strong> than Indeed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-applier-pink">✓</span>
                <span>Applications mentioning your <strong className="text-white">$26.8M sales</strong> get 40% more responses</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-applier-pink">✓</span>
                <span>Best time to apply: <strong className="text-white">Tuesday 9-11am PST</strong></span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-applier-orange p-8">
            <h2 className="text-2xl font-bold text-white mb-4">🚀 Recommendations</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-applier-orange">→</span>
                <span>Apply to <strong className="text-white">5 more AI/ML roles</strong> this week to hit your goal</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-applier-orange">→</span>
                <span>Follow up with <strong className="text-white">OpenAI and Meta</strong> - you applied 5 days ago</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-applier-orange">→</span>
                <span>Focus on <strong className="text-white">YC Jobs and AngelList</strong> - they have your best match rate</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-applier-orange">→</span>
                <span>Prepare for <strong className="text-white">Anthropic interview</strong> - system design expected</span>
              </li>
            </ul>
          </div>
        </div>
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
