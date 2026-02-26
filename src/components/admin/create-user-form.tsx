'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function CreateUserForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
    setGlobalError('')
    setSuccess(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setGlobalError('')
    setSuccess(false)
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (data.success) {
        setForm({ name: '', email: '', password: '' })
        setSuccess(true)
        router.refresh()
        return
      }

      if (data.errors) {
        const flat: Record<string, string> = {}
        for (const [key, msgs] of Object.entries(data.errors)) {
          flat[key] = (msgs as string[])[0]
        }
        setErrors(flat)
      } else {
        setGlobalError(data.message || 'Failed to create user')
      }
    } catch {
      setGlobalError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold mb-1.5">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
            errors.name
              ? 'border-destructive focus:ring-destructive/20'
              : 'border-primary/20 focus:border-primary focus:ring-primary/20'
          }`}
          placeholder="Jane Doe"
        />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
            errors.email
              ? 'border-destructive focus:ring-destructive/20'
              : 'border-primary/20 focus:border-primary focus:ring-primary/20'
          }`}
          placeholder="jane@example.com"
        />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold mb-1.5">
          Temporary Password
        </label>
        <input
          type="text"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
            errors.password
              ? 'border-destructive focus:ring-destructive/20'
              : 'border-primary/20 focus:border-primary focus:ring-primary/20'
          }`}
          placeholder="TempPass123"
        />
        {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
      </div>

      {(globalError || success) && (
        <div className="sm:col-span-3">
          {globalError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2.5 rounded-lg text-sm">
              {globalError}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-600 px-4 py-2.5 rounded-lg text-sm">
              User created. They will be prompted to change their password on first login.
            </div>
          )}
        </div>
      )}

      <div className="sm:col-span-3 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create User'
          )}
        </button>
      </div>
    </form>
  )
}
