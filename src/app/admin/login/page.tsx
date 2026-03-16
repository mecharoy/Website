'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import {
  generateKeyPair,
  generateSalt,
  deriveWrappingKey,
  wrapPrivateKey,
  exportPublicKey,
  unwrapPrivateKey,
  importPublicKey,
} from '@/lib/crypto'
import { keySession } from '@/lib/keySession'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        // Set up or unlock the admin encryption key pair
        try {
          const keysRes = await fetch('/api/admin/keys')
          if (keysRes.status === 404) {
            // First time: generate admin key pair
            const pair = await generateKeyPair()
            const salt = generateSalt()
            const wrappingKey = await deriveWrappingKey(password, salt)
            const encryptedPrivateKey = await wrapPrivateKey(pair.privateKey, wrappingKey)
            const publicKeyB64 = await exportPublicKey(pair.publicKey)
            const saltB64 = btoa(String.fromCharCode(...salt))

            await fetch('/api/admin/keys', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ publicKey: publicKeyB64, encryptedPrivateKey, salt: saltB64 }),
            })

            keySession.setAdminPrivateKey(pair.privateKey)
            keySession.setAdminPublicKey(pair.publicKey)
          } else if (keysRes.ok) {
            const keysData = await keysRes.json()
            const wrappingKey = await deriveWrappingKey(password, keysData.salt)
            const privateKey = await unwrapPrivateKey(keysData.encryptedPrivateKey, wrappingKey)
            const publicKey = await importPublicKey(keysData.publicKey)
            keySession.setAdminPrivateKey(privateKey)
            keySession.setAdminPublicKey(publicKey)
          }
        } catch {
          // Non-fatal — decryption will be unavailable
        }

        router.push('/admin')
        router.refresh()
      } else {
        setError('Invalid password')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">
            <span className="text-primary">SMICR</span>
            <span className="text-foreground">lab</span>
            <span className="text-muted-foreground text-2xl ml-2">Admin</span>
          </h1>
          <p className="text-muted-foreground">Enter your password to continue</p>
        </div>

        <div className="bg-card border border-primary/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter admin password"
                required
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 rounded-lg text-sm">
                {error}
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
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Set your admin password in the <code className="bg-muted px-2 py-1 rounded">.env</code> file
        </p>
      </div>
    </div>
  )
}
