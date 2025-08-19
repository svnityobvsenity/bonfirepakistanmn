import type { Metadata } from 'next'
import './styles/_locks.css'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import PresenceProvider from '@/components/PresenceProvider'

export const metadata: Metadata = {
  title: 'Bonfire Discord',
  description: 'Discord-like chat application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <PresenceProvider>
            {children}
          </PresenceProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
