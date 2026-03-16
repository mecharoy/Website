'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Eye, EyeOff, KeyRound } from 'lucide-react'
import {
  deriveWrappingKey,
  unwrapPrivateKey,
  wrapPrivateKey,
  generateSalt,
} from '@/lib/crypto'
import { keySession } from '@/lib/keySession'

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
    setGlobalError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setGlobalError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (data.success) {
        // Re-wrap the private key under the new password
        try {
          const keysRes = await fetch('/api/user/keys')
          if (keysRes.ok) {
            const keysData = await keysRes.json()
            if (keysData.encryptedPrivateKey && keysData.keySalt) {
              const oldWrappingKey = await deriveWrappingKey(form.currentPassword, keysData.keySalt)
              const privateKey = await unwrapPrivateKey(keysData.encryptedPrivateKey, oldWrappingKey)

              const newSalt = generateSalt()
              const newWrappingKey = await deriveWrappingKey(form.newPassword, newSalt)
              const newEncryptedPrivateKey = await wrapPrivateKey(privateKey, newWrappingKey)
              const newKeySalt = btoa(String.fromCharCode(...newSalt))

              await fetch('/api/user/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ encryptedPrivateKey: newEncryptedPrivateKey, keySalt: newKeySalt }),
              })

              // Update the in-memory session key
              const currentPub = keySession.getUserPublicKey()
              if (currentPub) keySession.setUserKeys(currentPub, privateKey)
            }
          }
        } catch {
          // Non-fatal — user will need to log in again to re-unlock keys
        }

        router.push('/dashboard')
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
        setGlobalError(data.message || 'Failed to change password')
      }
    } catch {
      setGlobalError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const newPwChecks = {
    length: form.newPassword.length >= 8,
    upper: /[A-Z]/.test(form.newPassword),
    number: /[0-9]/.test(form.newPassword),
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="font-display text-3xl font-bold">
              <span className="text-primary">SMICR</span>
              <span className="text-foreground">lab</span>
            </h1>
          </Link>
          <div className="flex items-center justify-center gap-2 mt-3">
            <KeyRound className="w-5 h-5 text-primary" />
            <p className="text-muted-foreground">Set your new password</p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Your account requires a password change before you can continue.
          </p>
        </div>

        <div className="bg-card border border-primary/10 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Current password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-semibold mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 pr-11 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.currentPassword
                      ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                      : 'border-primary/20 focus:border-primary focus:ring-primary/20'
                  }`}
                  placeholder="Your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-xs text-destructive">{errors.currentPassword}</p>
              )}
            </div>

            {/* New password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-11 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.newPassword
                      ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                      : 'border-primary/20 focus:border-primary focus:ring-primary/20'
                  }`}
                  placeholder="Choose a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.newPassword && (
                <div className="mt-2 space-y-1">
                  {[
                    { ok: newPwChecks.length, label: '8+ characters' },
                    { ok: newPwChecks.upper, label: 'One uppercase letter' },
                    { ok: newPwChecks.number, label: 'One number' },
                  ].map(({ ok, label }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-500' : 'text-muted-foreground'}`}
                    >
                      <span>{ok ? '✓' : '○'}</span>
                      {label}
                    </div>
                  ))}
                </div>
              )}
              {errors.newPassword && (
                <p className="mt-1 text-xs text-destructive">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword
                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                    : 'border-primary/20 focus:border-primary focus:ring-primary/20'
                }`}
                placeholder="Repeat your new password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            {globalError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2.5 rounded-lg text-sm">
                {globalError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
