import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/auth'
import { PostEditor } from '@/components/dashboard/post-editor'
import { ArrowLeft } from 'lucide-react'

export default async function NewPostPage() {
  const user = await getSessionUser()
  if (!user) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/dashboard/posts"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-display text-xl font-bold">
            <span className="text-primary">SMICR</span>
            <span className="text-foreground"> Lab</span>
            <span className="text-muted-foreground text-base ml-2">New Post</span>
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <PostEditor />
      </main>
    </div>
  )
}
