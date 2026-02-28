import { NextRequest, NextResponse } from 'next/server'
import { createAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password === process.env.ADMIN_PASSWORD) {
      await createAdminSession()
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
