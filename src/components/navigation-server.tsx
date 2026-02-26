import Link from 'next/link'
import { getSessionUser } from '@/lib/auth'
import { Navigation } from './navigation'
import { LayoutDashboard, LogIn, UserPlus } from 'lucide-react'

export async function NavigationServer() {
  const user = await getSessionUser()

  let authSlot: React.ReactNode
  let authMobileSlot: React.ReactNode

  if (user) {
    // Logged-in: show avatar + dashboard link
    const initials = user.name
      .split(' ')
      .map((w: string) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    authSlot = (
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 text-sm font-medium hover:bg-primary/5 transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-[10px] font-bold">
            {initials}
          </div>
          <span className="hidden lg:inline">{user.name.split(' ')[0]}</span>
          <LayoutDashboard className="w-3.5 h-3.5 text-muted-foreground" />
        </Link>
        <a
          href="#contact"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/50 hover:-translate-y-0.5"
        >
          Book a Call
        </a>
      </div>
    )

    authMobileSlot = (
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg border border-primary/20 text-sm font-medium hover:bg-primary/5 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4 text-primary" />
          My Dashboard
        </Link>
        <a
          href="#contact"
          className="block w-full text-center rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-white"
        >
          Book a Call
        </a>
      </div>
    )
  } else {
    // Logged-out: show Sign In + Register
    authSlot = (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </Link>
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-1.5 justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/50 hover:-translate-y-0.5"
        >
          <UserPlus className="w-4 h-4" />
          Get Started
        </Link>
      </div>
    )

    authMobileSlot = (
      <div className="flex flex-col gap-2">
        <Link
          href="/auth/login"
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg border border-primary/20 text-sm font-medium"
        >
          <LogIn className="w-4 h-4 text-primary" />
          Sign In
        </Link>
        <Link
          href="/auth/register"
          className="block w-full text-center rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-white"
        >
          Get Started
        </Link>
      </div>
    )
  }

  return <Navigation authSlot={authSlot} authMobileSlot={authMobileSlot} />
}
