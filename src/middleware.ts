import { NextRequest, NextResponse } from 'next/server'

const USER_SESSION_COOKIE = 'user_session'
const ADMIN_AUTH_COOKIE = 'admin_auth'
const ADMIN_AUTH_SECRET = process.env.ADMIN_AUTH_SECRET || 'default-admin-secret-change-in-production'

async function verifyAdminToken(token: string): Promise<boolean> {
  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [timestamp, signature] = parts

  try {
    // Use Web Crypto API (compatible with Edge Runtime)
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(ADMIN_AUTH_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const expectedSignatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(timestamp))
    const expectedSignature = Array.from(new Uint8Array(expectedSignatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Use constant-time comparison to prevent timing attacks
    if (signature !== expectedSignature) {
      return false
    }

    // Verify token is not too old (7 days)
    const tokenAge = Date.now() - parseInt(timestamp, 10)
    const maxAge = 60 * 60 * 24 * 7 * 1000 // 7 days in milliseconds
    if (tokenAge > maxAge) {
      return false
    }

    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Admin routes ---
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      // Already on admin login — if already authed as admin, go to /admin
      const adminCookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value
      if (adminCookie && await verifyAdminToken(adminCookie)) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.next()
    }
    // All other /admin/* require admin_auth cookie with valid signature
    const adminCookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value
    if (!adminCookie || !await verifyAdminToken(adminCookie)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next()
  }

  // --- Dashboard routes ---
  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get(USER_SESSION_COOKIE)?.value
    if (!sessionCookie) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // --- Auth routes ---
  if (pathname.startsWith('/auth')) {
    const sessionCookie = request.cookies.get(USER_SESSION_COOKIE)?.value
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
}
