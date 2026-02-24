'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, CheckSquare, Megaphone, MessageCircle, Send, Loader2, Plus, X, Upload, Paperclip } from 'lucide-react'

const TYPES = [
  { value: 'DOCUMENT', label: 'Document', icon: <FileText className="w-4 h-4" />, desc: 'Upload a file or report' },
  { value: 'TODO_LIST', label: 'To-Do List', icon: <CheckSquare className="w-4 h-4" />, desc: 'Tasks and action items' },
  { value: 'UPDATE', label: 'Update', icon: <Megaphone className="w-4 h-4" />, desc: 'Progress or status update' },
  { value: 'MESSAGE', label: 'Message', icon: <MessageCircle className="w-4 h-4" />, desc: 'General message or note' },
]

const ACCEPTED = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip'

export function SubmissionForm({ initialType = 'MESSAGE' }: { initialType?: string }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [type, setType] = useState(initialType)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [todoItems, setTodoItems] = useState<string[]>([])
  const [todoInput, setTodoInput] = useState('')

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFileUrl, setUploadedFileUrl] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [uploading, setUploading] = useState(false)

  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const addTodoItem = () => {
    const text = todoInput.trim()
    if (!text) return
    setTodoItems((prev) => [...prev, text])
    setTodoInput('')
  }

  const removeTodoItem = (index: number) => {
    setTodoItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleTodoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTodoItem()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setUploadedFileUrl('')
    setUploadedFileName('')
    setError('')
    setUploading(true)

    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload/document', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Upload failed')
        setSelectedFile(null)
        return
      }
      setUploadedFileUrl(data.url)
      setUploadedFileName(data.fileName)
    } catch {
      setError('File upload failed. Please try again.')
      setSelectedFile(null)
    } finally {
      setUploading(false)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setUploadedFileUrl('')
    setUploadedFileName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleTypeChange = (newType: string) => {
    setType(newType)
    if (newType !== 'DOCUMENT') clearFile()
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) { setError('Please add a title.'); return }

    if (type === 'TODO_LIST') {
      if (todoItems.length === 0) { setError('Please add at least one to-do item.'); return }
    } else if (type === 'DOCUMENT') {
      if (!uploadedFileUrl) { setError('Please upload a file.'); return }
    } else {
      if (!content.trim()) { setError('Please write some content.'); return }
    }

    if (uploading) { setError('Please wait for the file to finish uploading.'); return }

    setSending(true)
    try {
      let body: Record<string, unknown>

      if (type === 'TODO_LIST') {
        body = { title, type, content: todoItems.join('\n'), items: todoItems }
      } else if (type === 'DOCUMENT') {
        body = { title, type, content: uploadedFileName, attachmentUrl: uploadedFileUrl, attachmentName: uploadedFileName }
      } else {
        body = { title, type, content }
      }

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to send submission')
        return
      }
      router.push('/dashboard/submissions')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => handleTypeChange(t.value)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all text-sm ${
                type === t.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-primary/10 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {t.icon}
              <span className="font-medium">{t.label}</span>
              <span className="text-xs opacity-70 hidden sm:block">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="sub-title">
          Title
        </label>
        <input
          id="sub-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief title for this submission…"
          className="w-full bg-card border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Content area */}
      {type === 'DOCUMENT' ? (
        <div>
          <label className="block text-sm font-medium mb-1.5">File</label>

          {!selectedFile ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center gap-2 border-2 border-dashed border-primary/20 rounded-xl px-4 py-8 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
            >
              <Upload className="w-6 h-6" />
              <span>Click to choose a file</span>
              <span className="text-xs opacity-60">PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, ZIP — max 20 MB</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-card border border-primary/20 rounded-xl px-4 py-3">
              <Paperclip className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
              {uploading && <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />}
              {!uploading && uploadedFileUrl && (
                <span className="text-xs text-green-600 font-medium shrink-0">Uploaded</span>
              )}
              <button
                type="button"
                onClick={clearFile}
                className="text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : type === 'TODO_LIST' ? (
        <div>
          <label className="block text-sm font-medium mb-1.5">To-Do Items</label>

          {todoItems.length > 0 && (
            <ul className="space-y-1.5 mb-3">
              {todoItems.map((item, i) => (
                <li key={i} className="flex items-center gap-2 bg-card border border-primary/10 rounded-lg px-3 py-2">
                  <span className="w-4 h-4 rounded border border-primary/30 shrink-0 bg-background" />
                  <span className="text-sm flex-1">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeTodoItem(i)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyDown={handleTodoKeyDown}
              placeholder="Add a task… (Enter to add)"
              className="flex-1 bg-card border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={addTodoItem}
              disabled={!todoInput.trim()}
              className="flex items-center gap-1.5 bg-muted border border-primary/20 text-foreground text-sm font-medium px-4 py-3 rounded-xl hover:bg-primary/10 transition-colors disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          {todoItems.length === 0 && (
            <p className="text-xs text-muted-foreground mt-1.5">Add at least one item to your to-do list.</p>
          )}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="sub-content">
            Content
          </label>
          <textarea
            id="sub-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content here…"
            rows={12}
            className="w-full bg-card border border-primary/20 rounded-xl px-4 py-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 leading-relaxed"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={sending || uploading}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {sending ? 'Sending…' : 'Send Submission'}
        </button>
      </div>
    </form>
  )
}
