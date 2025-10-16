import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import LandingHero from '@/components/landing-hero'

export default async function Home() {
  const session = await auth()

  // If user is authenticated, redirect to dashboard
  if (session) {
    redirect('/dashboard')
  }

  // Show landing page to unauthenticated users
  return <LandingHero />
}
