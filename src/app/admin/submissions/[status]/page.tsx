export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { SubmissionStatus } from '@prisma/client'
import { LogoutButton } from '@/components/admin/logout-button'
import { AdminSubmissionCard } from '@/components/admin/admin-submission-card'
import { KeyUnlocker } from '@/components/key-unlocker'
import { ArrowLeft } from 'lucide-react'

const STATUS_MAP: Record<string, SubmissionStatus> = {
  pending: SubmissionStatus.PENDING,
  reviewed: SubmissionStatus.REVIEWED,
  acknowledged: SubmissionStatus.ACKNOWLEDGED,
}

async function checkAuth() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  if (!auth || auth.value !== 'authenticated') redirect('/admin/login')
}

async function fetchSubmissions(status: SubmissionStatus, userEmail?: string) {
  return prisma.submission.findMany({
    where: {
      status,
      ...(userEmail ? { author: { email: userEmail } } : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true, email: true } },
      messages: { orderBy: { createdAt: 'asc' } },
      todoItems: { orderBy: { order: 'asc' } },
    },
  })
}

async function getUniqueUsers(status: SubmissionStatus) {
  const subs = await prisma.submission.findMany({
    where: { status },
    select: { author: { select: { name: true, email: true } } },
    distinct: ['authorId'],
  })
  return subs.map((s) => s.author).sort((a, b) => a.name.localeCompare(b.name))
}

export default async function StatusPage({
  params,
  searchParams,
}: {
  params: { status: string }
  searchParams: { user?: string }
}) {
  await checkAuth()

  if (!(params.status in STATUS_MAP)) notFound()

  const slug = params.status
  const dbStatus = STATUS_MAP[slug]
  const label = slug.charAt(0).toUpperCase() + slug.slice(1)

  const [submissions, users] = await Promise.all([
    fetchSubmissions(dbStatus, searchParams.user),
    getUniqueUsers(dbStatus),
  ])

  return (
    <div className="min-h-screen bg-background">
      <KeyUnlocker isAdmin />

      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/submissions" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-display text-2xl font-bold">
              <span className="text-primary">SMICR</span>
              <span className="text-foreground">lab</span>
              <span className="text-muted-foreground text-lg ml-2">{label}</span>
            </h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* User filter */}
        {users.length > 0 && (
          <form method="get" action={`/admin/submissions/${slug}`} className="mb-8 flex items-center gap-3">
            <label htmlFor="user-filter" className="text-sm font-medium text-muted-foreground shrink-0">
              Filter by user:
            </label>
            <select
              id="user-filter"
              name="user"
              defaultValue={searchParams.user ?? ''}
              className="bg-card border border-primary/10 rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All users</option>
              {users.map((u) => (
                <option key={u.email} value={u.email}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              Apply
            </button>
            {searchParams.user && (
              <Link
                href={`/admin/submissions/${slug}`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </Link>
            )}
          </form>
        )}

        {submissions.length === 0 ? (
          <div className="bg-card border border-primary/10 rounded-lg px-6 py-12 text-center text-muted-foreground">
            No {label.toLowerCase()} submissions.
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <AdminSubmissionCard key={sub.id} sub={sub} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
