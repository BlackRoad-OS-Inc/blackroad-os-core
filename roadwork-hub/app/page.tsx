'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Briefcase, Search, FileText, TrendingUp, Clock,
  Zap, Target, Mail, BarChart3, Calendar, Check,
  ArrowRight, Star, Users, Shield
} from 'lucide-react'

export default function Home() {
  const [email, setEmail] = useState('')

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-roadwork-gradient rounded-lg"></div>
            <span className="text-2xl font-bold bg-roadwork-gradient bg-clip-text text-transparent">
              RoadWork
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-gray-600 hover:text-gray-900 transition-colors">
              Browse Jobs
            </Link>
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
              Login
            </Link>
            <Link href="/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm mb-8 animate-slide-up">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Trusted by 1,000+ job seekers</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
              Your AI Career
              <span className="block bg-roadwork-gradient bg-clip-text text-transparent">
                Co-Pilot
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 animate-slide-up">
              Apply to 100+ jobs daily while you sleep.
              <span className="block mt-2">Wake up to interview invites. Get hired faster.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up">
              <Link href="/signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/browse" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center">
                <Search className="mr-2 w-5 h-5" />
                Browse Jobs
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
              <div>
                <div className="text-3xl font-bold bg-roadwork-gradient bg-clip-text text-transparent">30+</div>
                <div className="text-sm text-gray-600 mt-1">Job Platforms</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-roadwork-gradient bg-clip-text text-transparent">100+</div>
                <div className="text-sm text-gray-600 mt-1">Apps per Day</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-roadwork-gradient bg-clip-text text-transparent">95%</div>
                <div className="text-sm text-gray-600 mt-1">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How RoadWork Works</h2>
            <p className="text-xl text-gray-600">Four simple steps to your dream job</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-roadwork-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Quick Onboarding</h3>
              <p className="text-gray-600">
                AI interviews you about your work history. Upload your resume. Swipe on job preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-roadwork-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI Searches Daily</h3>
              <p className="text-gray-600">
                We search 30+ platforms every day and find perfect matches for your skills.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-roadwork-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Auto-Apply</h3>
              <p className="text-gray-600">
                Tailored resumes and cover letters generated. Applications submitted automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-roadwork-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Get Hired</h3>
              <p className="text-gray-600">
                Track responses. Schedule interviews. Compare offers. Accept the best one!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600">Complete job hunting automation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card hover:shadow-xl transition-shadow">
              <Briefcase className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">30+ Job Platforms</h3>
              <p className="text-gray-600">
                Indeed, LinkedIn, Glassdoor, ZipRecruiter, Monster, and 25+ more platforms.
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <FileText className="w-12 h-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Resume Tailoring</h3>
              <p className="text-gray-600">
                One resume becomes infinite tailored versions. Each job gets a perfect match.
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <Zap className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Cover Letters</h3>
              <p className="text-gray-600">
                AI writes genuine, specific content that gets you noticed by recruiters.
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <Target className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tinder-Style Matching</h3>
              <p className="text-gray-600">
                Swipe right on jobs you love. AI learns your preferences and finds perfect matches.
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <Mail className="w-12 h-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email Integration</h3>
              <p className="text-gray-600">
                Reads job alerts from Gmail. Validates companies. Applies directly to their sites.
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <BarChart3 className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Complete Analytics</h3>
              <p className="text-gray-600">
                Track views, downloads, responses. See which platforms work best for you.
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <Calendar className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interview Scheduler</h3>
              <p className="text-gray-600">
                Auto-proposes times. Sends calendar invites. Follow-up reminders. Thank you emails.
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <Clock className="w-12 h-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Daily Automation</h3>
              <p className="text-gray-600">
                Set it and forget it. Runs daily at your chosen time. Email summaries each morning.
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <Shield className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">100% Transparent</h3>
              <p className="text-gray-600">
                Review every application before submission. Full control. No surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your job search</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="card border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-bold mb-2">$0</div>
                <p className="text-gray-600">Perfect for testing</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>10 applications/day</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>5 job platforms</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Email support</span>
                </li>
              </ul>

              <Link href="/signup?plan=free" className="btn-secondary w-full text-center block">
                Start Free
              </Link>
            </div>

            {/* Pro - Popular */}
            <div className="card border-2 border-orange-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-roadwork-gradient text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-2">$20</div>
                <p className="text-gray-600">Per month</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>100 applications/day</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>All 30+ platforms</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Interview scheduler</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>

              <Link href="/signup?plan=pro" className="btn-primary w-full text-center block">
                Start Pro Trial
              </Link>
            </div>

            {/* Premium */}
            <div className="card border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="text-4xl font-bold mb-2">$50</div>
                <p className="text-gray-600">Per month (capped)</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited applications</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>All platforms</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Real-time analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Custom workflows</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>24/7 support</span>
                </li>
              </ul>

              <Link href="/signup?plan=premium" className="btn-secondary w-full text-center block">
                Start Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-roadwork-gradient">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Automate Your Job Search?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 1,000+ job seekers who landed their dream jobs with RoadWork
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/browse" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center">
              <Search className="mr-2 w-5 h-5" />
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-roadwork-gradient rounded-lg"></div>
                <span className="text-xl font-bold text-white">RoadWork</span>
              </div>
              <p className="text-sm">
                Your AI Career Co-Pilot. Automate your job search and get hired faster.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/browse" className="hover:text-white transition-colors">Browse Jobs</Link></li>
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://blackroad.io" className="hover:text-white transition-colors">About BlackRoad</a></li>
                <li><a href="mailto:blackroad.systems@gmail.com" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 RoadWork by BlackRoad OS. All rights reserved.</p>
            <p className="mt-2">Built with ❤️ by Alexa Amundson</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
