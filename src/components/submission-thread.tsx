'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Lock, MessageSquare } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface Message {
  id: string
  content: string
  isAdmin: boolean
  createdAt: string | Date
}

interface SubmissionThreadProps {
  submissionId: string
  isAdmin: boolean
  initialMessages: Message[]
  initialThreadClosed: boolean
}

export function SubmissionThread({
  submissionId,
  isAdmin,
  initialMessages,
  initialThreadClosed,
}: SubmissionThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [threadClosed, setThreadClosed] = useState(initialThreadClosed)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [togglingThread, setTogglingThread] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    setError('')
    try {
      const endpoint = isAdmin
        ? `/api/admin/submissions/${submissionId}/messages`
        : `/api/submissions/${submissionId}/messages`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to send message')
        return
      }
      const msg = await res.json()
      setMessages((prev) => [...prev, msg])
      setInput('')
    } catch {
      setError('Something went wrong.')
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleThread = async () => {
    setTogglingThread(true)
    try {
      const res = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadClosed: !threadClosed }),
      })
      if (res.ok) {
        setThreadClosed((prev) => !prev)
      }
    } finally {
      setTogglingThread(false)
    }
  }

  return (
    <div className="mt-4 border-t border-primary/10 pt-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          Thread
        </p>
        {isAdmin && !threadClosed && (
          <button
            onClick={toggleThread}
            disabled={togglingThread}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20"
          >
            <Lock className="w-3 h-3" /> End Thread
          </button>
        )}
      </div>

      {/* Messages */}
      {messages.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          No messages yet. Start the conversation below.
        </p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1 mb-3">
          {messages.map((msg) => {
            const isFromAdmin = msg.isAdmin
            const isOwnMessage = isAdmin ? isFromAdmin : !isFromAdmin
            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    isFromAdmin
                      ? 'bg-primary/10 text-foreground border border-primary/20'
                      : 'bg-muted text-foreground border border-muted-foreground/10'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 text-right">
                    {isFromAdmin ? 'Admin' : 'You'} · {formatDateTime(new Date(msg.createdAt))}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Thread closed notice */}
      {threadClosed ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 border border-muted-foreground/10 rounded-lg px-3 py-2">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          This thread has been closed. No new messages can be sent.
        </div>
      ) : (
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message… (Enter to send, Shift+Enter for new line)"
            rows={2}
            className="flex-1 bg-background border border-primary/20 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="shrink-0 self-end flex items-center gap-1.5 bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold px-3 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Send
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
