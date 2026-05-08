import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getArtistSongs } from '@/actions/songs'
import ArtistDashboardClient from './ArtistDashboardClient'

export const metadata = { title: 'Artist Dashboard' }

export default async function ArtistDashboardPage() {
  const session = await auth()

  if (!session?.user?.id) redirect('/signin')

  const result = await getArtistSongs()
  const songs = result.success ? result.data : []

  return <ArtistDashboardClient songs={songs} />
}