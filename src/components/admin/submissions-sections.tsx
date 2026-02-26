'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight, Download, Menu, X } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { UpdateSubmissionStatus } from '@/components/admin/update-submission-status'
import { SubmissionThread } from '@/components/submission-thread'
import { TodoChecklist } from '@/components/todo-checklist'

const typeLabels: Record<string, string> = {
  DOCUMENT: 'Document',
  TODO_LIST: 'To-Do',
  UPDATE: 'Update',
  MESSAGE: 'Message',
}

type TodoItem = { id: string; text: string; completed: boolean; order: number }
type Message = { id: string; content: string; isAdmin: boolean; createdAt: string | Date }

export type SubmissionItem = {
  id: string
  title: string
  type: string
  content: string
  attachmentUrl: string | null
  attachmentName: string | null
  status: string
  threadClosed: boolean
  author: { name: string; email: string }
  messages: Message[]
  todoItems: TodoItem[]
  createdAt: string | Date
}

function SubmissionCard({ sub }: { sub: SubmissionItem }) {
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
          <span className="text-xs text-muted-foreground">{formatDateTime(new Date(sub.createdAt))}</span>
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
          <TodoChecklist submissionId={sub.id} isAdmin={true} initialTodos={sub.todoItems} />
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

function Section({
  title, dot, badge, subs,
}: {
  title: string
  dot: string
  badge: string
  subs: SubmissionItem[]
}) {
  const [open, setOpen] = useState(true)
  if (subs.length === 0) return null
  return (
    <section className="mb-10">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 mb-4 hover:opacity-75 transition-opacity"
      >
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
        <h2 className="font-semibold text-lg">{title}</h2>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${badge}`}>{subs.length}</span>
      </button>
      {open && (
        <div className="space-y-4">
          {subs.map((sub) => <SubmissionCard key={sub.id} sub={sub} />)}
        </div>
      )}
    </section>
  )
}

export function SubmissionSections({ submissions }: { submissions: SubmissionItem[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const authors = useMemo(() => {
    const map = new Map<string, { name: string; email: string; count: number }>()
    for (const s of submissions) {
      const k = s.author.email
      if (!map.has(k)) map.set(k, { name: s.author.name, email: k, count: 0 })
      map.get(k)!.count++
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [submissions])

  const visible = selected.size === 0 ? submissions : submissions.filter((s) => selected.has(s.author.email))

  const toggle = (email: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(email) ? n.delete(email) : n.add(email); return n })

  const pending = visible.filter((s) => s.status === 'PENDING')
  const reviewed = visible.filter((s) => s.status === 'REVIEWED')
  const acknowledged = visible.filter((s) => s.status === 'ACKNOWLEDGED')

  return (
    <>
      {/* Burger button */}
      <div className="relative flex justify-end mb-6">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
            selected.size > 0
              ? 'bg-primary/10 border-primary/30 text-primary'
              : 'bg-card border-primary/10 text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Menu className="w-4 h-4" />
          Filter users{selected.size > 0 && ` (${selected.size})`}
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-64 bg-card border border-primary/10 rounded-xl shadow-xl z-20 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10">
                <span className="text-sm font-semibold">Filter by user</span>
                <div className="flex items-center gap-3">
                  {selected.size > 0 && (
                    <button onClick={() => setSelected(new Set())} className="text-xs text-muted-foreground hover:text-foreground underline">
                      Clear
                    </button>
                  )}
                  <button onClick={() => setMenuOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {authors.map((a) => (
                  <label key={a.email} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.has(a.email)}
                      onChange={() => toggle(a.email)}
                      className="w-4 h-4 accent-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{a.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{a.email}</div>
                    </div>
                    <span className="text-xs text-muted-foreground">{a.count}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {visible.length === 0 && (
        <div className="bg-card border border-primary/10 rounded-lg px-6 py-12 text-center text-muted-foreground">
          {submissions.length === 0 ? 'No submissions yet.' : 'No submissions from selected users.'}
        </div>
      )}

      <Section title="Pending"     dot="bg-yellow-500" badge="bg-yellow-500/10 text-yellow-600 border-yellow-500/20" subs={pending} />
      <Section title="Reviewed"    dot="bg-blue-500"   badge="bg-blue-500/10 text-blue-600 border-blue-500/20"       subs={reviewed} />
      <Section title="Acknowledged" dot="bg-green-500"  badge="bg-green-500/10 text-green-600 border-green-500/20"    subs={acknowledged} />
    </>
  )
}
