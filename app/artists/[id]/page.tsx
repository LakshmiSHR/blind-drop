import { createServiceClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { TrackCard } from '@/components/TrackCard/TrackCard'
import type { SongFull } from '@/types'

interface ArtistDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ArtistDetailPageProps) {
  const { id } = await params
  const supabase = createServiceClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', id)
    .single()

  return { title: profile?.username ?? 'Artist' }
}

export default async function ArtistDetailPage({ params }: ArtistDetailPageProps) {
  const { id } = await params
  const supabase = createServiceClient()

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, created_at')
    .eq('id', id)
    .single()

  if (profileError || !profile) notFound()

  // Fetch revealed songs
  const { data: songsRaw } = await supabase
    .from('songs')
    .select(
      'id, title, alias, genre, tags, audio_url, unsplash_image, album_art_url, avg_rating, rating_count, is_revealed, is_published, uploaded_by, spotify_bpm, spotify_key, spotify_energy, spotify_danceability, spotify_valence, created_at'
    )
    .eq('uploaded_by', id)
    .eq('is_revealed', true)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const songs = (songsRaw ?? []) as unknown as SongFull[]

  const totalRatings = songs.reduce((sum, s) => sum + s.rating_count, 0)
  const avgRating =
    totalRatings > 0
      ? songs.reduce((sum, s) => sum + s.avg_rating * s.rating_count, 0) / totalRatings
      : 0

  return (
    <main
      style={{
        paddingTop: 88,
        paddingBottom: 60,
        minHeight: '100dvh',
        maxWidth: 1000,
        margin: '0 auto',
        padding: '88px 24px 60px',
      }}
    >
      {/* Hero */}
      <div
        className="glass"
        style={{
          padding: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            flexShrink: 0,
            background: profile.avatar_url
              ? `url(${profile.avatar_url}) center/cover`
              : 'linear-gradient(135deg, hsl(263 100% 67%), hsl(174 70% 52%))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            fontWeight: 800,
            color: 'white',
          }}
        >
          {!profile.avatar_url && profile.username[0]?.toUpperCase()}
        </div>
        <div>
          <h1
            className="gradient-text"
            style={{ fontSize: 28, fontWeight: 800, margin: 0 }}
          >
            {profile.username}
          </h1>
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginTop: 8,
              fontSize: 14,
              color: 'hsl(220 15% 55%)',
            }}
          >
            <span>{songs.length} revealed track{songs.length !== 1 ? 's' : ''}</span>
            {avgRating > 0 && <span>⭐ {avgRating.toFixed(1)} avg</span>}
          </div>
        </div>
      </div>

      {/* Songs */}
      {songs.length === 0 ? (
        <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: 'hsl(220 15% 55%)' }}>
            This artist has no revealed tracks yet.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {songs.map((song) => (
            <TrackCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </main>
  )
}
