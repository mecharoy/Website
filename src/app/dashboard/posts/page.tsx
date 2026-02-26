import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { PenSquare, Plus, Globe, Lock, ArrowLeft, Trash2 } from 'lucide-react'
import { DeletePostButton } from '@/components/dashboard/delete-post-button'

export const dynamic = 'force-dynamic'

export default async function MyPostsPage() {
  const user = await getSessionUser()
  if (!user) redirect('/auth/login')

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-display text-xl font-bold">
              <span className="text-primary">SMICR</span>
              <span className="text-foreground">lab</span>
              <span className="text-muted-foreground text-base ml-2">My Posts</span>
            </h1>
          </div>
          <Link
            href="/dashboard/posts/new"
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> New Post
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <PenSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">No posts yet</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Write your first post — Markdown &amp; LaTeX supported.
            </p>
            <Link
              href="/dashboard/posts/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Write a Post
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between gap-4 bg-card border border-primary/10 rounded-xl px-5 py-4 hover:border-primary/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {post.published ? (
                      <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                        <Globe className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                        <Lock className="w-3 h-3" /> Draft
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
                  </div>
                  <p className="font-semibold truncate">{post.title}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {post.published && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded"
                    >
                      View
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/posts/${post.id}/edit`}
                    className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    Edit
                  </Link>
                  <DeletePostButton postId={post.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
