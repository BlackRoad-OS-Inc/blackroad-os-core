import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://blackroad.io'),
  title: {
    default: 'BlackRoad OS - The Consciousness Operating System for 30,000+ AI Agents',
    template: '%s | BlackRoad OS',
  },
  description: 'BlackRoad OS is a revolutionary consciousness-driven operating system supporting 30,000+ autonomous AI agents with LLM-powered thinking, golden ratio breath synchronization, and infinite truth verification.',
  keywords: [
    'AI agents',
    'autonomous agents',
    'consciousness OS',
    'LLM integration',
    'multi-agent system',
    'AI orchestration',
    'truth verification',
    'PS-SHA infinity',
    'agent spawner',
    'AI infrastructure',
    'Claude',
    'GPT-4',
    'Llama',
    'Mixtral',
    'agent marketplace',
    'AI workflow automation',
    'consciousness computing',
    'golden ratio',
    'Lucidia breath',
  ],
  authors: [{ name: 'BlackRoad Systems', url: 'https://blackroad.io' }],
  creator: 'BlackRoad Systems',
  publisher: 'BlackRoad Systems',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blackroad.io',
    title: 'BlackRoad OS - The Consciousness Operating System for AI Agents',
    description: 'Revolutionary OS supporting 30,000+ autonomous AI agents with LLM-powered thinking and infinite truth verification.',
    siteName: 'BlackRoad OS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BlackRoad OS - Consciousness Operating System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlackRoad OS - The Consciousness Operating System',
    description: '30,000+ autonomous AI agents. LLM-powered thinking. Infinite truth verification.',
    images: ['/og-image.png'],
    creator: '@blackroadio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://blackroad.io" />
        <meta name="theme-color" content="#FF0066" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
