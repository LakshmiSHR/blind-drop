import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { WrappedClient } from './WrappedClient'
import type { SongBlind, SongFull } from '@/types'

export const metadata = { title: 'Your Wrapped' }

export default async function WrappedPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/signin')

  const supabase = createServiceClient()
  const year = new Date().getFullYear()
  const yearStart = `${year}-01-01T00:00:00Z`
  const yearEnd = `${year}-12-31T23:59:59Z`

  const { data: ratingsRaw } = await supabase
    .from('ratings')
    .select(
      `rating, created_at,
       songs (
         id, alias, genre, tags, audio_url, unsplash_image, album_art_url,
         avg_rating, rating_count, is_revealed,
         spotify_bpm, spotify_key, spotify_energy, spotify_danceability,
         spotify_valence, created_at, title, uploaded_by, is_published
       )`
    )
    .eq('user_id', session.user.id)
    .gte('created_at', yearStart)
    .lte('created_at', yearEnd)
    .order('rating', { ascending: false })

  const rows = (ratingsRaw ?? []) as unknown as Array<{
    rating: number
    created_at: string
    songs: Record<string, unknown> | null
  }>

  const totalRated = rows.length
  const avgGiven =
    totalRated > 0
      ? Math.round((rows.reduce((s, r) => s + r.rating, 0) / totalRated) * 10) / 10
      : 0

  // Top genre
  const genreCounts: Record<string, number> = {}
  const monthCounts: Record<string, number> = {}

  for (const row of rows) {
    const g = (row.songs?.genre as string) ?? 'Unknown'
    genreCounts[g] = (genreCounts[g] || 0) + 1

    const m = new Date(row.created_at).toLocaleString('en-US', { month: 'long' })
    monthCounts[m] = (monthCounts[m] || 0) + 1
  }

  const topGenre =
    Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'None'
  const topMonth =
    Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'None'

  // Top 5 tracks by user rating
  const topTracks = rows.slice(0, 5).map((row) => {
    const s = row.songs
    if (!s) return { name: 'Unknown', imageUrl: '', rating: row.rating }
    const revealed = s.is_revealed as boolean
    return {
      name: revealed ? (s.title as string) : (s.alias as string),
      imageUrl: (revealed && s.album_art_url ? s.album_art_url : s.unsplash_image) as string,
      rating: row.rating,
    }
  })

  // Mock percentile
  const percentile = Math.min(Math.round((totalRated / 10) * 3), 99)

  return (
    <WrappedClient
      year={year}
      totalRated={totalRated}
      avgGiven={avgGiven}
      topGenre={topGenre}
      topMonth={topMonth}
      topTracks={topTracks}
      percentile={percentile}
    />
  )
}
