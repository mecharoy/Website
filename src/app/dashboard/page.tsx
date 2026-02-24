import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { UserLogoutButton } from '@/components/dashboard/user-logout-button'
import {
  User,
  Mail,
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Shield,
  ArrowRight,
  PenSquare,
  Send,
  BookOpen,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getUserLeads(email: string) {
  return prisma.lead.findMany({
    where: { email },
    orderBy: { createdAt: 'desc' },
  })
}

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  CONTACTED: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  QUALIFIED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  CONVERTED: 'bg-green-500/10 text-green-500 border-green-500/20',
  ARCHIVED: 'bg-muted text-muted-foreground border-muted',
}

export default async function DashboardPage() {
  const user = await getSessionUser()
  if (!user) {
    redirect('/auth/login')
  }

  const leads = await getUserLeads(user.email)

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="font-display text-2xl font-bold">
              <span className="text-primary">[Lab</span>
              <span className="text-foreground"> Name]</span>
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <span>{user.name}</span>
            </div>
            <UserLogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Welcome banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/10 rounded-2xl p-6 mb-8">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-1">
              <LayoutDashboard className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wide">
                Dashboard
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-1">
              Welcome back, {user.name.split(' ')[0]}
            </h2>
            <p className="text-muted-foreground text-sm">
              Member since {formatDate(user.createdAt)}
            </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-primary/5 pointer-events-none" />
          <div className="absolute -right-4 -bottom-10 w-28 h-28 rounded-full bg-secondary/5 pointer-events-none" />
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Link
            href="/dashboard/posts"
            className="group flex items-center gap-4 bg-card border border-primary/10 hover:border-primary/30 rounded-2xl p-5 transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <PenSquare className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm">My Posts</p>
              <p className="text-xs text-muted-foreground">Write &amp; publish blog posts</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            href="/dashboard/submit"
            className="group flex items-center gap-4 bg-card border border-primary/10 hover:border-primary/30 rounded-2xl p-5 transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
              <Send className="w-5 h-5 text-secondary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm">Send to Admin</p>
              <p className="text-xs text-muted-foreground">Docs, to-dos, updates</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            href="/blog"
            className="group flex items-center gap-4 bg-card border border-primary/10 hover:border-primary/30 rounded-2xl p-5 transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
              <BookOpen className="w-5 h-5 text-purple-500" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm">Blog</p>
              <p className="text-xs text-muted-foreground">View all published posts</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile card */}
            <div className="bg-card border border-primary/10 rounded-2xl p-6">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
                Profile
              </h3>
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold mb-3">
                  {initials}
                </div>
                <p className="font-display font-bold text-lg">{user.name}</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                  <Shield className="w-3 h-3" />
                  {user.role === 'ADMIN' ? 'Admin' : 'Member'}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <User className="w-4 h-4 shrink-0" />
                  <span className="truncate">{user.name}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-card border border-primary/10 rounded-2xl p-6">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {[
                  { href: '/dashboard/submissions', label: 'My Submissions' },
                  { href: '/#research', label: 'Our Research' },
                  { href: '/#contact', label: 'Contact Us' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      {link.label}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Admin shortcut */}
            {user.role === 'ADMIN' && (
              <div className="bg-card border border-primary/10 rounded-2xl p-6">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                  Admin
                </h3>
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Go to Admin Panel
                  <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                </Link>
              </div>
            )}
          </div>

          {/* Right column — enquiries */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-primary/10 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-primary/10">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-lg">My Contact Submissions</h3>
                {leads.length > 0 && (
                  <span className="ml-auto bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full border border-primary/20">
                    {leads.length}
                  </span>
                )}
              </div>

              {leads.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <MessageSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm mb-4">
                    You haven&apos;t sent any messages yet.
                  </p>
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                  >
                    Send a Message
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-primary/10">
                  {leads.map((lead) => (
                    <li key={lead.id} className="px-6 py-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <p className="text-sm font-medium line-clamp-1">
                          {lead.business ? `${lead.business} — ` : ''}
                          {lead.message}
                        </p>
                        <span
                          className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            statusColors[lead.status] ?? statusColors['ARCHIVED']
                          }`}
                        >
                          {lead.status.charAt(0) + lead.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{formatDate(lead.createdAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
