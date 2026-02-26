export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { LogoutButton } from '@/components/admin/logout-button'
import { Send } from 'lucide-react'

async function checkAuth() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')

  if (!auth || auth.value !== 'authenticated') {
    redirect('/admin/login')
  }
}

export default async function AdminPage() {
  await checkAuth()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">
            <span className="text-primary">SMICR</span>
            <span className="text-foreground">lab</span>
            <span className="text-muted-foreground text-lg ml-2">Admin</span>
          </h1>
          <LogoutButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-3 mb-8">
          <Link
            href="/admin/submissions"
            className="flex items-center gap-2 bg-card border border-primary/10 hover:border-primary/30 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Send className="w-4 h-4 text-primary" />
            View Member Submissions
          </Link>
        </div>
      </main>
    </div>
  )
}
