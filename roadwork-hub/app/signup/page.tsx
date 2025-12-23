'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Lock, User, Loader2, Check } from 'lucide-react'

export default function Signup() {
  const [plan, setPlan] = useState('free')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const planParam = params.get('plan')
    if (planParam) setPlan(planParam)
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Implement actual signup
    setTimeout(() => {
      window.location.href = '/onboarding'
    }, 1500)
  }

  const planDetails = {
    free: { name: 'Free', price: '$0', apps: '10/day' },
    pro: { name: 'Pro', price: '$20', apps: '100/day' },
    premium: { name: 'Premium', price: '$50', apps: 'Unlimited' },
  }

  const selectedPlan = planDetails[plan as keyof typeof planDetails] || planDetails.free

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
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

          <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
            Already have an account? <span className="font-semibold">Login</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left - Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Create your account</h1>
              <p className="text-gray-600">Start applying to jobs automatically in minutes</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-orange-600 hover:text-orange-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-orange-600 hover:text-orange-700">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Right - Plan Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-500">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{selectedPlan.name} Plan</h3>
                  <div className="text-4xl font-bold mt-2 bg-roadwork-gradient bg-clip-text text-transparent">
                    {selectedPlan.price}
                    {selectedPlan.price !== '$0' && <span className="text-lg">/month</span>}
                  </div>
                </div>
                {plan === 'pro' && (
                  <div className="bg-roadwork-gradient text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </div>
                )}
              </div>

              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>{selectedPlan.apps}</strong> automatic applications</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>AI resume tailoring</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Smart cover letters</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Application tracking</span>
                </li>
                {(plan === 'pro' || plan === 'premium') && (
                  <>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>All 30+ job platforms</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Interview scheduler</span>
                    </li>
                  </>
                )}
                {plan === 'premium' && (
                  <>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Custom workflows</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>24/7 priority support</span>
                    </li>
                  </>
                )}
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link href="/#pricing" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                  Change plan →
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl p-6">
              <h4 className="font-semibold mb-3">What happens next?</h4>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">1.</span>
                  <span>Quick AI interview about your work history (2 min)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">2.</span>
                  <span>Upload your resume and swipe on job preferences</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">3.</span>
                  <span>RoadWork starts applying to jobs automatically</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">4.</span>
                  <span>Wake up to interview invites! 🎉</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
