'use client'

import { useState, useEffect } from 'react'
import { Loader2, Lock } from 'lucide-react'
import { deriveWrappingKey, unwrapPrivateKey, importPublicKey } from '@/lib/crypto'
import { keySession } from '@/lib/keySession'

export function KeyUnlocker({ isAdmin = false }: { isAdmin?: boolean }) {
  const [needed, setNeeded] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAdmin) {
      setNeeded(!keySession.isAdminKeyLoaded())
    } else {
      setNeeded(!keySession.isUserKeyLoaded())
    }
  }, [isAdmin])

  if (!needed) return null

  async function unlock() {
    if (!password || loading) return
    setLoading(true)
    setError('')

    try {
      if (isAdmin) {
        const res = await fetch('/api/admin/keys')
        if (!res.ok) { setError('Could not load key data.'); return }
        const data = await res.json()
        const wrappingKey = await deriveWrappingKey(password, data.salt)
        const privateKey = await unwrapPrivateKey(data.encryptedPrivateKey, wrappingKey)
        const publicKey = await importPublicKey(data.publicKey)
        keySession.setAdminPrivateKey(privateKey)
        keySession.setAdminPublicKey(publicKey)
      } else {
        const res = await fetch('/api/user/keys')
        if (!res.ok) { setError('Could not load key data.'); return }
        const data = await res.json()
        if (!data.encryptedPrivateKey) { setNeeded(false); return }
        const wrappingKey = await deriveWrappingKey(password, data.keySalt)
        const privateKey = await unwrapPrivateKey(data.encryptedPrivateKey, wrappingKey)
        const publicKey = await importPublicKey(data.publicKey)
        keySession.setUserKeys(publicKey, privateKey)
      }
      setNeeded(false)
    } catch {
      setError('Incorrect password or key data is corrupt.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-card border border-primary/20 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold">Unlock Encrypted Data</h2>
          <p className="text-sm text-muted-foreground text-center">
            Your encryption key was cleared when the page was refreshed.
            Enter your {isAdmin ? 'admin ' : ''}password to decrypt your content.
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && unlock()}
            placeholder={isAdmin ? 'Admin password' : 'Your password'}
            autoFocus
            className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          />

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          <button
            onClick={unlock}
            disabled={!password || loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            {loading ? 'Unlocking…' : 'Unlock'}
          </button>
        </div>
      </div>
    </div>
  )
}
