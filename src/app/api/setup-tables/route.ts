import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const ADMIN_AUTH_SECRET = process.env.ADMIN_AUTH_SECRET || 'default-admin-secret-change-in-production'

function verifyAdminToken(token: string): boolean {
  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [payload, signature] = parts
  const expectedSignature = crypto
    .createHmac('sha256', ADMIN_AUTH_SECRET)
    .update(payload)
    .digest('hex')

  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return false
    }
  } catch {
    return false
  }

  return true
}

// This endpoint is protected and requires authentication
// Only authenticated admins can set up database tables
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminCookie = request.cookies.get('admin_auth')?.value
    if (!adminCookie || !verifyAdminToken(adminCookie)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Create LeadStatus enum type first
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'ARCHIVED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    // Drop existing table if it has wrong schema
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Lead";`)

    // Create Lead table with proper enum type
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Lead" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "business" TEXT,
        "message" TEXT NOT NULL,
        "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Lead_createdAt_idx" ON "Lead"("createdAt");
    `)

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Lead_email_idx" ON "Lead"("email");
    `)

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Lead_status_idx" ON "Lead"("status");
    `)

    // Drop and recreate Testimonial table
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Testimonial";`)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Testimonial" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "company" TEXT,
        "position" TEXT,
        "content" TEXT NOT NULL,
        "rating" INTEGER NOT NULL DEFAULT 5,
        "image" TEXT,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Testimonial_featured_idx" ON "Testimonial"("featured");
    `)

    // Drop and recreate Service table
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Service";`)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Service" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "icon" TEXT NOT NULL DEFAULT '⚡',
        "features" TEXT[],
        "order" INTEGER NOT NULL DEFAULT 0,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Service_active_order_idx" ON "Service"("active", "order");
    `)

    return NextResponse.json({
      success: true,
      message: '✅ Database tables created successfully!',
      tables: ['Lead', 'Testimonial', 'Service'],
      next_steps: [
        '1. Go to your homepage',
        '2. Fill out the contact form',
        '3. Check /admin to see the lead'
      ]
    })

  } catch (error) {
    console.error('Setup error:', error)

    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json({
        success: true,
        message: '✅ Tables already exist! Your database is ready.',
        note: 'You can now use the contact form.'
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create tables',
      details: error instanceof Error ? error.message : 'Unknown error',
      solution: 'Make sure DATABASE_URL is set in Vercel environment variables'
    }, { status: 500 })
  }
}

// Only POST is allowed (not GET) to prevent CSRF and accidental database modifications
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed. Use POST request with admin authentication.' },
    { status: 405 }
  )
}
