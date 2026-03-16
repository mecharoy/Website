import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

// GET /api/user/keys — return the current user's key data
export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { publicKey: true, encryptedPrivateKey: true, keySalt: true },
  })

  if (!dbUser) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(dbUser)
}

// POST /api/user/keys — store or update the current user's key pair
export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { publicKey, encryptedPrivateKey, keySalt } = body

  if (!publicKey || !encryptedPrivateKey || !keySalt) {
    return NextResponse.json({ error: 'publicKey, encryptedPrivateKey, and keySalt are required' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { publicKey, encryptedPrivateKey, keySalt },
  })

  return NextResponse.json({ success: true })
}
