import { createServiceClient } from '@/lib/supabase/server'
import { ArtistsClient } from './ArtistsClient'

export const metadata = { title: 'Artists' }

interface ArtistRow {
  id: string
  username: string
  avatar_url: string | null
  songs: Array<{
    genre: string
    avg_rating: number
    rating_count: number
  }>
}

export default async function ArtistsPage() {
  const supabase = createServiceClient()

  // Fetch profiles that have at least one revealed song
  const { data, error } = await supabase
    .from('profiles')
    .select(
      'id, username, avatar_url, songs!songs_uploaded_by_fkey(genre, avg_rating, rating_count)'
    )
    .not('songs', 'is', null)

  const artists: Array<{
    id: string
    username: string
    avatarUrl: string | null
    trackCount: number
    avgRating: number
    genres: string[]
  }> = []

  if (!error && data) {
    for (const row of data as unknown as ArtistRow[]) {
      const songs = row.songs ?? []
      if (songs.length === 0) continue

      const totalRatings = songs.reduce((sum, s) => sum + s.rating_count, 0)
      const avgRating =
        totalRatings > 0
          ? songs.reduce((sum, s) => sum + s.avg_rating * s.rating_count, 0) / totalRatings
          : 0
      const genres = [...new Set(songs.map((s) => s.genre))]

      artists.push({
        id: row.id,
        username: row.username,
        avatarUrl: row.avatar_url,
        trackCount: songs.length,
        avgRating,
        genres,
      })
    }
  }

  // Sort by avg rating descending
  artists.sort((a, b) => b.avgRating - a.avgRating)

  return <ArtistsClient artists={artists} />
}
