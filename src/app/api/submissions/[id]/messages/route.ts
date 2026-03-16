import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { logSubmissionEvent } from '@/lib/history'

// GET /api/submissions/[id]/messages — get thread messages
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const submission = await prisma.submission.findFirst({
    where: { id: params.id, authorId: user.id },
  })
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const messages = await prisma.submissionMessage.findMany({
    where: { submissionId: params.id },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(messages)
}

// POST /api/submissions/[id]/messages — user sends a message
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const submission = await prisma.submission.findFirst({
    where: { id: params.id, authorId: user.id },
  })
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (submission.threadClosed) return NextResponse.json({ error: 'Thread is closed' }, { status: 403 })

  const body = await req.json()
  const { content } = body
  if (!content?.trim()) return NextResponse.json({ error: 'Content is required' }, { status: 400 })

  const message = await prisma.submissionMessage.create({
    data: {
      submissionId: params.id,
      content: content.trim(),
      isAdmin: false,
    },
  })

  logSubmissionEvent({
    submissionId: params.id,
    action: 'MESSAGE_SENT',
    actorType: 'USER',
    actorName: user.name,
  })

  return NextResponse.json(message, { status: 201 })
}
