import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import { createHmac } from 'crypto'

export const dynamic = 'force-dynamic'

export default async function ChatPage() {
  const user = await getSessionUser()
  if (!user) redirect('/auth/login')
  if (user.mustChangePassword) redirect('/dashboard/change-password')

  const secret = process.env.CHAT_TOKEN_SECRET ?? 'smicr-iitd-2026'
  const timestamp = Math.floor(Date.now() / 1000)
  const payload = `${user.name}:${timestamp}`
  const hmac = createHmac('sha256', secret).update(payload).digest('hex')
  const token = Buffer.from(`${payload}.${hmac}`).toString('base64url')

  redirect(`http://10.228.44.149:3000?token=${token}`)
}