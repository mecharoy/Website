import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { logSubmissionEvent } from '@/lib/history'

// PATCH /api/submissions/[id]/todos/[todoId] — user toggles a todo item
export async function PATCH(
  req: Request,
  { params }: { params: { id: string; todoId: string } }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const submission = await prisma.submission.findFirst({
    where: { id: params.id, authorId: user.id },
  })
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const { completed } = body
  if (typeof completed !== 'boolean') {
    return NextResponse.json({ error: 'completed must be a boolean' }, { status: 400 })
  }

  const todo = await prisma.todoItem.update({
    where: { id: params.todoId, submissionId: params.id },
    data: { completed },
  })

  logSubmissionEvent({
    submissionId: params.id,
    action: completed ? 'TODO_COMPLETED' : 'TODO_UNCOMPLETED',
    actorType: 'USER',
    actorName: user.name,
    newValue: { todoText: todo.text, completed },
  })

  return NextResponse.json(todo)
}
