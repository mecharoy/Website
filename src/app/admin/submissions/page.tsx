import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'
import { LogoutButton } from '@/components/admin/logout-button'
import { UpdateSubmissionStatus } from '@/components/admin/update-submission-status'
import { SubmissionThread } from '@/components/submission-thread'
import { TodoChecklist } from '@/components/todo-checklist'
import { UserSelect } from '@/components/admin/user-select'
import { ArrowLeft, Download, Folder } from 'lucide-react'

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

const folders = [
  {
    status: 'PENDING',
    label: 'Pending',
    description: 'New submissions awaiting review',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    dot: 'bg-yellow-500',
  },
  {
    status: 'REVIEWED',
    label: 'Reviewed',
    description: 'Submissions that have been reviewed',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    dot: 'bg-blue-500',
  },
  {
    status: 'ACKNOWLEDGED',
    label: 'Acknowledged',
    description: 'Submissions marked as acknowledged',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    dot: 'bg-green-500',
  },
]

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; user?: string }>
}) {
  await checkAuth()

  const params = await searchParams
  const activeStatus = params.status?.toUpperCase()
  const selectedUser = params.user ?? ''

  const validStatuses = ['PENDING', 'REVIEWED', 'ACKNOWLEDGED']
  const isInsideFolder = validStatuses.includes(activeStatus ?? '')

  const allSubmissions = await fetchSubmissions()

  // Counts for folder cards (always full, unfiltered)
  const counts = {
    PENDING: allSubmissions.filter((s) => s.status === 'PENDING').length,
    REVIEWED: allSubmissions.filter((s) => s.status === 'REVIEWED').length,
    ACKNOWLEDGED: allSubmissions.filter((s) => s.status === 'ACKNOWLEDGED').length,
  }

  // Unique users for the dropdown
  const userMap = new Map<string, { name: string; email: string }>()
  for (const sub of allSubmissions) {
    if (!userMap.has(sub.author.email)) {
      userMap.set(sub.author.email, { name: sub.author.name, email: sub.author.email })
    }
  }
  const users = Array.from(userMap.values())

  // ── Folder landing page ────────────────────────────────────────────────────
  if (!isInsideFolder) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="font-display text-2xl font-bold">
                <span className="text-primary">SMICR</span>
                <span className="text-foreground"> Lab</span>
                <span className="text-muted-foreground text-lg ml-2">Submissions</span>
              </h1>
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <p className="text-sm text-muted-foreground mb-6">
            {allSubmissions.length} total submission{allSubmissions.length !== 1 ? 's' : ''} — select a folder to view
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {folders.map((f) => (
              <Link
                key={f.status}
                href={`/admin/submissions?status=${f.status}`}
                className="group bg-card border border-primary/10 hover:border-primary/30 rounded-xl p-6 flex flex-col gap-3 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <Folder className={`w-8 h-8 ${f.color}`} />
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${f.bg} ${f.color} ${f.border}`}>
                    {counts[f.status as keyof typeof counts]}
                  </span>
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{f.label}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{f.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    )
  }

  // ── Inside a folder ────────────────────────────────────────────────────────
  const folder = folders.find((f) => f.status === activeStatus)!

  const filtered = allSubmissions.filter(
    (s) => s.status === activeStatus && (!selectedUser || s.author.email === selectedUser),
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/submissions"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-display text-2xl font-bold">
              <span className="text-primary">SMICR</span>
              <span className="text-foreground"> Lab</span>
              <span className="text-muted-foreground text-lg ml-2">Submissions</span>
            </h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Folder header + user filter */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${folder.dot}`} />
            <h2 className="font-semibold text-xl">{folder.label}</h2>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${folder.bg} ${folder.color} ${folder.border}`}>
              {filtered.length}
            </span>
          </div>
          <UserSelect users={users} selectedEmail={selectedUser} />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-card border border-primary/10 rounded-lg px-6 py-12 text-center text-muted-foreground">
            {selectedUser ? 'No submissions from this user in this folder.' : 'No submissions here.'}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((sub) => (
              <SubmissionCard key={sub.id} sub={sub} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
