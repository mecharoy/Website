'use client'

import { useState } from 'react'
import { Plus, Loader2, CheckSquare } from 'lucide-react'
import { encryptText } from '@/lib/crypto'

interface TodoItem {
  id: string
  text: string
  completed: boolean
  order: number
}

interface TodoChecklistProps {
  submissionId: string
  isAdmin: boolean
  initialTodos: TodoItem[]
  threadClosed?: boolean
  submissionKey?: CryptoKey
}

export function TodoChecklist({ submissionId, isAdmin, initialTodos, threadClosed = false, submissionKey }: TodoChecklistProps) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos)
  const [newText, setNewText] = useState('')
  const [adding, setAdding] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const toggleTodo = async (todo: TodoItem) => {
    if (isAdmin) return // Admin cannot tick items
    setTogglingId(todo.id)
    try {
      const res = await fetch(`/api/submissions/${submissionId}/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      })
      if (res.ok) {
        const updated = await res.json()
        setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)))
      }
    } finally {
      setTogglingId(null)
    }
  }

  const addTodo = async () => {
    if (!newText.trim() || adding) return
    setAdding(true)
    setError('')
    try {
      let text = newText
      let isEncrypted = false
      if (submissionKey) {
        text = await encryptText(newText, submissionKey)
        isEncrypted = true
      }

      const res = await fetch(`/api/admin/submissions/${submissionId}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, isEncrypted }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to add item')
        return
      }
      const todo = await res.json()
      // Display the original plaintext locally (not the ciphertext from the server)
      const displayTodo = isEncrypted ? { ...todo, text: newText } : todo
      setTodos((prev) => [...prev, displayTodo])
      setNewText('')
    } catch {
      setError('Something went wrong.')
    } finally {
      setAdding(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTodo()
    }
  }

  return (
    <div className="mt-4 border-t border-primary/10 pt-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
        <CheckSquare className="w-3.5 h-3.5" />
        To-Do Items
      </p>

      {todos.length === 0 ? (
        <p className="text-xs text-muted-foreground mb-3">No to-do items yet.</p>
      ) : (
        <ul className="space-y-2 mb-3">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-2.5">
              <button
                onClick={() => toggleTodo(todo)}
                disabled={isAdmin || togglingId === todo.id}
                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  todo.completed
                    ? 'bg-primary border-primary text-white'
                    : 'border-primary/30 bg-background'
                } ${isAdmin ? 'cursor-not-allowed opacity-70' : 'hover:border-primary cursor-pointer'}`}
                title={isAdmin ? 'Only the user can tick items' : undefined}
              >
                {togglingId === todo.id ? (
                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                ) : todo.completed ? (
                  <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </button>
              <span
                className={`text-sm ${
                  todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}
              >
                {todo.text}
              </span>
            </li>
          ))}
        </ul>
      )}

      {isAdmin && !threadClosed && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a to-do item…"
            className="flex-1 bg-background border border-primary/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={addTodo}
            disabled={adding || !newText.trim()}
            className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Add
          </button>
        </div>
      )}
      {isAdmin && threadClosed && (
        <p className="text-xs text-muted-foreground italic">Thread is closed — reopen to add items.</p>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
