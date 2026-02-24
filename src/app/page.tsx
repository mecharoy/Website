export const dynamic = 'force-dynamic'

import { NavigationServer } from '@/components/navigation-server'
import { Hero } from '@/components/sections/hero'
import { Services } from '@/components/sections/services'
import { About } from '@/components/sections/about'
import { Portfolio } from '@/components/sections/portfolio'
import { Blog } from '@/components/sections/blog'
import { FAQ } from '@/components/sections/faq'
import { Contact } from '@/components/sections/contact'
import { Footer } from '@/components/footer'
import { BackgroundGradient } from '@/components/background-gradient'
import { SpaceBackground } from '@/components/space-background'
import { ScrollToTop } from '@/components/scroll-to-top'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <BackgroundGradient />
      <SpaceBackground />
      <NavigationServer />
      <Hero />
      <Services />
      <About />
      <Portfolio />
      <Blog />
      <FAQ />
      <Contact />
      <Footer />
      <ScrollToTop />
    </main>
  )
}
