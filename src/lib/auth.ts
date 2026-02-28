import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const SALT_ROUNDS = 12
const SESSION_COOKIE = 'user_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const SESSION_SECRET = process.env.SESSION_SECRET || 'default-dev-secret-change-in-production'

function signToken(data: string): string {
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(data)
    .digest('hex')
  return `${data}.${signature}`
}

function verifyToken(token: string): string | null {
  const parts = token.split('.')
  if (parts.length !== 2) return null

  const [data, signature] = parts
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(data)
    .digest('hex')

  // Use constant-time comparison to prevent timing attacks
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null
  }

  return data
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: string): Promise<void> {
  const cookieStore = await cookies()
  // Store userId encoded as base64 with HMAC signature
  const encodedUserId = Buffer.from(userId).toString('base64')
  const token = signToken(encodedUserId)
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) return null

    const encodedUserId = verifyToken(token)
    if (!encodedUserId) return null

    const userId = Buffer.from(encodedUserId, 'base64').toString('utf8')
    if (!userId) return null

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true, mustChangePassword: true },
    })
    return user
  } catch {
    return null
  }
}

// Admin authentication with signed tokens
const ADMIN_COOKIE = 'admin_auth'
const ADMIN_AUTH_SECRET = process.env.ADMIN_AUTH_SECRET || 'default-admin-secret-change-in-production'

function signAdminToken(): string {
  // Create a token with a timestamp to prevent long-term reuse
  const timestamp = Date.now().toString()
  const signature = crypto
    .createHmac('sha256', ADMIN_AUTH_SECRET)
    .update(timestamp)
    .digest('hex')
  return `${timestamp}.${signature}`
}

function verifyAdminToken(token: string): boolean {
  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [timestamp, signature] = parts
  const expectedSignature = crypto
    .createHmac('sha256', ADMIN_AUTH_SECRET)
    .update(timestamp)
    .digest('hex')

  // Use constant-time comparison to prevent timing attacks
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return false
  }

  // Optional: Verify token is not too old (7 days)
  const tokenAge = Date.now() - parseInt(timestamp, 10)
  const maxAge = 60 * 60 * 24 * 7 * 1000 // 7 days in milliseconds
  if (tokenAge > maxAge) {
    return false
  }

  return true
}

export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  const token = signAdminToken()
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_COOKIE)?.value
    if (!token) return false
    return verifyAdminToken(token)
  } catch {
    return false
  }
}
