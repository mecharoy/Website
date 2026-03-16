import { KeyUnlocker } from '@/components/key-unlocker'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <KeyUnlocker />
      {children}
    </>
  )
}
