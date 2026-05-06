import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getProfile } from '@/actions/profiles'
import { getListenerStats } from '@/actions/profiles'
import { ProfileClient } from './ProfileClient'

export const metadata = { title: 'Profile' }

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/signin')

  const [profileResult, statsResult] = await Promise.all([
    getProfile(session.user.id),
    getListenerStats(session.user.id),
  ])

  const profile = profileResult.success ? profileResult.data : null
  const stats = statsResult.success ? statsResult.data : null

  if (!profile) redirect('/signin')

  return <ProfileClient profile={profile} stats={stats} />
}
