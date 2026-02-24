import { NextRequest, NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  // Verify the request comes from an authorized caller (Vercel Cron or manual)
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()

  // Find all expired submissions
  const expired = await prisma.submission.findMany({
    where: { expiresAt: { lte: now } },
    select: { id: true, attachmentUrl: true },
  })

  if (expired.length === 0) {
    return NextResponse.json({ deleted: 0, message: 'Nothing to clean up' })
  }

  // Delete blob files for document uploads
  for (const sub of expired) {
    if (sub.attachmentUrl) {
      await del(sub.attachmentUrl).catch(() => {
        // Ignore if blob is already gone
      })
    }
  }

  // Delete from DB — cascade removes messages, todoItems, etc.
  const { count } = await prisma.submission.deleteMany({
    where: { expiresAt: { lte: now } },
  })

  return NextResponse.json({ deleted: count, message: `Cleaned up ${count} expired submission(s)` })
}
