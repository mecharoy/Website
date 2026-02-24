import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { renderMarkdownWithLatex } from '@/lib/markdown'
import { ArrowLeft, Calendar, User } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let post: any = null
  try {
    post = await prisma.post.findUnique({
      where: { slug: params.slug, published: true },
      include: { author: { select: { name: true } } },
    })
  } catch {
    notFound()
  }

  if (!post) notFound()

  const html = renderMarkdownWithLatex(post.content)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <span className="font-display text-xl font-bold">
              <span className="text-primary">[Lab</span>
              <span className="text-foreground"> Name]</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Post header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> {post.author.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {formatDate(post.createdAt)}
            </span>
          </div>
        </div>

        <div className="h-px bg-primary/10 mb-8" />

        {/* Rendered content */}
        <article
          className="prose prose-neutral dark:prose-invert max-w-none
            prose-headings:font-display prose-headings:font-bold
            prose-a:text-primary hover:prose-a:opacity-80
            prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-muted prose-pre:border prose-pre:border-primary/10"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
    </div>
  )
}
