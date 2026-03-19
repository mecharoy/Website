'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
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
    <nav
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-lg border-b border-primary/10 py-4'
          : 'bg-background/80 backdrop-blur-md border-b border-primary/10 py-6'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
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

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm transition-all group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {authSlot ?? (
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-warm px-6 py-2.5 text-sm font-semibold text-warm-foreground transition-all hover:opacity-90 hover:-translate-y-0.5"
              >
                Get in Touch
              </a>
            )}
          </div>

          {/* Mobile Menu Toggle */}
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
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-primary/10 pt-4">
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
    </nav>
  )
}
