import type { Metadata } from 'next'
import './globals.css'
import 'katex/dist/katex.min.css'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: '[Lab Name] | [University Name]',
  description: 'Welcome to [Lab Name] at [University Name]. We conduct cutting-edge research in [Research Area]. Explore our work, team, and publications.',
  keywords: ['research', 'lab', 'university', 'publications', 'team'],
  authors: [{ name: '[Advisor Name]' }],
  openGraph: {
    title: '[Lab Name] | [University Name]',
    description: 'Welcome to [Lab Name] at [University Name]. We conduct cutting-edge research in [Research Area].',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=DM+Sans:wght@100..1000&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
