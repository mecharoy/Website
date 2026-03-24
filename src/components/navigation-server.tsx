import Link from 'next/link'
import { getSessionUser } from '@/lib/auth'
import { Navigation } from './navigation'
import { LayoutDashboard, LogIn } from 'lucide-react'

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
      <Link
        href="/dashboard"
        className="flex items-center gap-1.5 text-sm font-medium text-white hover:text-white/80 transition-colors whitespace-nowrap"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
          {initials}
        </div>
        <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
      </Link>
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
      </div>
    )
  } else {
    // Logged-out: show Sign In + Register
    authSlot = (
      <Link
        href="/auth/login"
        className="flex items-center gap-1.5 text-sm font-medium text-white hover:text-white/80 transition-colors whitespace-nowrap"
      >
        <LogIn className="w-4 h-4 flex-shrink-0" />
        Sign In
      </Link>
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
      </div>
    )
  }

  return <Navigation authSlot={authSlot} authMobileSlot={authMobileSlot} />
}
