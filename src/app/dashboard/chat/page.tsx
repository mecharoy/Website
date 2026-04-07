import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function ChatPage() {
  const user = await getSessionUser()
  if (!user) redirect('/auth/login')
  if (user.mustChangePassword) redirect('/dashboard/change-password')
  redirect('http://10.228.44.149:3000')
}
