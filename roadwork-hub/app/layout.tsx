import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RoadWork - Your AI Career Co-Pilot',
  description: 'Automate your job search with AI. Apply to 100+ jobs daily while you sleep. Get hired faster.',
  keywords: 'job search, AI, automation, career, job application, resume, cover letter',
  authors: [{ name: 'BlackRoad OS' }],
  openGraph: {
    title: 'RoadWork - Your AI Career Co-Pilot',
    description: 'Automate your job search with AI. Apply to 100+ jobs daily while you sleep.',
    type: 'website',
    url: 'https://roadwork.blackroad.io',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoadWork - Your AI Career Co-Pilot',
    description: 'Automate your job search with AI. Apply to 100+ jobs daily while you sleep.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
