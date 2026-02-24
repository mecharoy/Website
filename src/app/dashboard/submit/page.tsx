import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/auth'
import { SubmissionForm } from '@/components/dashboard/submission-form'
import { ArrowLeft } from 'lucide-react'

const VALID_TYPES = ['DOCUMENT', 'TODO_LIST', 'UPDATE', 'MESSAGE']

export default async function SubmitPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const user = await getSessionUser()
  if (!user) redirect('/auth/login')

  const params = await searchParams
  const initialType =
    params.type && VALID_TYPES.includes(params.type.toUpperCase())
      ? params.type.toUpperCase()
      : 'MESSAGE'

  const isDocument = initialType === 'DOCUMENT'

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-display text-xl font-bold">
            <span className="text-primary">[Lab</span>
            <span className="text-foreground"> Name]</span>
            <span className="text-muted-foreground text-base ml-2">
              {isDocument ? 'Upload Document' : 'Send to Admin'}
            </span>
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold mb-1">
            {isDocument ? 'Upload a Document' : 'New Submission'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isDocument
              ? 'Upload a PDF, Word, Excel, PowerPoint, or other document (max 20 MB).'
              : 'Send a document, to-do list, update, or message to the admin team.'}
          </p>
        </div>
        <SubmissionForm initialType={initialType} />
      </main>
    </div>
  )
}
