'use client'

import { useState } from 'react'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  type: 'full-time' | 'contract' | 'remote'
  platform: string
  postedDate: string
  description: string
  url: string
  matchScore: number
}

const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior AI Engineer',
    company: 'Anthropic',
    location: 'San Francisco, CA',
    salary: '$200K - $350K',
    type: 'full-time',
    platform: 'YC Jobs',
    postedDate: '2 days ago',
    description: 'Build safety systems for Claude. Work on constitutional AI, RLHF, and scalable oversight.',
    url: 'https://anthropic.com/careers',
    matchScore: 95
  },
  {
    id: '2',
    title: 'ML Platform Engineer',
    company: 'OpenAI',
    location: 'Remote',
    salary: '$180K - $300K',
    type: 'remote',
    platform: 'LinkedIn',
    postedDate: '1 week ago',
    description: 'Scale GPT-4 infrastructure. Kubernetes, Terraform, distributed systems experience required.',
    url: 'https://openai.com/careers',
    matchScore: 92
  },
  {
    id: '3',
    title: 'Enterprise Sales Engineer - AI',
    company: 'Scale AI',
    location: 'New York, NY',
    salary: '$150K - $250K + equity',
    type: 'full-time',
    platform: 'AngelList',
    postedDate: '3 days ago',
    description: 'Sell AI data platform to F500. Technical sales, demo creation, customer success.',
    url: 'https://scale.com/careers',
    matchScore: 88
  },
  {
    id: '4',
    title: 'AI/ML Architect',
    company: 'Meta',
    location: 'Menlo Park, CA',
    salary: '$220K - $400K',
    type: 'full-time',
    platform: 'Indeed',
    postedDate: '5 days ago',
    description: 'Design LLM inference architecture. PyTorch, CUDA, distributed training at scale.',
    url: 'https://meta.com/careers',
    matchScore: 90
  },
  {
    id: '5',
    title: 'DevOps Engineer - AI Infrastructure',
    company: 'Cohere',
    location: 'Toronto, Canada',
    salary: '$140K - $220K CAD',
    type: 'remote',
    platform: 'Remote OK',
    postedDate: '1 day ago',
    description: 'Build and maintain LLM serving infrastructure. Kubernetes, Terraform, CI/CD.',
    url: 'https://cohere.com/careers',
    matchScore: 85
  },
  {
    id: '6',
    title: 'Technical Account Manager - Enterprise',
    company: 'Hugging Face',
    location: 'Remote (US)',
    salary: '$130K - $180K',
    type: 'remote',
    platform: 'Hacker News',
    postedDate: '1 week ago',
    description: 'Manage enterprise AI deployments. Technical background + customer success experience.',
    url: 'https://huggingface.co/careers',
    matchScore: 82
  }
]

const PLATFORMS = [
  { id: 'all', name: 'All Platforms', count: 1247 },
  { id: 'linkedin', name: 'LinkedIn', count: 523 },
  { id: 'ycombinator', name: 'Y Combinator', count: 189 },
  { id: 'angellist', name: 'AngelList', count: 156 },
  { id: 'remote-ok', name: 'Remote OK', count: 98 },
  { id: 'indeed', name: 'Indeed', count: 234 },
  { id: 'hackernews', name: 'Hacker News', count: 47 }
]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [filterType, setFilterType] = useState<'all' | 'full-time' | 'contract' | 'remote'>('all')
  const [minSalary, setMinSalary] = useState('')
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform = selectedPlatform === 'all' || job.platform.toLowerCase() === selectedPlatform.toLowerCase()
    const matchesType = filterType === 'all' || job.type === filterType
    return matchesSearch && matchesPlatform && matchesType
  }).sort((a, b) => b.matchScore - a.matchScore)

  function saveJob(jobId: string) {
    setSavedJobs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }

  function quickApply(jobId: string) {
    setAppliedJobs(prev => new Set(prev).add(jobId))
    alert('✅ Application submitted! Cover letter auto-generated and sent.')
  }

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
              <a href="/interview" className="text-gray-300 hover:text-white transition">Interview Prep</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔍 Job Board</h1>
          <p className="text-gray-400">AI-powered job matching across 50+ platforms</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, companies, skills..."
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-applier-pink focus:outline-none"
              />
            </div>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-applier-pink focus:outline-none"
            >
              {PLATFORMS.map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.name} ({platform.count})
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-applier-pink focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button className="px-6 py-2 bg-gradient-to-r from-applier-orange to-applier-pink text-white font-semibold rounded-lg hover:shadow-lg transition">
              🔍 Search
            </button>
            <button className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition">
              🔄 Scrape New Jobs
            </button>
            <button className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition">
              💾 Save Search
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar - Platforms */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6 sticky top-4">
              <h2 className="text-xl font-bold text-white mb-4">Platforms</h2>
              <div className="space-y-2">
                {PLATFORMS.map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedPlatform === platform.id
                        ? 'bg-applier-pink/20 border border-applier-pink text-white'
                        : 'bg-gray-900 border border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{platform.name}</span>
                      <span className="text-xs text-gray-500">{platform.count}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="text-sm font-bold text-white mb-3">Quick Filters</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    Remote Only
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    $200K+ Salary
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    AI/ML Focus
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    FAANG Companies
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400">{filteredJobs.length} jobs found</p>
              <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
                <option>Best Match</option>
                <option>Most Recent</option>
                <option>Highest Salary</option>
                <option>Most Relevant</option>
              </select>
            </div>

            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6 hover:border-applier-pink transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">{job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        job.matchScore >= 90 ? 'bg-green-500/20 text-green-400' :
                        job.matchScore >= 80 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {job.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-xl text-applier-orange font-semibold mb-3">{job.company}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                      <span>📍 {job.location}</span>
                      <span>💰 {job.salary}</span>
                      <span>🌐 {job.platform}</span>
                      <span>📅 {job.postedDate}</span>
                      <span className="px-2 py-1 bg-gray-700 rounded text-xs uppercase">{job.type}</span>
                    </div>
                    <p className="text-gray-300 mb-4">{job.description}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => quickApply(job.id)}
                    disabled={appliedJobs.has(job.id)}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${
                      appliedJobs.has(job.id)
                        ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-applier-orange to-applier-pink text-white hover:shadow-lg'
                    }`}
                  >
                    {appliedJobs.has(job.id) ? '✅ Applied' : '🚀 Quick Apply'}
                  </button>
                  <button
                    onClick={() => saveJob(job.id)}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${
                      savedJobs.has(job.id)
                        ? 'bg-applier-pink/20 text-applier-pink border border-applier-pink'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {savedJobs.has(job.id) ? '💾 Saved' : '🔖 Save'}
                  </button>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                  >
                    🔗 View Original
                  </a>
                </div>

                {/* AI Insights */}
                {job.matchScore >= 85 && (
                  <div className="mt-4 p-4 bg-applier-purple/10 border border-applier-purple/30 rounded-lg">
                    <h4 className="text-applier-purple font-bold mb-2">🎯 Why this is a great match:</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li>• Your AI architecture experience aligns perfectly with their infrastructure needs</li>
                      <li>• $26.8M sales background valuable for enterprise AI selling</li>
                      <li>• BlackRoad OS scale (2,119 endpoints, 145 agents) exceeds their requirements</li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
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
