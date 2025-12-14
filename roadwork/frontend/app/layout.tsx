import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RoadWork - Your AI Career Co-Pilot',
  description: 'Automated job applications across 30+ platforms. Get 10x more interviews while you sleep.',
  keywords: ['job search', 'automated applications', 'AI career', 'job hunting', 'resume', 'career'],
  authors: [{ name: 'BlackRoad', url: 'https://blackroad.io' }],
  openGraph: {
    title: 'RoadWork - Your AI Career Co-Pilot',
    description: 'Get 10x more interviews with automated job applications',
    url: 'https://roadwork.blackroad.io',
    siteName: 'RoadWork',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoadWork - Your AI Career Co-Pilot',
    description: 'Get 10x more interviews with automated job applications',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
