'use server'

import 'server-only'

import { auth } from '@/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { uploadLimiter } from '@/lib/redis'
import { fetchSpotifyFeatures } from '@/lib/spotify'
import { fetchUnsplashImage } from '@/lib/unsplash'
import {
  CreateSongSchema,
  type ActionResult,
  type SongBlind,
  type SongFull,
} from '@/types'

/* ─── Helpers ────────────────────────────────────────────────── */

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

const BLIND_SELECT = `
  id, alias, genre, tags, audio_url, unsplash_image, album_art_url,
  avg_rating, rating_count, is_revealed,
  spotify_bpm, spotify_key, spotify_energy, spotify_danceability,
  spotify_valence, created_at
`.trim()

const FULL_SELECT = `${BLIND_SELECT}, title, uploaded_by, is_published`

async function requireArtistOrAdmin(): Promise<
  { userId: string } | { error: string }
> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Please sign in' }

  const supabase = createServiceClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!profile || (profile.role !== 'artist' && profile.role !== 'admin')) {
    return { error: 'Artist or admin role required' }
  }

  return { userId: session.user.id }
}

/* ─── createSong ─────────────────────────────────────────────── */

export async function createSong(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  // 1. Auth + role check
  const roleCheck = await requireArtistOrAdmin()
  if ('error' in roleCheck) return { success: false, error: roleCheck.error }
  const { userId } = roleCheck

  // 2. Rate limit
  const { success: allowed } = await uploadLimiter.limit(userId)
  if (!allowed) return { success: false, error: 'Upload limit reached. Try again later.' }

  // 3. Zod parse text fields
  const raw = {
    title: formData.get('title') as string,
    alias: formData.get('alias') as string,
    genre: formData.get('genre') as string,
    tags: JSON.parse((formData.get('tags') as string) || '[]') as string[],
    spotifyTrackUrl: (formData.get('spotifyTrackUrl') as string) || '',
  }

  const parsed = CreateSongSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  // 4. Validate audio file
  const audioFile = formData.get('audio') as File | null
  if (!audioFile || audioFile.size === 0) {
    return { success: false, error: 'Audio file is required' }
  }
  if (audioFile.size > MAX_FILE_SIZE) {
    return { success: false, error: 'Audio file must be under 50 MB' }
  }

  const supabase = createServiceClient()

  // 5. Upload audio to Storage
  const audioPath = `${userId}/${Date.now()}-${audioFile.name}`
  const { error: audioError } = await supabase.storage
    .from('audio')
    .upload(audioPath, audioFile, { contentType: audioFile.type })

  if (audioError) {
    return { success: false, error: `Audio upload failed: ${audioError.message}` }
  }

  const { data: audioPublic } = supabase.storage
    .from('audio')
    .getPublicUrl(audioPath)

  // 6. Optional album art upload
  let albumArtUrl: string | null = null
  const artFile = formData.get('albumArt') as File | null
  if (artFile && artFile.size > 0) {
    const artPath = `${userId}/${Date.now()}-${artFile.name}`
    const { error: artError } = await supabase.storage
      .from('artwork')
      .upload(artPath, artFile, { contentType: artFile.type })

    if (!artError) {
      const { data: artPublic } = supabase.storage
        .from('artwork')
        .getPublicUrl(artPath)
      albumArtUrl = artPublic.publicUrl
    }
  }

  // 7. Spotify features (mock when no keys)
  const spotifyUrl = parsed.data.spotifyTrackUrl
  const features = spotifyUrl
    ? await fetchSpotifyFeatures(spotifyUrl)
    : await fetchSpotifyFeatures('mock')

  // 8. Unsplash image
  const unsplash = await fetchUnsplashImage(parsed.data.genre, parsed.data.tags)

  // 9. Insert song
  const { data: song, error: insertError } = await supabase
    .from('songs')
    .insert({
      title: parsed.data.title,
      alias: parsed.data.alias,
      genre: parsed.data.genre,
      tags: parsed.data.tags,
      audio_url: audioPublic.publicUrl,
      album_art_url: albumArtUrl,
      unsplash_image: unsplash.url,
      uploaded_by: userId,
      is_published: true,
      is_revealed: false,
      avg_rating: 0,
      rating_count: 0,
      spotify_bpm: features.tempo,
      spotify_key: features.key,
      spotify_energy: features.energy,
      spotify_danceability: features.danceability,
      spotify_valence: features.valence,
    })
    .select('id')
    .single()

  if (insertError) {
    return { success: false, error: `Failed to create song: ${insertError.message}` }
  }

  return { success: true, data: { id: song.id } }
}

/* ─── deleteSong ─────────────────────────────────────────────── */

