'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface User {
  name: string
  email: string
}

export function UserSelect({ users, selectedEmail }: { users: User[]; selectedEmail: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function onChange(email: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (email) {
      params.set('user', email)
    } else {
      params.delete('user')
    }
    router.push(`/admin/submissions?${params.toString()}`)
  }

  return (
    <select
      value={selectedEmail}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm bg-card border border-primary/20 text-foreground rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
    >
      <option value="">All users</option>
      {users.map((u) => (
        <option key={u.email} value={u.email}>
          {u.name} ({u.email})
        </option>
      ))}
    </select>
  )
}
