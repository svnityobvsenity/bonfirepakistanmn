import type { Metadata } from 'next'
import './globals.css'

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
      <body className="bg-discord-dark text-white">{children}</body>
    </html>
  )
}
