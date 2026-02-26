'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlignJustify, X, Check } from 'lucide-react'

interface User {
  name: string
  email: string
}

export function UserFilterMenu({
  users,
  selectedEmail,
}: {
  users: User[]
  selectedEmail: string
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function selectUser(email: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (email) {
      params.set('user', email)
    } else {
      params.delete('user')
    }
    router.push(`/admin/submissions?${params.toString()}`)
    setOpen(false)
  }

  const selectedUser = users.find((u) => u.email === selectedEmail)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
          selectedEmail
            ? 'bg-primary/10 text-primary border-primary/30'
            : 'bg-card text-muted-foreground border-primary/10 hover:border-primary/20'
        }`}
        title="Filter by user"
      >
        <AlignJustify className="w-3.5 h-3.5" />
        {selectedUser ? selectedUser.name : 'All Users'}
        {selectedEmail && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation()
              selectUser('')
            }}
            className="ml-0.5 hover:text-foreground"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 z-30 bg-card border border-primary/10 rounded-lg shadow-lg min-w-52 py-1 overflow-hidden">
          <button
            onClick={() => selectUser('')}
            className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted/50 transition-colors ${
              !selectedEmail ? 'text-primary font-medium' : 'text-muted-foreground'
            }`}
          >
            {!selectedEmail ? (
              <Check className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <span className="w-3.5 h-3.5 shrink-0" />
            )}
            All Users
          </button>
          <div className="border-t border-primary/10 my-1" />
          {users.map((user) => (
            <button
              key={user.email}
              onClick={() => selectUser(user.email)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted/50 transition-colors ${
                selectedEmail === user.email ? 'text-primary font-medium' : 'text-foreground'
              }`}
            >
              {selectedEmail === user.email ? (
                <Check className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <span className="w-3.5 h-3.5 shrink-0" />
              )}
              <div>
                <div>{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
