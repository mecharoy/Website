'use client'

import Link from 'next/link'

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          There was an error loading the dashboard. This usually means the database is still
          warming up.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 border border-primary/20 rounded-full text-sm font-semibold hover:bg-primary/5"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
