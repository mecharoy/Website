'use client'

import { useEffect, useState } from 'react'
import { History, ChevronDown, ChevronUp } from 'lucide-react'

type HistoryEntry = {
  id: string
  action: string
  actorType: string
  actorName: string | null
  oldValue: string | null
  newValue: string | null
  createdAt: string
}

function parseJson(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function describeAction(entry: HistoryEntry): string {
  const old_ = parseJson(entry.oldValue)
  const new_ = parseJson(entry.newValue)

  switch (entry.action) {
    case 'CREATED': {
      const type = (new_?.type as string | undefined) ?? 'submission'
      const labels: Record<string, string> = {
        DOCUMENT: 'document',
        TODO_LIST: 'to-do list',
        UPDATE: 'update',
        MESSAGE: 'message',
      }
      return `Submitted a ${labels[type] ?? type}`
    }
    case 'STATUS_CHANGED': {
      const statusLabel: Record<string, string> = {
        PENDING: 'Pending',
        REVIEWED: 'Reviewed',
        ACKNOWLEDGED: 'Acknowledged',
      }
      const from = statusLabel[(old_?.status as string) ?? ''] ?? old_?.status ?? '—'
      const to = statusLabel[(new_?.status as string) ?? ''] ?? new_?.status ?? '—'
      return `Status changed: ${from} → ${to}`
    }
    case 'ADMIN_REPLY_UPDATED':
      return new_?.reply ? 'Admin reply updated' : 'Admin reply cleared'
    case 'THREAD_CLOSED':
      return 'Thread closed'
    case 'THREAD_OPENED':
      return 'Thread reopened'
    case 'TODO_ADDED':
      return `To-do item added: "${new_?.text ?? ''}"`
    case 'TODO_COMPLETED':
      return `To-do marked complete: "${new_?.todoText ?? ''}"`
    case 'TODO_UNCOMPLETED':
      return `To-do marked incomplete: "${new_?.todoText ?? ''}"`
    case 'MESSAGE_SENT':
      return 'Message sent'
    default:
      return entry.action.toLowerCase().replace(/_/g, ' ')
  }
}

function actionDotColor(action: string): string {
  switch (action) {
    case 'CREATED':
      return 'bg-green-500'
    case 'STATUS_CHANGED':
      return 'bg-blue-500'
    case 'THREAD_CLOSED':
      return 'bg-red-400'
    case 'THREAD_OPENED':
      return 'bg-green-400'
    case 'TODO_COMPLETED':
      return 'bg-emerald-500'
    case 'TODO_UNCOMPLETED':
      return 'bg-yellow-500'
    case 'TODO_ADDED':
      return 'bg-purple-500'
    case 'MESSAGE_SENT':
      return 'bg-sky-500'
    case 'ADMIN_REPLY_UPDATED':
      return 'bg-orange-400'
    default:
      return 'bg-muted-foreground'
  }
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDays = Math.floor(diffHr / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function SubmissionHistoryTimeline({ submissionId }: { submissionId: string }) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch(`/api/admin/submissions/${submissionId}/history`)
      .then((r) => r.json())
      .then((data) => setHistory(Array.isArray(data) ? data : []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }, [open, submissionId])

  return (
    <div className="mt-4 border-t border-primary/10 pt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <History className="w-4 h-4" />
        Change history
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {open && (
        <div className="mt-3">
          {loading ? (
            <p className="text-xs text-muted-foreground pl-1">Loading…</p>
          ) : history.length === 0 ? (
            <p className="text-xs text-muted-foreground pl-1">No history yet.</p>
          ) : (
            <ol className="relative border-l border-primary/10 ml-2 space-y-3">
              {history.map((entry) => (
                <li key={entry.id} className="pl-5 relative">
                  <span
                    className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background ${actionDotColor(entry.action)}`}
                  />
                  <p className="text-sm text-foreground">{describeAction(entry)}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.actorName ?? (entry.actorType === 'ADMIN' ? 'Admin' : 'User')}
                    {' · '}
                    <time
                      dateTime={entry.createdAt}
                      title={new Date(entry.createdAt).toLocaleString()}
                    >
                      {formatRelativeTime(entry.createdAt)}
                    </time>
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  )
}
