import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'
import { LogoutButton } from '@/components/admin/logout-button'
import { UpdateSubmissionStatus } from '@/components/admin/update-submission-status'
import { SubmissionThread } from '@/components/submission-thread'
import { TodoChecklist } from '@/components/todo-checklist'
import { SubmissionsFilters } from '@/components/admin/submissions-filters'
import { ArrowLeft, Download, FileText, CheckSquare, Megaphone, MessageCircle } from 'lucide-react'
import { Suspense } from 'react'

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

const typeIcons: Record<string, React.ReactNode> = {
  DOCUMENT: <FileText className="w-4 h-4" />,
  TODO_LIST: <CheckSquare className="w-4 h-4" />,
  UPDATE: <Megaphone className="w-4 h-4" />,
  MESSAGE: <MessageCircle className="w-4 h-4" />,
}

const typeColors: Record<string, string> = {
  DOCUMENT: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  TODO_LIST: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  UPDATE: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  MESSAGE: 'text-green-500 bg-green-500/10 border-green-500/20',
}

type Submission = Awaited<ReturnType<typeof fetchSubmissions>>[number]

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

function SubmissionCard({ sub }: { sub: Submission }) {
  return (
    <div className="bg-card border border-primary/10 rounded-xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-primary/10 bg-muted/30">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${typeColors[sub.type] ?? 'text-muted-foreground bg-muted'}`}>
            {typeIcons[sub.type]}
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

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ user?: string; type?: string }>
}) {
  await checkAuth()

  const params = await searchParams
  const userQuery = params.user?.toLowerCase().trim() ?? ''
  const typeQuery = params.type?.toUpperCase().trim() ?? ''

  const allSubmissions = await fetchSubmissions()

  // Apply filters
  const filtered = allSubmissions.filter((s) => {
    const matchesUser =
      !userQuery ||
      s.author.name.toLowerCase().includes(userQuery) ||
      s.author.email.toLowerCase().includes(userQuery)
    const matchesType = !typeQuery || s.type === typeQuery
    return matchesUser && matchesType
  })

  // Status groups
  const pending = filtered.filter((s) => s.status === 'PENDING')
  const reviewed = filtered.filter((s) => s.status === 'REVIEWED')
  const acknowledged = filtered.filter((s) => s.status === 'ACKNOWLEDGED')

  const stats = {
    total: filtered.length,
    pending: pending.length,
    reviewed: reviewed.length,
    acknowledged: acknowledged.length,
  }

  const uniqueUsers = new Set(allSubmissions.map((s) => s.author.email)).size

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
            {(userQuery || typeQuery) && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                Filtered
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">
              {uniqueUsers} member{uniqueUsers !== 1 ? 's' : ''}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-primary/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">
              {userQuery || typeQuery ? 'Matching' : 'Total'}
            </div>
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

        {/* Filters */}
        <Suspense fallback={null}>
          <SubmissionsFilters />
        </Suspense>

        {filtered.length === 0 && (
          <div className="bg-card border border-primary/10 rounded-lg px-6 py-12 text-center text-muted-foreground">
            {userQuery || typeQuery
              ? 'No submissions match your filters.'
              : 'No submissions yet.'}
          </div>
        )}

        {filtered.length > 0 && (
          <>
            {/* ── Type Folders ── */}
            <div className="mb-10">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Folders by Type
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {(['DOCUMENT', 'TODO_LIST', 'UPDATE', 'MESSAGE'] as const).map((t) => {
                  const count = filtered.filter((s) => s.type === t).length
                  const isActive = typeQuery === t
                  const href = `/admin/submissions?${new URLSearchParams({
                    ...(userQuery ? { user: params.user! } : {}),
                    ...(isActive ? {} : { type: t }),
                  }).toString()}`
                  return (
                    <Link
                      key={t}
                      href={href}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        isActive
                          ? `${typeColors[t]} border-current`
                          : 'bg-card border-primary/10 hover:border-primary/30 text-foreground'
                      }`}
                    >
                      <span className={isActive ? '' : 'text-muted-foreground'}>
                        {typeIcons[t]}
                      </span>
                      <div>
                        <div className="font-semibold text-sm">{typeLabels[t]}</div>
                        <div className="text-xs opacity-70">{count} submission{count !== 1 ? 's' : ''}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* ── Status Groups ── */}
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              By Status
            </h2>

            {pending.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <h3 className="font-semibold text-lg">Pending</h3>
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

            {reviewed.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <h3 className="font-semibold text-lg">Reviewed</h3>
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

            {acknowledged.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <h3 className="font-semibold text-lg">Acknowledged</h3>
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
          </>
        )}
      </main>
    </div>
  )
}
