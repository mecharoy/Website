import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'authenticated'
}

// GET /api/admin/keys — admin auth required; returns full key data including encryptedPrivateKey
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const keys = await prisma.adminKeys.findUnique({ where: { id: 'singleton' } })
  if (!keys) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(keys)
}

// POST /api/admin/keys — store the admin key pair (first-time setup)
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { publicKey, encryptedPrivateKey, salt } = body

  if (!publicKey || !encryptedPrivateKey || !salt) {
    return NextResponse.json({ error: 'publicKey, encryptedPrivateKey, and salt are required' }, { status: 400 })
  }

  await prisma.adminKeys.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', publicKey, encryptedPrivateKey, salt },
    update: { publicKey, encryptedPrivateKey, salt },
  })

  return NextResponse.json({ success: true })
}
