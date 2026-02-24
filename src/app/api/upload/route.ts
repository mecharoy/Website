import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getSessionUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('image') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (file.size > 3 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 3 MB)' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only images are allowed' }, { status: 400 })
  }

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const storedName = `images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const blob = await put(storedName, file, { access: 'public' })

  return NextResponse.json({ url: blob.url })
}
