'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { Search, X } from 'lucide-react'

const TYPES = [
  { value: '', label: 'All Types' },
  { value: 'DOCUMENT', label: 'Document' },
  { value: 'TODO_LIST', label: 'To-Do' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'MESSAGE', label: 'Message' },
]

export function SubmissionsFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const userFilter = searchParams.get('user') ?? ''
  const typeFilter = searchParams.get('type') ?? ''

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  const clearAll = () => {
    router.push(pathname)
  }

  const hasFilters = userFilter || typeFilter

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-card border border-primary/10 rounded-xl">
      {/* User search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Filter by user name or email…"
          value={userFilter}
          onChange={(e) => updateParam('user', e.target.value)}
          className="w-full bg-background border border-primary/20 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {userFilter && (
          <button
            onClick={() => updateParam('user', '')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-1.5">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => updateParam('type', t.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              typeFilter === t.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground border border-primary/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
        >
          <X className="w-3.5 h-3.5" />
          Clear filters
        </button>
      )}
    </div>
  )
}
