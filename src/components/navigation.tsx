'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Fixed left sidebar — desktop only */}
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 w-14 flex-col items-center justify-between py-6 bg-background/90 backdrop-blur-lg border-r border-primary/10">
        {/* Top: Theme toggle */}
        <div className="flex flex-col items-center gap-4">
          <ThemeToggle />
        </div>

        {/* Middle: Nav links stacked vertically */}
        <nav className="flex flex-col items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-[10px] font-semibold uppercase tracking-widest transition-colors [writing-mode:vertical-lr] rotate-180"
              title={link.label}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Bottom: Contact button */}
        <div className="flex flex-col items-center gap-3">
          {authSlot ?? (
            <a
              href="#contact"
              className="w-9 h-9 rounded-full bg-warm flex items-center justify-center text-warm-foreground transition-all hover:scale-110"
              title="Get in Touch"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Top bar — with logo right-aligned (desktop shows logo only since nav is in sidebar) */}
      <header
        className={cn(
          'fixed top-0 z-40 w-full transition-all duration-300',
          isScrolled
            ? 'bg-background/95 backdrop-blur-lg border-b border-primary/10 py-4'
            : 'bg-transparent py-6'
        )}
      >
        <div className="container mx-auto px-4 md:pr-8">
          <div className="flex items-center justify-between">
            {/* Mobile: Theme toggle + hamburger on left */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                className="p-2 text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Spacer for desktop (sidebar takes left side) */}
            <div className="hidden md:block" />

            {/* Right side: Logo */}
            <Link
              href="/"
              className="hover:scale-105 transition-transform"
            >
              <span className="font-display text-xl font-extrabold">
                <span className="text-primary">SMICR</span>
                <span className="text-warm ml-0.5">.</span>
                <span className="text-foreground">Lab</span>
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
