import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { logSubmissionEvent } from '@/lib/history'

async function checkAdmin() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  return auth?.value === 'authenticated'
}

// GET /api/admin/submissions/[id]/todos — get todo items
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const todos = await prisma.todoItem.findMany({
    where: { submissionId: params.id },
    orderBy: { order: 'asc' },
  })

  return NextResponse.json(todos)
}

// POST /api/admin/submissions/[id]/todos — admin adds a todo item
export async function POST(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const submission = await prisma.submission.findUnique({ where: { id: params.id } })
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (submission.threadClosed) return NextResponse.json({ error: 'Thread is closed' }, { status: 403 })

  const body = await req.json()
  const { text, isEncrypted = false } = body
  if (!text?.trim()) return NextResponse.json({ error: 'Text is required' }, { status: 400 })

  const count = await prisma.todoItem.count({ where: { submissionId: params.id } })

  const todo = await prisma.todoItem.create({
    data: {
      submissionId: params.id,
      text: isEncrypted ? text : text.trim(),
      isEncrypted,
      order: count,
    },
  })

  logSubmissionEvent({
    submissionId: params.id,
    action: 'TODO_ADDED',
    actorType: 'ADMIN',
    actorName: 'Admin',
    newValue: { text: text.trim() },
  })

  return NextResponse.json(todo, { status: 201 })
}
