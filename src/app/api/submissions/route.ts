import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { logSubmissionEvent } from '@/lib/history'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

// GET /api/submissions — get logged-in user's own submissions
export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const submissions = await prisma.submission.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(submissions)
}

// POST /api/submissions — create a submission
export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, type, content, items, attachmentUrl, attachmentName } = body

  if (!title?.trim() || !type) {
    return NextResponse.json({ error: 'Title and type are required' }, { status: 400 })
  }

  const validTypes = ['DOCUMENT', 'TODO_LIST', 'UPDATE', 'MESSAGE']
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: 'Invalid submission type' }, { status: 400 })
  }

  const expiresAt = new Date(Date.now() + SEVEN_DAYS_MS)

  if (type === 'TODO_LIST') {
    const todoItems: string[] = Array.isArray(items) ? items.filter((s: unknown) => typeof s === 'string' && s.trim()) : []
    if (todoItems.length === 0) {
      return NextResponse.json({ error: 'At least one to-do item is required' }, { status: 400 })
    }

    const submission = await prisma.submission.create({
      data: {
        title: title.trim(),
        type,
        content: todoItems.join('\n'),
        authorId: user.id,
        expiresAt,
        todoItems: {
          create: todoItems.map((text, i) => ({ text: text.trim(), order: i })),
        },
      },
      include: { todoItems: true },
    })

    logSubmissionEvent({
      submissionId: submission.id,
      action: 'CREATED',
      actorType: 'USER',
      actorName: user.name,
      newValue: { title: submission.title, type: submission.type },
    })

    return NextResponse.json(submission, { status: 201 })
  }

  if (type === 'DOCUMENT') {
    if (!attachmentUrl || !attachmentName) {
      return NextResponse.json({ error: 'File upload is required for document submissions' }, { status: 400 })
    }

    const submission = await prisma.submission.create({
      data: {
        title: title.trim(),
        type,
        content: attachmentName,
        attachmentUrl: attachmentUrl.trim(),
        attachmentName: attachmentName.trim(),
        authorId: user.id,
        expiresAt,
      },
    })

    logSubmissionEvent({
      submissionId: submission.id,
      action: 'CREATED',
      actorType: 'USER',
      actorName: user.name,
      newValue: { title: submission.title, type: submission.type, file: attachmentName },
    })

    return NextResponse.json(submission, { status: 201 })
  }

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

  const submission = await prisma.submission.create({
    data: {
      title: title.trim(),
      type,
      content: content.trim(),
      authorId: user.id,
      expiresAt,
    },
  })

  logSubmissionEvent({
    submissionId: submission.id,
    action: 'CREATED',
    actorType: 'USER',
    actorName: user.name,
    newValue: { title: submission.title, type: submission.type },
  })

  return NextResponse.json(submission, { status: 201 })
}
