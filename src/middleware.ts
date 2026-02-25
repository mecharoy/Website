import { NextRequest, NextResponse } from 'next/server'

const USER_SESSION_COOKIE = 'user_session'
const ADMIN_AUTH_COOKIE = 'admin_auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Admin routes ---
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      // Already on admin login — if already authed as admin, go to /admin
      const adminCookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value
      if (adminCookie === 'authenticated') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.next()
    }
    // All other /admin/* require admin_auth cookie
    const adminCookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value
    if (adminCookie !== 'authenticated') {
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
