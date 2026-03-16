import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { logSubmissionEvent } from '@/lib/history'

async function checkAdmin() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  return auth?.value === 'authenticated'
}

// PUT /api/admin/submissions/[id] — save admin reply
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { adminReply } = body

  if (typeof adminReply !== 'string') {
    return NextResponse.json({ error: 'Invalid reply' }, { status: 400 })
  }

  const updated = await prisma.submission.update({
    where: { id: params.id },
    data: { adminReply: adminReply.trim() || null },
  })

  logSubmissionEvent({
    submissionId: params.id,
    action: 'ADMIN_REPLY_UPDATED',
    actorType: 'ADMIN',
    actorName: 'Admin',
    newValue: { reply: adminReply.trim() || null },
  })

  return NextResponse.json(updated)
}

// PATCH /api/admin/submissions/[id] — update submission status OR thread state
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { status, threadClosed } = body

  if (typeof threadClosed === 'boolean') {
    const updated = await prisma.submission.update({
      where: { id: params.id },
      data: { threadClosed },
    })

    logSubmissionEvent({
      submissionId: params.id,
      action: threadClosed ? 'THREAD_CLOSED' : 'THREAD_OPENED',
      actorType: 'ADMIN',
      actorName: 'Admin',
    })

    return NextResponse.json(updated)
  }

  const validStatuses = ['PENDING', 'REVIEWED', 'ACKNOWLEDGED']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const current = await prisma.submission.findUnique({
    where: { id: params.id },
    select: { status: true },
  })

  const updated = await prisma.submission.update({
    where: { id: params.id },
    data: { status },
  })

  logSubmissionEvent({
    submissionId: params.id,
    action: 'STATUS_CHANGED',
    actorType: 'ADMIN',
    actorName: 'Admin',
    oldValue: { status: current?.status },
    newValue: { status },
  })

  return NextResponse.json(updated)
}
