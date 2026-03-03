import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getSessionUser } from '@/lib/auth'

// Vercel names the token after the store — support both the default name and
// the prefixed name Vercel injects when the store is called "websiteblob".
const BLOB_TOKEN =
  process.env.blobsite_READ_WRITE_TOKEN ?? process.env.BLOB_READ_WRITE_TOKEN

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
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  try {
    if (BLOB_TOKEN) {
      // Vercel Blob (production and any env where the token is set)
      const blob = await put(`images/${filename}`, file, {
        access: 'public',
        token: BLOB_TOKEN,
      })
      return NextResponse.json({ url: blob.url })
    }

    if (process.env.VERCEL) {
      // Running on Vercel but no Blob token — filesystem is read-only here
      return NextResponse.json(
        {
          error:
            'Storage not configured. Add a Vercel Blob store to this project and re-deploy ' +
            '(Storage → Create → Blob → connect to this project).',
        },
        { status: 503 },
      )
    }

    // Local dev fallback: write to public/uploads
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, filename), buffer)
    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
