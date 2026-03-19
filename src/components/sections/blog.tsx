import Link from 'next/link'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { ArrowRight, BookOpen } from 'lucide-react'

type PostWithAuthor = Prisma.PostGetPayload<{ include: { author: { select: { name: true } } } }>

export async function Blog() {
  let posts: PostWithAuthor[] = []
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { author: { select: { name: true } } },
    })
  } catch {
    // DB not ready yet — show empty state
  }

  // Strip markdown/LaTeX to create excerpt
  function excerpt(content: string) {
    return content
      .replace(/\$\$[\s\S]+?\$\$/g, '[formula]')
      .replace(/\$[^\$\n]+?\$/g, '[math]')
      .replace(/[#*`_>\-\[\]()]/g, '')
      .trim()
      .slice(0, 150) + (content.length > 150 ? '…' : '')
  }

  return (
    <section id="blog" className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-warm" />
          <span className="text-sm font-bold text-warm uppercase tracking-widest">Blog</span>
        </div>
        <div className="mb-12 max-w-2xl">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-4">
            Latest from the Lab
          </h2>
          <p className="text-muted-foreground text-lg">
            News, updates, and insights from our research group.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group h-full flex flex-col bg-card border border-primary/10 hover:border-primary/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {excerpt(post.content)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary/10">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{post.author.name}</span>
                      <span>·</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>

            {/* View all link */}
            <div className="text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Read All Posts
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Blog posts coming soon!</p>
          </div>
        )}
      </div>
    </section>
  )
}
