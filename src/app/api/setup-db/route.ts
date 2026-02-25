import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// This endpoint sets up the database schema
// Visit: /api/setup-db (one time only)
export async function GET() {
  try {
    // Test connection
    await prisma.$connect()

    // Check if tables exist by trying to count leads
    try {
      const count = await prisma.lead.count()
      return NextResponse.json({
        success: true,
        message: `Database already set up! Found ${count} leads.`,
        status: 'ready'
      })
    } catch (error) {
      // Tables don't exist
      return NextResponse.json({
        success: false,
        message: 'Database connected but tables not created yet.',
        instructions: [
          '1. Install Vercel CLI: npm i -g vercel',
          '2. Login: vercel login',
          '3. Link project: vercel link',
          '4. Pull env: vercel env pull',
          '5. Push schema: npm run db:push'
        ],
        alternative: 'Or run these commands locally with your DATABASE_URL'
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Cannot connect to database',
      details: error instanceof Error ? error.message : 'Unknown error',
      solution: 'Make sure DATABASE_URL is set in Vercel Environment Variables (Storage > Postgres)'
    }, { status: 500 })
  }
}
