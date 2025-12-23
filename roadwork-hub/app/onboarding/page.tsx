'use client'

import { useState } from 'react'
import { ArrowRight, ArrowLeft, Upload, Check, User, Briefcase, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react'

const jobTitles = [
  { id: 1, title: 'Software Engineer', category: 'Tech', salary: '$120k-180k' },
  { id: 2, title: 'Product Manager', category: 'Management', salary: '$130k-200k' },
  { id: 3, title: 'Data Scientist', category: 'Tech', salary: '$110k-170k' },
  { id: 4, title: 'Customer Success Manager', category: 'Sales', salary: '$70k-110k' },
  { id: 5, title: 'Marketing Manager', category: 'Marketing', salary: '$80k-130k' },
  { id: 6, title: 'DevOps Engineer', category: 'Tech', salary: '$125k-190k' },
  { id: 7, title: 'Sales Executive', category: 'Sales', salary: '$60k-120k + commission' },
  { id: 8, title: 'UX Designer', category: 'Design', salary: '$90k-140k' },
  { id: 9, title: 'Finance Manager', category: 'Finance', salary: '$100k-150k' },
  { id: 10, title: 'HR Business Partner', category: 'HR', salary: '$85k-125k' },
]

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [profileData, setProfileData] = useState({
    name: '',
    pronunciation: '',
    resumeFile: null as File | null,
    likedJobs: [] as number[],
    dislikedJobs: [] as number[],
  })
  const [currentJobIndex, setCurrentJobIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  const totalSteps = 5

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentJob = jobTitles[currentJobIndex]

    setSwipeDirection(direction)

    setTimeout(() => {
      if (direction === 'right') {
        setProfileData({
          ...profileData,
          likedJobs: [...profileData.likedJobs, currentJob.id],
        })
      } else {
        setProfileData({
          ...profileData,
          dislikedJobs: [...profileData.dislikedJobs, currentJob.id],
        })
      }

      if (currentJobIndex < jobTitles.length - 1) {
        setCurrentJobIndex(currentJobIndex + 1)
      } else {
        setStep(5)
      }

      setSwipeDirection(null)
    }, 300)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileData({ ...profileData, resumeFile: file })
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="max-w-2xl mx-auto text-center">
            <Sparkles className="w-16 h-16 text-orange-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Welcome to RoadWork!</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let's get you set up in under 5 minutes. We'll ask a few quick questions
              to personalize your job search automation.
            </p>

            <div className="grid grid-cols-4 gap-4 mb-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-roadwork-gradient rounded-full flex items-center justify-center mx-auto mb-2">
                  <User className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-600">Your Info</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">Upload Resume</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Briefcase className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">Job Preferences</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Check className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">All Set!</p>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="btn-primary text-lg px-8 py-4">
              Let's Get Started
              <ArrowRight className="ml-2 w-5 h-5 inline" />
            </button>
          </div>
        )

      case 2:
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">Tell us about yourself</h2>
            <p className="text-gray-600 mb-8 text-center">This helps us personalize your applications</p>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How do you pronounce your name?
                  </label>
                  <input
                    type="text"
                    value={profileData.pronunciation}
                    onChange={(e) => setProfileData({ ...profileData, pronunciation: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="jayn doh"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This helps recruiters address you correctly in interviews
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(1)} className="btn-secondary">
                  <ArrowLeft className="mr-2 w-5 h-5 inline" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!profileData.name}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="ml-2 w-5 h-5 inline" />
                </button>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">Upload your resume</h2>
            <p className="text-gray-600 mb-8 text-center">
              We'll use this to tailor applications to each job
            </p>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-orange-500 transition-colors">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />

                {profileData.resumeFile ? (
                  <div>
                    <p className="text-lg font-semibold text-green-600 mb-2">
                      ✓ {profileData.resumeFile.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      {(profileData.resumeFile.size / 1024).toFixed(0)} KB
                    </p>
                    <label className="btn-secondary cursor-pointer">
                      Upload Different File
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-semibold mb-2">
                      Drag and drop your resume here
                    </p>
                    <p className="text-gray-600 mb-4">or</p>
                    <label className="btn-primary cursor-pointer">
                      Browse Files
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-4">
                      Supports PDF, DOC, DOCX, TXT (max 5MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(2)} className="btn-secondary">
                  <ArrowLeft className="mr-2 w-5 h-5 inline" />
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!profileData.resumeFile}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="ml-2 w-5 h-5 inline" />
                </button>
              </div>
            </div>
          </div>
        )

      case 4:
        const currentJob = jobTitles[currentJobIndex]

        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">Swipe on job titles</h2>
            <p className="text-gray-600 mb-8 text-center">
              Swipe right on jobs you'd apply to, left on ones you wouldn't
            </p>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  {currentJobIndex + 1} of {jobTitles.length}
                </p>
              </div>

              <div className="relative h-96 mb-8">
                <div
                  className={`swipe-card bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8 flex flex-col items-center justify-center ${
                    swipeDirection === 'left' ? 'swipe-left' : swipeDirection === 'right' ? 'swipe-right' : ''
                  }`}
                >
                  <Briefcase className="w-16 h-16 text-orange-500 mb-4" />
                  <h3 className="text-3xl font-bold mb-2">{currentJob.title}</h3>
                  <p className="text-lg text-gray-600 mb-2">{currentJob.category}</p>
                  <p className="text-lg font-semibold text-orange-600">{currentJob.salary}</p>
                </div>
              </div>

              <div className="flex justify-center space-x-6">
                <button
                  onClick={() => handleSwipe('left')}
                  className="w-16 h-16 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <ThumbsDown className="w-8 h-8 text-red-600" />
                </button>
                <button
                  onClick={() => handleSwipe('right')}
                  className="w-16 h-16 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <ThumbsUp className="w-8 h-8 text-green-600" />
                </button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                <p>Liked: {profileData.likedJobs.length} | Passed: {profileData.dislikedJobs.length}</p>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-green-600" />
            </div>

            <h2 className="text-4xl font-bold mb-4">You're all set!</h2>
            <p className="text-xl text-gray-600 mb-8">
              RoadWork is now configured and ready to start applying to jobs for you.
            </p>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold mb-6">What happens next?</h3>

              <div className="space-y-4 text-left">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-roadwork-gradient rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Daily Job Search</h4>
                    <p className="text-gray-600">
                      RoadWork searches 30+ platforms every day for jobs matching your preferences
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-roadwork-gradient rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Tailored Applications</h4>
                    <p className="text-gray-600">
                      AI customizes your resume and cover letter for each job
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-roadwork-gradient rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Morning Updates</h4>
                    <p className="text-gray-600">
                      Get daily email summaries with all applications and responses
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-roadwork-gradient rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Interview Invites</h4>
                    <p className="text-gray-600">
                      Track responses and schedule interviews from your dashboard
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.location.href = '/dashboard'}
              className="btn-primary text-lg px-8 py-4"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 w-5 h-5 inline" />
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-roadwork-gradient transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      {renderStep()}
    </div>
  )
}
