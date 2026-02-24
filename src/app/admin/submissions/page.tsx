import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'
import { LogoutButton } from '@/components/admin/logout-button'
import { UpdateSubmissionStatus } from '@/components/admin/update-submission-status'
import { SubmissionThread } from '@/components/submission-thread'
import { TodoChecklist } from '@/components/todo-checklist'
import { ArrowLeft, Download } from 'lucide-react'

async function checkAuth() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  if (!auth || auth.value !== 'authenticated') redirect('/admin/login')
}

export const dynamic = 'force-dynamic'

const typeLabels: Record<string, string> = {
  DOCUMENT: 'Document',
  TODO_LIST: 'To-Do',
  UPDATE: 'Update',
  MESSAGE: 'Message',
}

type Submission = Awaited<ReturnType<typeof fetchSubmissions>>[number]

async function fetchSubmissions() {
  try {
    return await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true, email: true } },
        messages: { orderBy: { createdAt: 'asc' } },
        todoItems: { orderBy: { order: 'asc' } },
      },
    })
  } catch {
    return []
  }
}

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

        {/* Todo checklist (only for TODO_LIST type) */}
        {sub.type === 'TODO_LIST' && (
          <TodoChecklist
            submissionId={sub.id}
            isAdmin={true}
            initialTodos={sub.todoItems}
          />
        )}

        {/* Thread */}
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

export default async function AdminSubmissionsPage() {
  await checkAuth()

  const submissions = await fetchSubmissions()

  const pending = submissions.filter((s) => s.status === 'PENDING')
  const reviewed = submissions.filter((s) => s.status === 'REVIEWED')
  const acknowledged = submissions.filter((s) => s.status === 'ACKNOWLEDGED')

  const stats = {
    total: submissions.length,
    pending: pending.length,
    reviewed: reviewed.length,
    acknowledged: acknowledged.length,
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

        {submissions.length === 0 && (
          <div className="bg-card border border-primary/10 rounded-lg px-6 py-12 text-center text-muted-foreground">
            No submissions yet.
          </div>
        )}

        {/* Pending Section */}
        {pending.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <h2 className="font-semibold text-lg">Pending</h2>
              <span className="text-xs font-medium bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full border border-yellow-500/20">
                {pending.length}
              </span>
            </div>
            <div className="space-y-4">
              {pending.map((sub) => (
                <SubmissionCard key={sub.id} sub={sub} />
              ))}
            </div>
          </section>
        )}

        {/* Reviewed Section */}
        {reviewed.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h2 className="font-semibold text-lg">Reviewed</h2>
              <span className="text-xs font-medium bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full border border-blue-500/20">
                {reviewed.length}
              </span>
            </div>
            <div className="space-y-4">
              {reviewed.map((sub) => (
                <SubmissionCard key={sub.id} sub={sub} />
              ))}
            </div>
          </section>
        )}

        {/* Acknowledged Section */}
        {acknowledged.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <h2 className="font-semibold text-lg">Acknowledged</h2>
              <span className="text-xs font-medium bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full border border-green-500/20">
                {acknowledged.length}
              </span>
            </div>
            <div className="space-y-4">
              {acknowledged.map((sub) => (
                <SubmissionCard key={sub.id} sub={sub} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
