import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function checkAdmin() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  return auth?.value === 'authenticated'
}

// GET /api/admin/submissions/[id]/history — get full change history
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const history = await prisma.submissionHistory.findMany({
    where: { submissionId: params.id },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(history)
}
