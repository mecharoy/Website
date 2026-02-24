import type { Metadata } from 'next'
import { Outfit, DM_Sans } from 'next/font/google'
import './globals.css'
import 'katex/dist/katex.min.css'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

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
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
