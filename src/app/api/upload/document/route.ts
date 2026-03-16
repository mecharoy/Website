import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getSessionUser } from '@/lib/auth'

const MAX_SIZE = 20 * 1024 * 1024 // 20 MB

const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'text/plain': 'txt',
  'text/csv': 'csv',
  'application/zip': 'zip',
}

// Vercel names the token after the store — support both the default name and
// the prefixed name Vercel injects when the store is called "websiteblob".
const BLOB_TOKEN =
  process.env.blobsite_READ_WRITE_TOKEN ?? process.env.BLOB_READ_WRITE_TOKEN

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 20 MB)' }, { status: 400 })
  }

  const isEncrypted = formData.get('encrypted') === 'true'

  if (!isEncrypted && !ALLOWED_TYPES[file.type]) {
    return NextResponse.json(
      { error: 'Invalid file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, ZIP' },
      { status: 400 },
    )
  }

  const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const ext = isEncrypted ? 'enc' : (ALLOWED_TYPES[file.type] ?? 'bin')
  const storedName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  try {
    if (BLOB_TOKEN) {
      // Vercel Blob (production and any env where the token is set)
      const blob = await put(`documents/${storedName}`, file, {
        access: 'public',
        token: BLOB_TOKEN,
      })
      return NextResponse.json({ url: blob.url, fileName: originalName })
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

    // Local dev fallback: write to public/uploads/documents/
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, storedName), buffer)
    return NextResponse.json({ url: `/uploads/documents/${storedName}`, fileName: originalName })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
