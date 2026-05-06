import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { LandingClient } from './LandingClient'

export default async function HomePage() {
  const session = await auth()
  if (session) redirect('/discover')

  return <LandingClient />
}
