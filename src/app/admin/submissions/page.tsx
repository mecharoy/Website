import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { LogoutButton } from '@/components/admin/logout-button'
import { ArrowLeft } from 'lucide-react'
import { SubmissionSections } from '@/components/admin/submissions-sections'

async function checkAuth() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  if (!auth || auth.value !== 'authenticated') redirect('/admin/login')
}

export const dynamic = 'force-dynamic'

async function fetchSubmissions() {
  return prisma.submission.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true, email: true } },
      messages: { orderBy: { createdAt: 'asc' } },
      todoItems: { orderBy: { order: 'asc' } },
    },
  })
}

export default async function AdminSubmissionsPage() {
  await checkAuth()

  const submissions = await fetchSubmissions()

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === 'PENDING').length,
    reviewed: submissions.filter((s) => s.status === 'REVIEWED').length,
    acknowledged: submissions.filter((s) => s.status === 'ACKNOWLEDGED').length,
  }

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

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-card border border-primary/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="bg-card border border-primary/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="bg-card border border-primary/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-500">{stats.reviewed}</div>
            <div className="text-sm text-muted-foreground">Reviewed</div>
          </div>
          <div className="bg-card border border-primary/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-500">{stats.acknowledged}</div>
            <div className="text-sm text-muted-foreground">Acknowledged</div>
          </div>
        </div>

        <SubmissionSections submissions={submissions} />
      </main>
    </div>
  )
}
