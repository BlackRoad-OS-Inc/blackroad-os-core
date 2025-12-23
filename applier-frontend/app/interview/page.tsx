'use client'

import { useState } from 'react'

interface Question {
  id: string
  question: string
  category: 'technical' | 'behavioral' | 'system-design' | 'leadership' | 'sales'
  difficulty: 'easy' | 'medium' | 'hard'
  tips?: string[]
}

const INTERVIEW_QUESTIONS: Question[] = [
  {
    id: '1',
    question: 'Tell me about yourself and your background.',
    category: 'behavioral',
    difficulty: 'easy',
    tips: [
      'Start with: "I\'m a rare hybrid of Deep AI Architecture + Enterprise Sales + Financial Services"',
      'Mention $26.8M in sales and 466K LOC orchestrated',
      'Highlight your unique combination of technical depth and business acumen',
      'Keep it to 2 minutes max'
    ]
  },
  {
    id: '2',
    question: 'Describe your experience building and scaling AI systems.',
    category: 'technical',
    difficulty: 'medium',
    tips: [
      'Talk about BlackRoad OS: 2,119 API endpoints, 145 autonomous agents',
      'Mention your multi-modal stack managing 76 agents across 23 microservices',
      'Discuss LLM integration (vLLM, llama.cpp, Ollama)',
      'Highlight production-grade infrastructure: 89 Terraform modules, 17 K8s configs'
    ]
  },
  {
    id: '3',
    question: 'How would you design a distributed system for managing 30,000 autonomous agents?',
    category: 'system-design',
    difficulty: 'hard',
    tips: [
      'Start with requirements gathering: agent types, communication patterns, state management',
      'Discuss your actual experience with BlackRoad OS agent spawner',
      'Cover: load balancing, message queues (NATS), state persistence (Redis)',
      'Mention breath-synchronized spawning and resource constraints'
    ]
  },
  {
    id: '4',
    question: 'Tell me about a time you closed a difficult sale.',
    category: 'sales',
    difficulty: 'medium',
    tips: [
      'Share your $26.8M achievement at Securian (92% of goal, +38% territory growth)',
      'Discuss your strategy: selected as presenter for LPL conference',
      'Mention automation: eliminated 3,000 CRM errors to 0',
      'Use STAR method: Situation, Task, Action, Result'
    ]
  },
  {
    id: '5',
    question: 'How do you handle competing priorities and tight deadlines?',
    category: 'behavioral',
    difficulty: 'medium',
    tips: [
      'Reference managing both sales quotas and technical delivery',
      'Discuss your experience with 437 CI/CD workflows',
      'Mention balancing multiple stakeholders: advisors, technical teams, compliance',
      'Share specific metrics: 2,400+ calls at Ameriprise while ranked #1'
    ]
  },
  {
    id: '6',
    question: 'What\'s your experience with cloud infrastructure and DevOps?',
    category: 'technical',
    difficulty: 'medium',
    tips: [
      'Detail your IaC experience: 89 Terraform modules',
      'Discuss container orchestration: 17 production K8s configs, 89 Docker containers',
      'Mention CI/CD: 369-workflow pipeline with self-healing remediation',
      'Cover multi-cloud: Cloudflare, Railway, DigitalOcean'
    ]
  },
  {
    id: '7',
    question: 'Describe a time you led a team through a challenging project.',
    category: 'leadership',
    difficulty: 'hard',
    tips: [
      'Talk about building BlackRoad OS from scratch',
      'Mention thought leadership: Sales Training Award for automation',
      'Discuss presenting at 2024 Winter Sales Conference on KPI optimization',
      'Share lessons learned and team impact'
    ]
  },
  {
    id: '8',
    question: 'How do you stay current with AI/ML developments?',
    category: 'technical',
    difficulty: 'easy',
    tips: [
      'Mention hands-on work: integrating Qiskit, TorchQuantum',
      'Discuss building with latest LLMs (Claude, GPT-4)',
      'Reference your GitHub activity and continuous learning',
      'Share specific projects: Collatz conjecture verifier, quantum circuits'
    ]
  },
  {
    id: '9',
    question: 'What\'s your approach to sales automation and CRM optimization?',
    category: 'sales',
    difficulty: 'medium',
    tips: [
      'Share Salesforce success: eliminated 3,000 CRM errors to 0',
      'Discuss click-to-dial and record-cleanup initiatives',
      'Mention thought leadership award for workflow automation',
      'Quantify impact: 1-2 minutes saved per call across 2,400+ calls'
    ]
  },
  {
    id: '10',
    question: 'Why do you want to work here?',
    category: 'behavioral',
    difficulty: 'easy',
    tips: [
      'Research the company thoroughly beforehand',
      'Connect your unique skills to their mission',
      'Show genuine enthusiasm for their technical challenges',
      'Mention specific products, technologies, or initiatives'
    ]
  }
]

