'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

const navLinks = [
  { href: '#research', label: 'Research' },
  { href: '/blog', label: 'Blog' },
  { href: '#team', label: 'Team' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

interface NavigationProps {
  authSlot?: React.ReactNode
  authMobileSlot?: React.ReactNode
}

export function Navigation({ authSlot, authMobileSlot }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [animationDone, setAnimationDone] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playCountRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleVideoEnded = () => {
    playCountRef.current += 1
    if (playCountRef.current < 10) {
      videoRef.current?.play()
    } else {
      setAnimationDone(true)
    }
  }

  return (
    <>
      {/* Fixed left sidebar — desktop only */}
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 w-20 flex-col items-start px-2 justify-between py-6">
        {/* Top: Auth slot (Sign In / Dashboard) or Contact */}
        <div>
          {authSlot ?? (
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 rounded-full bg-warm px-4 py-2 text-xs font-semibold text-warm-foreground transition-all hover:opacity-90 hover:scale-105 whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              Contact
            </a>
          )}
        </div>

        {/* Middle: Nav links */}
        <nav className="flex flex-col gap-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-foreground text-base font-semibold transition-colors relative group drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Bottom: Theme toggle */}
        <ThemeToggle />
      </div>

      {/* Top bar — logo centered */}
      <header
        className={cn(
          'fixed top-0 z-40 w-full bg-black h-16 transition-all duration-300',
          isScrolled && 'border-b border-primary/10'
        )}
      >
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-center h-full">
            {/* Mobile: left controls */}
            <div className="md:hidden absolute left-4 flex items-center gap-2">
              <ThemeToggle />
              <button
                className="p-2 text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Center: Animated logo + wordmark */}
            <Link
              href="/"
              className="flex items-center gap-2 h-full hover:scale-105 transition-transform no-underline py-1"
            >
              <div className="relative h-full w-auto flex-shrink-0 aspect-square">
                {!animationDone ? (
                  <video
                    ref={videoRef}
                    src="/images/smicranim.webm"
                    autoPlay
                    muted
                    playsInline
                    onEnded={handleVideoEnded}
                    className="h-full w-auto object-contain"
                  />
                ) : (
                  <Image
                    src="/images/logoblack.png"
                    alt="SMICR Lab logo"
                    width={64}
                    height={64}
                    className="h-full w-auto object-contain"
                  />
                )}
              </div>
              <span className="font-display text-3xl font-extrabold">
                <span className="text-[hsl(178_68%_52%)]">SMICR</span>
                <span className="text-[hsl(42_92%_56%)] ml-0.5">.</span>
                <span className="text-white">Lab</span>
              </span>
            </Link>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-primary/10 pt-4 bg-background/95 backdrop-blur-lg rounded-b-xl">
              <ul className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="block text-muted-foreground hover:text-foreground font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  {authMobileSlot ?? (
                    <a
                      href="#contact"
                      className="block w-full text-center rounded-full bg-warm px-6 py-2.5 text-sm font-semibold text-warm-foreground"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get in Touch
                    </a>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
