'use client'

import { useState } from 'react'

interface Offer {
  id: string
  company: string
  role: string
  baseSalary: number
  signingBonus: number
  yearlyBonus: number
  equity: {
    shares: number
    strikePrice: number
    currentValue: number
    vestingYears: number
  }
  benefits: {
    healthcare: string
    retirement401k: string
    pto: number
    remote: string
  }
  location: string
  startDate: string
  notes: string
}

const SAMPLE_OFFERS: Offer[] = [
  {
    id: '1',
    company: 'Anthropic',
    role: 'Senior AI Engineer',
    baseSalary: 280000,
    signingBonus: 50000,
    yearlyBonus: 40000,
    equity: {
      shares: 5000,
      strikePrice: 10,
      currentValue: 100,
      vestingYears: 4
    },
    benefits: {
      healthcare: 'Excellent (100% premium)',
      retirement401k: '6% match',
      pto: 25,
      remote: 'Hybrid (3 days/week in office)'
    },
    location: 'San Francisco, CA',
    startDate: 'March 1, 2026',
    notes: 'Fast-growing AI safety company. Mission-driven culture. High potential for equity upside.'
  },
  {
    id: '2',
    company: 'Google',
    role: 'Staff Software Engineer, AI',
    baseSalary: 320000,
    signingBonus: 100000,
    yearlyBonus: 80000,
    equity: {
      shares: 0,
      strikePrice: 0,
      currentValue: 250000,
      vestingYears: 4
    },
    benefits: {
      healthcare: 'Excellent (100% premium + family)',
      retirement401k: '8% match + pension',
      pto: 20,
      remote: 'Flexible (2 days/week in office)'
    },
    location: 'Mountain View, CA',
    startDate: 'February 15, 2026',
    notes: 'Stable public company. Excellent benefits. Strong brand name. RSUs instead of options.'
  }
]

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>(SAMPLE_OFFERS)
  const [showAddForm, setShowAddForm] = useState(false)

  function calculateTotalComp(offer: Offer, years: number = 4): number {
    const basePay = offer.baseSalary * years
    const bonuses = offer.yearlyBonus * years
    const signing = offer.signingBonus
    const equityValue = offer.equity.shares * (offer.equity.currentValue - offer.equity.strikePrice)

    return basePay + bonuses + signing + equityValue
  }

  function calculateYearlyTC(offer: Offer): number {
    return calculateTotalComp(offer, 4) / 4
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
              <a href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</a>
              <a href="/analytics" className="text-gray-300 hover:text-white transition">Analytics</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🎁 Offer Comparison</h1>
            <p className="text-gray-400">Compare total compensation packages side-by-side</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-gradient-to-r from-applier-orange to-applier-pink text-white font-bold rounded-lg hover:shadow-lg transition"
          >
            + Add Offer
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Active Offers</h3>
            <p className="text-4xl font-bold text-gradient">{offers.length}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Highest Base</h3>
            <p className="text-4xl font-bold text-applier-orange">
              ${Math.max(...offers.map(o => o.baseSalary)).toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Highest TC</h3>
            <p className="text-4xl font-bold text-applier-pink">
              ${Math.max(...offers.map(o => calculateYearlyTC(o))).toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Avg. Equity</h3>
            <p className="text-4xl font-bold text-applier-purple">
              ${Math.round(offers.reduce((sum, o) => sum + (o.equity.shares * o.equity.currentValue), 0) / offers.length).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Side-by-side Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {offers.map((offer) => {
            const yearlyTC = calculateYearlyTC(offer)
            const fourYearTC = calculateTotalComp(offer, 4)

            return (
              <div key={offer.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
                {/* Company Header */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2">{offer.company}</h2>
                  <p className="text-xl text-gray-400">{offer.role}</p>
                  <p className="text-sm text-gray-500">{offer.location} • Starts {offer.startDate}</p>
                </div>

                {/* Total Compensation */}
                <div className="mb-6 p-6 bg-applier-orange/10 border border-applier-orange/30 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Total Compensation (Year 1)</p>
                  <p className="text-4xl font-bold text-applier-orange mb-2">
                    ${yearlyTC.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">4-year total: ${fourYearTC.toLocaleString()}</p>
                </div>

                {/* Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Base Salary</span>
                    <span className="text-white font-bold text-lg">${offer.baseSalary.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-applier-orange to-applier-pink h-2 rounded-full" style={{ width: `${(offer.baseSalary / yearlyTC) * 100}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Signing Bonus (Year 1)</span>
                    <span className="text-white font-bold text-lg">${offer.signingBonus.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-applier-pink to-applier-purple h-2 rounded-full" style={{ width: `${(offer.signingBonus / yearlyTC) * 100}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Yearly Bonus</span>
                    <span className="text-white font-bold text-lg">${offer.yearlyBonus.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-applier-purple to-applier-blue h-2 rounded-full" style={{ width: `${(offer.yearlyBonus / yearlyTC) * 100}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Equity (4-year vest)</span>
                    <span className="text-white font-bold text-lg">
                      ${((offer.equity.shares * (offer.equity.currentValue - offer.equity.strikePrice)) / 4).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-applier-blue to-green-500 h-2 rounded-full" style={{ width: `${((offer.equity.shares * offer.equity.currentValue / 4) / yearlyTC) * 100}%` }}></div>
                  </div>
                </div>

                {/* Equity Details */}
                <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-bold text-white mb-3">Equity Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Shares</p>
                      <p className="text-white font-semibold">{offer.equity.shares.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Current Value</p>
                      <p className="text-white font-semibold">${offer.equity.currentValue}/share</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total Value</p>
                      <p className="text-white font-semibold">${(offer.equity.shares * offer.equity.currentValue).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Vesting</p>
                      <p className="text-white font-semibold">{offer.equity.vestingYears} years</p>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-bold text-white mb-3">Benefits</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Healthcare</span>
                      <span className="text-white">{offer.benefits.healthcare}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">401(k)</span>
                      <span className="text-white">{offer.benefits.retirement401k}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">PTO</span>
                      <span className="text-white">{offer.benefits.pto} days/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Remote Policy</span>
                      <span className="text-white">{offer.benefits.remote}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="p-4 bg-applier-purple/10 border border-applier-purple/30 rounded-lg">
                  <h3 className="text-sm font-bold text-applier-purple mb-2">📝 Notes</h3>
                  <p className="text-sm text-gray-300">{offer.notes}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Decision Matrix */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">🎯 Decision Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Factor</th>
                  {offers.map(offer => (
                    <th key={offer.id} className="text-center py-3 px-4 text-white font-semibold">{offer.company}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4 text-gray-300">Base Salary</td>
                  {offers.map(offer => (
                    <td key={offer.id} className="py-3 px-4 text-center text-white font-semibold">
                      ${offer.baseSalary.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4 text-gray-300">Year 1 TC</td>
                  {offers.map(offer => (
                    <td key={offer.id} className="py-3 px-4 text-center text-applier-orange font-bold">
                      ${calculateYearlyTC(offer).toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4 text-gray-300">4-Year TC</td>
                  {offers.map(offer => (
                    <td key={offer.id} className="py-3 px-4 text-center text-applier-pink font-bold">
                      ${calculateTotalComp(offer, 4).toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4 text-gray-300">PTO Days</td>
                  {offers.map(offer => (
                    <td key={offer.id} className="py-3 px-4 text-center text-white">
                      {offer.benefits.pto}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4 text-gray-300">Remote Policy</td>
                  {offers.map(offer => (
                    <td key={offer.id} className="py-3 px-4 text-center text-white text-xs">
                      {offer.benefits.remote}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-300">Start Date</td>
                  {offers.map(offer => (
                    <td key={offer.id} className="py-3 px-4 text-center text-white text-xs">
                      {offer.startDate}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="mt-8 bg-gradient-to-br from-applier-purple/20 to-applier-pink/20 border border-applier-purple rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">🤖 AI Recommendation</h2>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">
              Based on your profile (AI Architecture + Sales + Financial Services), here's my analysis:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="font-bold text-white mb-2">For Maximum Compensation:</h3>
                <p className="text-applier-orange font-bold text-xl mb-2">Google</p>
                <p className="text-sm">• Higher Year 1 TC ($470K vs $457K)</p>
                <p className="text-sm">• Stable RSUs (less risky than startup equity)</p>
                <p className="text-sm">• Larger signing bonus ($100K)</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="font-bold text-white mb-2">For Mission & Growth:</h3>
                <p className="text-applier-pink font-bold text-xl mb-2">Anthropic</p>
                <p className="text-sm">• AI safety mission aligns with your values</p>
                <p className="text-sm">• Higher equity upside potential (startup)</p>
                <p className="text-sm">• Opportunity to shape the future of AI</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              💡 Recommendation: If you value stability and immediate compensation, choose Google. If you're mission-driven and believe in Anthropic's equity potential, choose Anthropic. Both are excellent options.
            </p>
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
