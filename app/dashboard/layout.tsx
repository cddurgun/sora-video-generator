import Sidebar from '@/components/sidebar'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Protect dashboard - redirect to login if not authenticated
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 lg:p-12 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
