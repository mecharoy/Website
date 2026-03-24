import type { Metadata } from 'next'
import './globals.css'
import 'katex/dist/katex.min.css'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { LoadingScreen } from '@/components/loading-screen'

export const metadata: Metadata = {
  title: 'SMICR Lab | IIT Delhi',
  description: 'Welcome to the SMICR Lab at IIT Delhi. We develop probabilistic machine learning algorithms for structural vibration, digital twins, and structural health monitoring.',
  keywords: ['SMICR Lab', 'IIT Delhi', 'structural health monitoring', 'digital twins', 'probabilistic machine learning', 'Rajdip Nayek'],
  authors: [{ name: 'Dr. Rajdip Nayek' }],
  openGraph: {
    title: 'SMICR Lab | IIT Delhi',
    description: 'Probabilistic machine learning for structural vibration, digital twins, and structural health monitoring — Applied Mechanics, IIT Delhi.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=DM+Sans:wght@100..1000&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <LoadingScreen />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
