'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search, MapPin, DollarSign, Briefcase, Building2,
  Clock, ExternalLink, Filter, ArrowLeft, Loader2
} from 'lucide-react'

interface Job {
  id: string
  title: string
  company: string
  description: string
  category: string
  salary?: string
  location: string
  url: string
  posted_at: string
  application_count: number
}

export default function BrowseJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      // TODO: Replace with actual API endpoint
      // For now, use mock data
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Senior Software Engineer',
          company: 'xAI',
          description: 'Join Elon\'s AI company building safe AGI',
          category: 'Tech',
          salary: '$180k-250k',
          location: 'Remote (US)',
          url: 'https://x.ai/careers',
          posted_at: new Date().toISOString(),
          application_count: 12
        },
        {
          id: '2',
          title: 'Customer Success Manager',
          company: 'ExtraHop',
          description: 'Help enterprise customers succeed with network security',
          category: 'Customer Service',
          salary: '$80k-120k',
          location: 'Remote',
          url: 'https://www.extrahop.com/careers',
          posted_at: new Date().toISOString(),
          application_count: 8
        },
        {
          id: '3',
          title: 'Finance Manager',
          company: 'ReFED',
          description: 'Drive financial strategy for food waste reduction nonprofit',
          category: 'Finance',
          salary: '$90k-130k',
          location: 'Remote (US)',
          url: 'https://refed.org/careers',
          posted_at: new Date().toISOString(),
          application_count: 15
        }
      ]
      setJobs(mockJobs)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
      setLoading(false)
    }
  }

  const categories = ['all', 'Tech', 'Sales', 'Customer Service', 'Finance', 'Marketing', 'Admin']

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-roadwork-gradient rounded-lg"></div>
              <span className="text-2xl font-bold bg-roadwork-gradient bg-clip-text text-transparent">
                RoadWork
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
              Login
            </Link>
            <Link href="/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Browse Remote Jobs</h1>
          <p className="text-xl text-gray-600">
            {filteredJobs.length} remote jobs available. Apply with RoadWork to automate your application.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs, companies, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-roadwork-gradient text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredJobs.length}</span> jobs
          </p>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        {job.category}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{job.location}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4">{job.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Posted {new Date(job.posted_at).toLocaleDateString()}</span>
                      </div>
                      <span>{job.application_count} applications</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Link
                    href={`/signup?job=${job.id}`}
                    className="btn-primary flex-1 text-center"
                  >
                    Apply with RoadWork
                  </Link>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center"
                  >
                    View Job
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="bg-roadwork-gradient text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Want to apply to ALL these jobs automatically?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sign up for RoadWork and apply to 100+ jobs daily while you sleep.
          </p>
          <Link href="/signup" className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block">
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  )
}