export async function deleteSong(songId: string): Promise<ActionResult> {
  const roleCheck = await requireArtistOrAdmin()
  if ('error' in roleCheck) return { success: false, error: roleCheck.error }
  const { userId } = roleCheck

  const supabase = createServiceClient()

  // Verify ownership
  const { data: song, error: fetchError } = await supabase
    .from('songs')
    .select('id, audio_url, album_art_url, uploaded_by')
    .eq('id', songId)
    .single()

  if (fetchError || !song) {
    return { success: false, error: 'Song not found' }
  }
  if (song.uploaded_by !== userId) {
    return { success: false, error: 'You can only delete your own songs' }
  }

  // Delete audio from Storage
  const audioPath = new URL(song.audio_url).pathname.split('/audio/')[1]
  if (audioPath) {
    await supabase.storage.from('audio').remove([decodeURIComponent(audioPath)])
  }

  // Delete artwork from Storage (if exists)
  if (song.album_art_url) {
    const artPath = new URL(song.album_art_url).pathname.split('/artwork/')[1]
    if (artPath) {
      await supabase.storage.from('artwork').remove([decodeURIComponent(artPath)])
    }
  }

  // Delete song row (ratings cascade via FK)
  const { error: deleteError } = await supabase
    .from('songs')
    .delete()
    .eq('id', songId)

  if (deleteError) {
    return { success: false, error: `Delete failed: ${deleteError.message}` }
  }

  return { success: true, data: null }
}

/* ─── togglePublish ──────────────────────────────────────────── */

export async function togglePublish(
  songId: string,
  publish: boolean
): Promise<ActionResult> {
  const roleCheck = await requireArtistOrAdmin()
  if ('error' in roleCheck) return { success: false, error: roleCheck.error }
  const { userId } = roleCheck

  const supabase = createServiceClient()

  // Verify ownership
  const { data: song } = await supabase
    .from('songs')
    .select('uploaded_by')
    .eq('id', songId)
    .single()

  if (!song || song.uploaded_by !== userId) {
    return { success: false, error: 'Song not found or not owned by you' }
  }

  const { error } = await supabase
    .from('songs')
    .update({ is_published: publish })
    .eq('id', songId)

  if (error) {
    return { success: false, error: `Update failed: ${error.message}` }
  }

  return { success: true, data: null }
}

/* ─── getSongs ───────────────────────────────────────────────── */

export async function getSongs(
  genre?: string,
  limit = 20,
  offset = 0
): Promise<ActionResult<SongBlind[]>> {
  const supabase = createServiceClient()

  let query = supabase
    .from('songs')
    .select(BLIND_SELECT)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (genre && genre !== 'All') {
    query = query.eq('genre', genre)
  }

  const { data, error } = await query

  if (error) {
    return { success: false, error: `Failed to fetch songs: ${error.message}` }
  }

  // NEVER return title or uploaded_by — BLIND_SELECT already excludes them
  return { success: true, data: (data ?? []) as unknown as SongBlind[] }
}

/* ─── getSongById ────────────────────────────────────────────── */

export async function getSongById(
  id: string
): Promise<ActionResult<SongBlind | SongFull>> {
  const supabase = createServiceClient()

  const { data: rawSong, error } = await supabase
    .from('songs')
    .select(FULL_SELECT)
    .eq('id', id)
    .single()

  if (error || !rawSong) {
    return { success: false, error: 'Song not found' }
  }

  const song = rawSong as unknown as Record<string, unknown>

  if (!song.is_revealed) {
    // Strip title, uploaded_by; replace album_art_url with unsplash_image
    const blind: SongBlind = {
      id: song.id as string,
      alias: song.alias as string,
      genre: song.genre as string,
      tags: song.tags as string[],
      audio_url: song.audio_url as string,
      unsplash_image: song.unsplash_image as string,
      album_art_url: song.unsplash_image as string, // replaced with unsplash
      avg_rating: song.avg_rating as number,
      rating_count: song.rating_count as number,
      is_revealed: false,
      spotify_bpm: song.spotify_bpm as number | null,
      spotify_key: song.spotify_key as number | null,
      spotify_energy: song.spotify_energy as number | null,
      spotify_danceability: song.spotify_danceability as number | null,
      spotify_valence: song.spotify_valence as number | null,
      created_at: song.created_at as string,
    }
    return { success: true, data: blind }
  }

  return { success: true, data: song as unknown as SongFull }
}

/* ─── getArtistSongs ─────────────────────────────────────────── */

export async function getArtistSongs(): Promise<ActionResult<SongFull[]>> {
  const roleCheck = await requireArtistOrAdmin()
  if ('error' in roleCheck) return { success: false, error: roleCheck.error }
  const { userId } = roleCheck

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('songs')
    .select(FULL_SELECT)
    .eq('uploaded_by', userId)
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, error: `Failed to fetch songs: ${error.message}` }
  }

  return { success: true, data: (data ?? []) as unknown as SongFull[] }
}
