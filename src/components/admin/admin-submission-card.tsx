'use client'

import { useState, useEffect } from 'react'
import { Download, Lock } from 'lucide-react'
import { decryptAesKey, decryptText, decryptFile } from '@/lib/crypto'
import { keySession } from '@/lib/keySession'
import { SubmissionThread } from '@/components/submission-thread'
import { TodoChecklist } from '@/components/todo-checklist'
import { SubmissionHistoryTimeline } from '@/components/admin/submission-history-timeline'
import { UpdateSubmissionStatus } from '@/components/admin/update-submission-status'
import { formatDateTime } from '@/lib/utils'

interface Message {
  id: string
  content: string
  isAdmin: boolean
  isEncrypted: boolean
  createdAt: string | Date
}

interface TodoItem {
  id: string
  text: string
  completed: boolean
  isEncrypted: boolean
  order: number
}

interface AdminSubmissionCardData {
  id: string
  title: string
  type: string
  content: string
  attachmentUrl?: string | null
  attachmentName?: string | null
  status: string
  threadClosed: boolean
  isEncrypted: boolean
  encryptedKeyForAdmin?: string | null
  messages: Message[]
  todoItems: TodoItem[]
  createdAt: string | Date
  author: { name: string; email: string }
}

const typeLabels: Record<string, string> = {
  DOCUMENT: 'Document',
  TODO_LIST: 'To-Do',
  UPDATE: 'Update',
  MESSAGE: 'Message',
}

function DecryptedDownload({
  url,
  fileName,
  submissionKey,
}: {
  url: string
  fileName: string
  submissionKey: CryptoKey
}) {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')

  async function handleDownload() {
    setDownloading(true)
    setError('')
    try {
      const res = await fetch(url)
      const encrypted = await res.arrayBuffer()
      const decrypted = await decryptFile(encrypted, submissionKey)
      const blob = new Blob([decrypted])
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = fileName
      a.click()
      URL.revokeObjectURL(objectUrl)
    } catch {
      setError('Download failed — could not decrypt file.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="mb-3">
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        {downloading ? 'Decrypting…' : fileName}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export function AdminSubmissionCard({ sub }: { sub: AdminSubmissionCardData }) {
  const [decryptedTitle, setDecryptedTitle] = useState<string | null>(null)
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null)
  const [decryptedFileName, setDecryptedFileName] = useState<string | null>(null)
  const [decryptedTodos, setDecryptedTodos] = useState<TodoItem[] | null>(null)
  const [decryptedMessages, setDecryptedMessages] = useState<Message[] | null>(null)
  const [submissionKey, setSubmissionKey] = useState<CryptoKey | null>(null)
  const [decryptError, setDecryptError] = useState<string | null>(null)

  useEffect(() => {
    if (!sub.isEncrypted) return

    async function decrypt() {
      const privateKey = keySession.getAdminPrivateKey()
      if (!privateKey || !sub.encryptedKeyForAdmin) {
        setDecryptError('Encryption key unavailable — please log in again.')
        return
      }

      try {
        const aesKey = await decryptAesKey(sub.encryptedKeyForAdmin, privateKey)
        setSubmissionKey(aesKey)

        const title = await decryptText(sub.title, aesKey)
        setDecryptedTitle(title)

        if (sub.type === 'DOCUMENT') {
          const fileName = await decryptText(sub.content, aesKey)
          setDecryptedFileName(fileName)
        } else if (sub.type !== 'TODO_LIST') {
          const content = await decryptText(sub.content, aesKey)
          setDecryptedContent(content)
        }

        const todos = await Promise.all(
          sub.todoItems.map(async (t) => ({
            ...t,
            text: t.isEncrypted ? await decryptText(t.text, aesKey) : t.text,
          })),
        )
        setDecryptedTodos(todos)

        const msgs = await Promise.all(
          sub.messages.map(async (m) => ({
            ...m,
            content: m.isEncrypted ? await decryptText(m.content, aesKey) : m.content,
          })),
        )
        setDecryptedMessages(msgs)
      } catch {
        setDecryptError('Failed to decrypt — admin key may not match.')
      }
    }

    decrypt()
  }, [sub.id, sub.isEncrypted])

  const title = sub.isEncrypted ? (decryptedTitle ?? '…') : sub.title

  return (
    <div className="bg-card border border-primary/10 rounded-xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-primary/10 bg-muted/30">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {typeLabels[sub.type] ?? sub.type}
          </span>
          <span className="font-semibold truncate flex items-center gap-1">
            {title}
            {sub.isEncrypted && <Lock className="w-3 h-3 text-muted-foreground shrink-0" />}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <span className="text-xs text-muted-foreground">
            {sub.author.name} · {sub.author.email}
          </span>
          <span className="text-xs text-muted-foreground">{formatDateTime(sub.createdAt)}</span>
          <UpdateSubmissionStatus submissionId={sub.id} currentStatus={sub.status} />
        </div>
      </div>

      <div className="px-5 py-4">
        {decryptError && (
          <p className="text-xs text-red-500 mb-3 flex items-center gap-1">
            <Lock className="w-3 h-3" /> {decryptError}
          </p>
        )}

        {sub.type === 'DOCUMENT' ? (
          sub.isEncrypted && submissionKey ? (
            <DecryptedDownload
              url={sub.attachmentUrl!}
              fileName={decryptedFileName ?? sub.attachmentName ?? 'file'}
              submissionKey={submissionKey}
            />
          ) : !sub.isEncrypted && sub.attachmentUrl ? (
            <a
              href={sub.attachmentUrl}
              download={sub.attachmentName ?? true}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-lg px-4 py-2 transition-colors mb-3"
            >
              <Download className="w-4 h-4" />
              {sub.attachmentName ?? 'Download file'}
            </a>
          ) : null
        ) : sub.type !== 'TODO_LIST' ? (
          <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed max-h-48 overflow-y-auto">
            {sub.isEncrypted ? (decryptedContent ?? '…') : sub.content}
          </pre>
        ) : null}

        {sub.type === 'TODO_LIST' && (
          <TodoChecklist
            submissionId={sub.id}
            isAdmin={true}
            initialTodos={sub.isEncrypted ? (decryptedTodos ?? []) : sub.todoItems}
            threadClosed={sub.threadClosed}
            submissionKey={submissionKey ?? undefined}
          />
        )}

        <SubmissionThread
          submissionId={sub.id}
          isAdmin={true}
          initialMessages={sub.isEncrypted ? (decryptedMessages ?? []) : sub.messages}
          initialThreadClosed={sub.threadClosed}
          submissionKey={submissionKey ?? undefined}
        />

        <SubmissionHistoryTimeline submissionId={sub.id} />
      </div>
    </div>
  )
}