export default function InterviewPrepPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showTips, setShowTips] = useState(false)

  function generateFeedback() {
    if (!answer.trim()) {
      setFeedback('Please provide an answer first!')
      return
    }

    const wordCount = answer.split(' ').length
    const hasMetrics = /\$|%|\d+[kKmM]|\d{3,}/.test(answer)
    const hasSTAR = /situation|task|action|result/i.test(answer)
    const hasCompanyMention = /blackroad|securian|ameriprise|anthropic/i.test(answer)

    let score = 0
    let feedbackPoints = []

    // Length check
    if (wordCount < 50) {
      feedbackPoints.push('❌ Answer is too brief. Aim for 100-200 words for most questions.')
    } else if (wordCount > 300) {
      feedbackPoints.push('⚠️ Answer might be too long. Consider condensing to 100-200 words.')
      score += 5
    } else {
      feedbackPoints.push('✅ Good length! Clear and concise.')
      score += 20
    }

    // Metrics check
    if (hasMetrics) {
      feedbackPoints.push('✅ Excellent use of quantifiable metrics! Numbers make your impact tangible.')
      score += 25
    } else {
      feedbackPoints.push('❌ Missing specific metrics. Add numbers: $26.8M sales, 466K LOC, 2,119 endpoints, etc.')
    }

    // STAR method for behavioral
    if (selectedQuestion?.category === 'behavioral' || selectedQuestion?.category === 'sales') {
      if (hasSTAR) {
        feedbackPoints.push('✅ Good use of STAR method structure!')
        score += 20
      } else {
        feedbackPoints.push('⚠️ Try the STAR method: Situation, Task, Action, Result')
      }
    } else {
      score += 20
    }

    // Company/experience mention
    if (hasCompanyMention) {
      feedbackPoints.push('✅ Great job referencing your actual experience!')
      score += 20
    } else {
      feedbackPoints.push('⚠️ Consider mentioning specific companies or projects from your background.')
    }

    // Technical depth for technical questions
    if (selectedQuestion?.category === 'technical') {
      const hasTechTerms = /api|endpoint|kubernetes|terraform|docker|agent|llm|ai|ml/i.test(answer)
      if (hasTechTerms) {
        feedbackPoints.push('✅ Strong technical vocabulary!')
        score += 15
      } else {
        feedbackPoints.push('❌ Add more technical details and terminology.')
      }
    } else {
      score += 15
    }

    const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D'
    const emoji = grade === 'A' ? '🎉' : grade === 'B' ? '👍' : grade === 'C' ? '📝' : '🔄'

    setFeedback(`${emoji} Grade: ${grade} (${score}/100)

${feedbackPoints.join('\n\n')}

${score >= 80 ? '\n🌟 Excellent answer! You\'re ready for the interview.' : score >= 60 ? '\n💪 Good answer! A few tweaks and you\'ll nail it.' : '\n🔄 Keep practicing! Focus on adding specific metrics and examples.'}`)
  }

  const filteredQuestions = filterCategory === 'all'
    ? INTERVIEW_QUESTIONS
    : INTERVIEW_QUESTIONS.filter(q => q.category === filterCategory)

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
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎤 Interview Prep</h1>
          <p className="text-gray-400">Practice with AI-powered feedback and company-specific questions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Questions Practiced</h3>
            <p className="text-4xl font-bold text-gradient">0</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Average Score</h3>
            <p className="text-4xl font-bold text-applier-orange">-</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Mock Interviews</h3>
            <p className="text-4xl font-bold text-applier-pink">0</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Ready Score</h3>
            <p className="text-4xl font-bold text-applier-purple">0%</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Questions List */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Question Bank</h2>

              {/* Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white mb-4 focus:border-applier-pink focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="behavioral">Behavioral</option>
                <option value="technical">Technical</option>
                <option value="system-design">System Design</option>
                <option value="leadership">Leadership</option>
                <option value="sales">Sales</option>
              </select>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredQuestions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedQuestion(q)
                      setAnswer('')
                      setFeedback('')
                      setShowTips(false)
                    }}
                    className={`w-full text-left p-4 rounded-lg border transition ${
                      selectedQuestion?.id === q.id
                        ? 'bg-applier-pink/20 border-applier-pink'
                        : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        q.category === 'technical' ? 'bg-applier-blue/20 text-applier-blue' :
                        q.category === 'behavioral' ? 'bg-applier-purple/20 text-applier-purple' :
                        q.category === 'sales' ? 'bg-applier-orange/20 text-applier-orange' :
                        q.category === 'leadership' ? 'bg-applier-pink/20 text-applier-pink' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {q.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        q.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                        q.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="text-white text-sm">{q.question}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Practice Area */}
          <div className="md:col-span-2 space-y-6">
            {!selectedQuestion ? (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-12 text-center">
                <p className="text-gray-400 text-lg">👈 Select a question to start practicing</p>
              </div>
            ) : (
              <>
                {/* Question Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-2">
                      <span className={`text-xs px-3 py-1 rounded ${
                        selectedQuestion.category === 'technical' ? 'bg-applier-blue/20 text-applier-blue' :
                        selectedQuestion.category === 'behavioral' ? 'bg-applier-purple/20 text-applier-purple' :
                        selectedQuestion.category === 'sales' ? 'bg-applier-orange/20 text-applier-orange' :
                        selectedQuestion.category === 'leadership' ? 'bg-applier-pink/20 text-applier-pink' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {selectedQuestion.category}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded ${
                        selectedQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                        selectedQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {selectedQuestion.difficulty}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowTips(!showTips)}
                      className="text-sm text-applier-pink hover:text-applier-pink-alt transition"
                    >
                      {showTips ? '🙈 Hide Tips' : '💡 Show Tips'}
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-6">{selectedQuestion.question}</h2>

                  {showTips && selectedQuestion.tips && (
                    <div className="bg-applier-orange/10 border border-applier-orange/30 rounded-lg p-4 mb-6">
                      <h3 className="text-applier-orange font-bold mb-2">💡 Tips for this question:</h3>
                      <ul className="space-y-2">
                        {selectedQuestion.tips.map((tip, i) => (
                          <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-applier-pink">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-300">Your Answer</label>
                      <button
                        onClick={() => setIsRecording(!isRecording)}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          isRecording
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
                      </button>
                    </div>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here... (100-200 words recommended)"
                      rows={10}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-applier-pink focus:outline-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-400">{answer.split(' ').filter(w => w).length} words</p>
                      <button
                        onClick={generateFeedback}
                        className="bg-gradient-to-r from-applier-orange to-applier-pink text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition"
                      >
                        ✨ Get AI Feedback
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                {feedback && (
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-applier-pink p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">📊 AI Feedback</h3>
                    <pre className="text-gray-300 whitespace-pre-wrap font-sans">{feedback}</pre>
                  </div>
                )}

                {/* Company-Specific Prep */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">🏢 Company Research</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { company: 'Anthropic', focus: 'AI Safety, Claude, Constitutional AI' },
                      { company: 'OpenAI', focus: 'GPT-4, ChatGPT, AI Research' },
                      { company: 'Google DeepMind', focus: 'AlphaFold, Gemini, AGI Research' },
                      { company: 'Meta', focus: 'Llama, PyTorch, Social AI' },
                    ].map((item) => (
                      <button
                        key={item.company}
                        className="p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-applier-pink transition text-left"
                      >
                        <h4 className="font-bold text-white mb-1">{item.company}</h4>
                        <p className="text-sm text-gray-400">{item.focus}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
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
