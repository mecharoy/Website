export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PostEditor } from '@/components/dashboard/post-editor'
import { ArrowLeft } from 'lucide-react'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) redirect('/auth/login')

  const post = await prisma.post.findUnique({ where: { id: params.id } })
  if (!post) notFound()
  if (post.authorId !== user.id && user.role !== 'ADMIN') redirect('/dashboard/posts')

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
            <span className="text-foreground">lab</span>
            <span className="text-muted-foreground text-base ml-2">Edit Post</span>
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <PostEditor
          postId={post.id}
          initialTitle={post.title}
          initialContent={post.content}
          initialPublished={post.published}
        />
      </main>
    </div>
  )
}
