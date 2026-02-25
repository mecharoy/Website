import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/dashboard', '/admin']
const AUTH_PATHS = ['/auth/login', '/auth/register']
const USER_SESSION_COOKIE = 'user_session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(USER_SESSION_COOKIE)
  const isLoggedIn = Boolean(sessionCookie?.value)

  // Redirect unauthenticated users away from protected pages
  if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_PATHS.some((path) => pathname.startsWith(path))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
}
