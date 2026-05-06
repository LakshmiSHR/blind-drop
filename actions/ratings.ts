'use server'

import 'server-only'

import { auth } from '@/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { ratingLimiter } from '@/lib/redis'
import {
  RatingSchema,
  type ActionResult,
  type SongBlind,
  type SongFull,
} from '@/types'

/* ─── submitRating ───────────────────────────────────────────── */

export async function submitRating(
  songId: string,
  rating: number
): Promise<
  ActionResult<{ avgRating: number; ratingCount: number; isRevealed: boolean }>
> {
  // 1. Auth check
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Please sign in to rate songs' }
  }
  const userId = session.user.id

  // 2. Zod validate
  const parsed = RatingSchema.safeParse({ song_id: songId, rating })
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  // 3. Rate limit
  const { success: allowed } = await ratingLimiter.limit(userId)
  if (!allowed) {
    return { success: false, error: 'Too many ratings. Slow down and try again.' }
  }

  const supabase = createServiceClient()

  // 4. Upsert rating (one rating per user per song)
  const { error: upsertError } = await supabase
    .from('ratings')
    .upsert(
      {
        user_id: userId,
        song_id: songId,
        rating: parsed.data.rating,
      },
      { onConflict: 'user_id,song_id' }
    )

  if (upsertError) {
    return { success: false, error: `Rating failed: ${upsertError.message}` }
  }

  // 5. DB trigger update_song_stats() fires automatically:
  //    - recalculates avg_rating and rating_count
  //    - flips is_revealed = true on first rating

  // 6. Query the updated song stats
  const { data: song, error: fetchError } = await supabase
    .from('songs')
    .select('avg_rating, rating_count, is_revealed')
    .eq('id', songId)
    .single()

  if (fetchError || !song) {
    return { success: false, error: 'Failed to fetch updated song stats' }
  }

  return {
    success: true,
    data: {
      avgRating: song.avg_rating,
      ratingCount: song.rating_count,
      isRevealed: song.is_revealed,
    },
  }
}

/* ─── getUserRating ──────────────────────────────────────────── */

export async function getUserRating(songId: string): Promise<number | null> {
  const session = await auth()
  if (!session?.user?.id) return null

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('user_id', session.user.id)
    .eq('song_id', songId)
    .single()

  if (error || !data) return null

  return data.rating
}

/* ─── getUserRatings ─────────────────────────────────────────── */

export async function getUserRatings(): Promise<
  ActionResult<
    Array<{
      songId: string
      rating: number
      ratedAt: string
      song: SongBlind | SongFull
    }>
  >
> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Please sign in' }
  }

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('ratings')
    .select(
      `
      id, song_id, rating, created_at,
      songs (
        id, alias, genre, tags, audio_url, unsplash_image, album_art_url,
        avg_rating, rating_count, is_revealed,
        spotify_bpm, spotify_key, spotify_energy, spotify_danceability,
        spotify_valence, created_at, title, uploaded_by, is_published
      )
    `
    )
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, error: `Failed to fetch ratings: ${error.message}` }
  }

  const results = (data ?? []).map((row: Record<string, unknown>) => {
    const songData = row.songs as Record<string, unknown> | null
    if (!songData) {
      return null
    }

    let song: SongBlind | SongFull

    if (songData.is_revealed) {
      // Revealed: return full song data
      song = songData as unknown as SongFull
    } else {
      // Not revealed: strip title and uploaded_by
      song = {
        id: songData.id,
        alias: songData.alias,
        genre: songData.genre,
        tags: songData.tags,
        audio_url: songData.audio_url,
        unsplash_image: songData.unsplash_image,
        album_art_url: songData.unsplash_image, // replace with unsplash
        avg_rating: songData.avg_rating,
        rating_count: songData.rating_count,
        is_revealed: false,
        spotify_bpm: songData.spotify_bpm,
        spotify_key: songData.spotify_key,
        spotify_energy: songData.spotify_energy,
        spotify_danceability: songData.spotify_danceability,
        spotify_valence: songData.spotify_valence,
        created_at: songData.created_at,
      } as SongBlind
    }

    return {
      songId: row.song_id as string,
      rating: row.rating as number,
      ratedAt: row.created_at as string,
      song,
    }
  }).filter(Boolean) as Array<{
    songId: string
    rating: number
    ratedAt: string
    song: SongBlind | SongFull
  }>

  return { success: true, data: results }
}
