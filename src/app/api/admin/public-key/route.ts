import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

// GET /api/admin/public-key — any authenticated user can fetch the admin's public key
// (needed to encrypt submissions for the admin)
export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const keys = await prisma.adminKeys.findUnique({
    where: { id: 'singleton' },
    select: { publicKey: true },
  })

  if (!keys) return NextResponse.json({ error: 'Admin keys not initialized' }, { status: 404 })

  return NextResponse.json({ publicKey: keys.publicKey })
}
