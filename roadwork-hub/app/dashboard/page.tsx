'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Briefcase, Send, Eye, Calendar, TrendingUp, Clock,
  Settings, LogOut, Search, Filter, CheckCircle,
  XCircle, Clock as ClockIcon, Mail, BarChart3
} from 'lucide-react'

export default function Dashboard() {
  const [filter, setFilter] = useState('all')

  const stats = {
    applied: 127,
    viewed: 45,
    interviews: 8,
    offers: 2,
  }

  const recentApplications = [
    {
      id: 1,
      company: 'xAI',
      position: 'Senior Software Engineer',
      salary: '$180k-250k',
      appliedAt: '2 hours ago',
      status: 'viewed',
      platform: 'LinkedIn',
    },
    {
      id: 2,
      company: 'OpenAI',
      position: 'ML Engineer',
      salary: '$200k-280k',
      appliedAt: '5 hours ago',
      status: 'sent',
      platform: 'Indeed',
    },
    {
      id: 3,
      company: 'Anthropic',
      position: 'Research Engineer',
      salary: '$190k-270k',
      appliedAt: '1 day ago',
      status: 'interview',
      platform: 'Company Site',
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Send className="w-4 h-4 text-blue-500" />
      case 'viewed':
        return <Eye className="w-4 h-4 text-purple-500" />
      case 'interview':
        return <Calendar className="w-4 h-4 text-green-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-100 text-blue-700'
      case 'viewed':
        return 'bg-purple-100 text-purple-700'
      case 'interview':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-roadwork-gradient rounded-lg"></div>
            <span className="text-2xl font-bold bg-roadwork-gradient bg-clip-text text-transparent">
              RoadWork
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/browse" className="text-gray-600 hover:text-gray-900 transition-colors">
              Browse Jobs
            </Link>
            <Link href="/dashboard" className="text-orange-600 font-semibold">
              Dashboard
            </Link>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Alexa!</h1>
          <p className="text-gray-600">Here's your job search progress</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <Send className="w-10 h-10 text-blue-500" />
              <span className="text-sm text-gray-500">This month</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.applied}</div>
            <div className="text-gray-600">Applications Sent</div>
            <div className="mt-2 text-sm text-green-600">+23 this week</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-10 h-10 text-purple-500" />
              <span className="text-sm text-gray-500">Engagement</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.viewed}</div>
            <div className="text-gray-600">Profile Views</div>
            <div className="mt-2 text-sm text-green-600">35% view rate</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-10 h-10 text-green-500" />
              <span className="text-sm text-gray-500">Responses</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.interviews}</div>
            <div className="text-gray-600">Interviews</div>
            <div className="mt-2 text-sm text-green-600">6% response rate</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-10 h-10 text-orange-500" />
              <span className="text-sm text-gray-500">Success</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.offers}</div>
            <div className="text-gray-600">Job Offers</div>
            <div className="mt-2 text-sm text-orange-600">Review offers →</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content - Recent Applications */}
          <div className="md:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Applications</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      filter === 'all'
                        ? 'bg-roadwork-gradient text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('interview')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      filter === 'interview'
                        ? 'bg-roadwork-gradient text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Interviews
                  </button>
                  <button
                    onClick={() => setFilter('viewed')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      filter === 'viewed'
                        ? 'bg-roadwork-gradient text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Viewed
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{app.position}</h3>
                        <p className="text-gray-600">{app.company}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(app.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="font-semibold text-orange-600">{app.salary}</span>
                      <span>•</span>
                      <span>{app.platform}</span>
                      <span>•</span>
                      <span>{app.appliedAt}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                        View Application →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button className="text-orange-600 hover:text-orange-700 font-medium">
                  View All Applications →
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Insights */}
          <div className="space-y-6">
            {/* Today's Activity */}
            <div className="card">
              <h3 className="font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-500" />
                Today's Activity
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Applications sent</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jobs searched</span>
                  <span className="font-semibold">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New responses</span>
                  <span className="font-semibold text-green-600">3</span>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="card">
              <h3 className="font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
                Performance Insights
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">View Rate</span>
                    <span className="font-semibold">35%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="font-semibold">6%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '6%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Interview Rate</span>
                    <span className="font-semibold">6%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: '6%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                <p>Your response rate is <span className="font-semibold text-green-600">20% higher</span> than average!</p>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="card bg-roadwork-gradient text-white">
              <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
              <p className="text-sm opacity-90 mb-4">
                Apply to 100+ jobs daily and get priority support
              </p>
              <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors w-full">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
