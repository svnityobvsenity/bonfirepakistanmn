import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Bonfire - Discord Clone',
  description: 'A Discord-style chat application built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-discord-primary text-discord-text-primary font-discord">
        {children}
      </body>
    </html>
  )
}
