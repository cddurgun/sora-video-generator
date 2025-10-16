import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
}
