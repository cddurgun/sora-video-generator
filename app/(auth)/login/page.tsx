import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AuthForm from '@/components/auth-form'

export default async function LoginPage() {
  const session = await auth()

  // If already logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard')
  }

  return <AuthForm type="login" />
}
