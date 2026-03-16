import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Send, Plus, ArrowLeft } from 'lucide-react'
import { SubmissionCard } from '@/components/submission-card'

export const dynamic = 'force-dynamic'

export default async function SubmissionsPage() {
  const user = await getSessionUser()
  if (!user) redirect('/auth/login')

  const submissions = await prisma.submission.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
      todoItems: { orderBy: { order: 'asc' } },
    },
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-display text-xl font-bold">
              <span className="text-primary">SMICR</span>
              <span className="text-foreground">lab</span>
              <span className="text-muted-foreground text-base ml-2">My Submissions</span>
            </h1>
          </div>
          <Link
            href="/dashboard/submit"
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> New Submission
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {submissions.length === 0 ? (
          <div className="text-center py-20">
            <Send className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">No submissions yet</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Send documents, updates, or messages to the admin team.
            </p>
            <Link
              href="/dashboard/submit"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> New Submission
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <SubmissionCard key={sub.id} sub={sub} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
