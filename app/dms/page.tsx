import type { Metadata } from 'next'
import DMsPage from '@/components/DMsPage'

export const metadata: Metadata = {
  title: 'Discord Chat Interface - DMs',
}

export default function Page() {
  return <DMsPage />
}


