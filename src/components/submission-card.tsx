'use client'

import { useState, useEffect } from 'react'
import { Download, Lock } from 'lucide-react'
import { decryptAesKey, decryptText, decryptFile } from '@/lib/crypto'
import { keySession } from '@/lib/keySession'
import { SubmissionThread } from '@/components/submission-thread'
import { TodoChecklist } from '@/components/todo-checklist'
import { formatDate } from '@/lib/utils'

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

interface SubmissionCardData {
  id: string
  title: string
  type: string
  content: string
  attachmentUrl?: string | null
  attachmentName?: string | null
  status: string
  threadClosed: boolean
  isEncrypted: boolean
  encryptedKeyForUser?: string | null
  messages: Message[]
  todoItems: TodoItem[]
  createdAt: string | Date
}

const typeIcons: Record<string, React.ReactNode> = {
  DOCUMENT: <span className="text-xs">📄</span>,
  TODO_LIST: <span className="text-xs">☑</span>,
  UPDATE: <span className="text-xs">📢</span>,
  MESSAGE: <span className="text-xs">💬</span>,
}

const typeLabels: Record<string, string> = {
  DOCUMENT: 'Document',
  TODO_LIST: 'To-Do List',
  UPDATE: 'Update',
  MESSAGE: 'Message',
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  REVIEWED: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  ACKNOWLEDGED: 'bg-green-500/10 text-green-600 border-green-500/20',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  REVIEWED: 'Reviewed',
  ACKNOWLEDGED: 'Acknowledged',
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
    <div className="mb-2">
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

export function SubmissionCard({ sub }: { sub: SubmissionCardData }) {
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
      const privateKey = keySession.getUserPrivateKey()
      if (!privateKey || !sub.encryptedKeyForUser) {
        setDecryptError('Encryption key unavailable — please re-enter your password.')
        return
      }

      try {
        const aesKey = await decryptAesKey(sub.encryptedKeyForUser, privateKey)
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

        // Decrypt todo items
        const todos = await Promise.all(
          sub.todoItems.map(async (t) => ({
            ...t,
            text: t.isEncrypted ? await decryptText(t.text, aesKey) : t.text,
          })),
        )
        setDecryptedTodos(todos)

        // Decrypt messages
        const msgs = await Promise.all(
          sub.messages.map(async (m) => ({
            ...m,
            content: m.isEncrypted ? await decryptText(m.content, aesKey) : m.content,
          })),
        )
        setDecryptedMessages(msgs)
      } catch {
        setDecryptError('Failed to decrypt — your key may not match.')
      }
    }

    decrypt()
  }, [sub.id, sub.isEncrypted])

  const title = sub.isEncrypted ? (decryptedTitle ?? '…') : sub.title

  return (
    <div className="bg-card border border-primary/10 rounded-xl overflow-hidden">
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-primary/10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-muted-foreground shrink-0">
            {typeIcons[sub.type] ?? typeIcons.MESSAGE}
          </span>
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            {typeLabels[sub.type] ?? sub.type}
          </span>
          <span className="font-semibold truncate flex items-center gap-1">
            {title}
            {sub.isEncrypted && <Lock className="w-3 h-3 text-muted-foreground shrink-0" />}
          </span>
        </div>
        <span
          className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full border ${
            statusColors[sub.status] ?? statusColors.PENDING
          }`}
        >
          {statusLabels[sub.status] ?? sub.status}
        </span>
      </div>

      {/* Card body */}
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
              className="inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-lg px-4 py-2 transition-colors mb-2"
            >
              <Download className="w-4 h-4" />
              {sub.attachmentName ?? 'Download file'}
            </a>
          ) : null
        ) : sub.type !== 'TODO_LIST' ? (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-1">
            {sub.isEncrypted ? (decryptedContent ?? '…') : sub.content}
          </p>
        ) : null}

        <p className="text-xs text-muted-foreground">{formatDate(sub.createdAt)}</p>

        {sub.type === 'TODO_LIST' && (
          <TodoChecklist
            submissionId={sub.id}
            isAdmin={false}
            initialTodos={sub.isEncrypted ? (decryptedTodos ?? []) : sub.todoItems}
            submissionKey={submissionKey ?? undefined}
          />
        )}

        <SubmissionThread
          submissionId={sub.id}
          isAdmin={false}
          initialMessages={sub.isEncrypted ? (decryptedMessages ?? []) : sub.messages}
          initialThreadClosed={sub.threadClosed}
          submissionKey={submissionKey ?? undefined}
        />
      </div>
    </div>
  )
}
