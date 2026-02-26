export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'
import { LogoutButton } from '@/components/admin/logout-button'
import { UpdateSubmissionStatus } from '@/components/admin/update-submission-status'
import { SubmissionThread } from '@/components/submission-thread'
import { TodoChecklist } from '@/components/todo-checklist'
import { ArrowLeft, Download } from 'lucide-react'

const STATUS_MAP = {
  pending: 'PENDING',
  reviewed: 'REVIEWED',
  acknowledged: 'ACKNOWLEDGED',
} as const

type StatusSlug = keyof typeof STATUS_MAP

async function checkAuth() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  if (!auth || auth.value !== 'authenticated') redirect('/admin/login')
}

const typeLabels: Record<string, string> = {
  DOCUMENT: 'Document',
  TODO_LIST: 'To-Do',
  UPDATE: 'Update',
  MESSAGE: 'Message',
}

async function fetchSubmissions(status: string, userEmail?: string) {
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

async function getUniqueUsers(status: string) {
  const subs = await prisma.submission.findMany({
    where: { status },
    select: { author: { select: { name: true, email: true } } },
    distinct: ['authorId'],
  })
  return subs.map((s) => s.author).sort((a, b) => a.name.localeCompare(b.name))
}

type Submission = Awaited<ReturnType<typeof fetchSubmissions>>[number]

function SubmissionCard({ sub }: { sub: Submission }) {
  return (
    <div className="bg-card border border-primary/10 rounded-xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-primary/10 bg-muted/30">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {typeLabels[sub.type] ?? sub.type}
          </span>
          <span className="font-semibold truncate">{sub.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <span className="text-xs text-muted-foreground">{sub.author.name} · {sub.author.email}</span>
          <span className="text-xs text-muted-foreground">{formatDateTime(sub.createdAt)}</span>
          <UpdateSubmissionStatus submissionId={sub.id} currentStatus={sub.status} />
        </div>
      </div>
      <div className="px-5 py-4">
        {sub.type === 'DOCUMENT' && sub.attachmentUrl ? (
          <a
            href={sub.attachmentUrl}
            download={sub.attachmentName ?? true}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-lg px-4 py-2 transition-colors mb-3"
          >
            <Download className="w-4 h-4" />
            {sub.attachmentName ?? 'Download file'}
          </a>
        ) : sub.type !== 'TODO_LIST' ? (
          <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed max-h-48 overflow-y-auto">
            {sub.content}
          </pre>
        ) : null}

        {sub.type === 'TODO_LIST' && (
          <TodoChecklist
            submissionId={sub.id}
            isAdmin={true}
            initialTodos={sub.todoItems}
          />
        )}

        <SubmissionThread
          submissionId={sub.id}
          isAdmin={true}
          initialMessages={sub.messages}
          initialThreadClosed={sub.threadClosed}
        />
      </div>
    </div>
  )
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

  const slug = params.status as StatusSlug
  const dbStatus = STATUS_MAP[slug]
  const label = slug.charAt(0).toUpperCase() + slug.slice(1)

  const [submissions, users] = await Promise.all([
    fetchSubmissions(dbStatus, searchParams.user),
    getUniqueUsers(dbStatus),
  ])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/submissions" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-display text-2xl font-bold">
              <span className="text-primary">[Lab</span>
              <span className="text-foreground"> Name]</span>
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
              <SubmissionCard key={sub.id} sub={sub} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
