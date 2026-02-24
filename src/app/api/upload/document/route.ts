import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
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

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 20 MB)' }, { status: 400 })
  }

  if (!ALLOWED_TYPES[file.type]) {
    return NextResponse.json(
      { error: 'Invalid file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, ZIP' },
      { status: 400 },
    )
  }

  const ext = ALLOWED_TYPES[file.type]
  const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storedName = `documents/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const blob = await put(storedName, file, { access: 'public' })

  return NextResponse.json({ url: blob.url, fileName: originalName })
}
