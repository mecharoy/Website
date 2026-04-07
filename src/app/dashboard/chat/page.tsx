import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import { ChatInterface } from '@/components/dashboard/chat-interface'

export const dynamic = 'force-dynamic'

export default async function ChatPage() {
  const user = await getSessionUser()
  if (!user) redirect('/auth/login')
  if (user.mustChangePassword) redirect('/dashboard/change-password')

  return <ChatInterface userName={user.name} />
}
