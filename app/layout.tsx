import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/lib/theme-context'
import { AuthSessionProvider } from '@/lib/session-provider'

export const metadata: Metadata = {
  title: 'Sora 2 Video Generator',
  description: 'Generate videos using OpenAI Sora 2 API',
  icons: {
    icon: '🎬',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-transparent text-neutral-900 dark:bg-transparent dark:text-neutral-100">
        <AuthSessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
