export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { LogoutButton } from '@/components/admin/logout-button'
import { ArrowLeft, ChevronRight, Folder } from 'lucide-react'

async function checkAuth() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  if (!auth || auth.value !== 'authenticated') redirect('/admin/login')
}

export default async function AdminSubmissionsPage() {
  await checkAuth()

  const [pending, reviewed, acknowledged] = await Promise.all([
    prisma.submission.count({ where: { status: 'PENDING' } }),
    prisma.submission.count({ where: { status: 'REVIEWED' } }),
    prisma.submission.count({ where: { status: 'ACKNOWLEDGED' } }),
  ])

  const folders = [
    {
      label: 'Pending',
      count: pending,
      href: '/admin/submissions/pending',
      iconColor: 'text-yellow-500',
      badge: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    },
    {
      label: 'Reviewed',
      count: reviewed,
      href: '/admin/submissions/reviewed',
      iconColor: 'text-blue-500',
      badge: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    },
    {
      label: 'Acknowledged',
      count: acknowledged,
      href: '/admin/submissions/acknowledged',
      iconColor: 'text-green-500',
      badge: 'bg-green-500/10 text-green-600 border-green-500/20',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-display text-2xl font-bold">
              <span className="text-primary">[Lab</span>
              <span className="text-foreground"> Name]</span>
              <span className="text-muted-foreground text-lg ml-2">Submissions</span>
            </h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-xl">
        <div className="space-y-4">
          {folders.map((f) => (
            <Link
              key={f.label}
              href={f.href}
              className="flex items-center justify-between bg-card border border-primary/10 rounded-xl px-6 py-5 hover:border-primary/30 hover:bg-muted/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <Folder className={`w-5 h-5 ${f.iconColor}`} />
                <span className="font-semibold text-lg">{f.label}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${f.badge}`}>
                  {f.count}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
