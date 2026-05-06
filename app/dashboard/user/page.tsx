import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getProfile } from '@/actions/profiles'
import { getUserRatings } from '@/actions/ratings'
import { UserDashboardClient } from './UserDashboardClient'

export const metadata = { title: 'Dashboard' }

export default async function UserDashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/signin')

  const [profileResult, ratingsResult] = await Promise.all([
    getProfile(session.user.id),
    getUserRatings(),
  ])

  const profile = profileResult.success ? profileResult.data : null
  const ratings = ratingsResult.success ? ratingsResult.data : []

  if (!profile) redirect('/signin')

  return <UserDashboardClient profile={profile} ratings={ratings} />
}
