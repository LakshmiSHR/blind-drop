'use server'

import 'server-only'

import bcrypt from 'bcryptjs'
import { auth } from '@/auth'
import { createServiceClient } from '@/lib/supabase/server'
import {
  SignUpSchema,
  UpdateProfileSchema,
  type ActionResult,
  type Profile,
  type SongBlind,
  type SongFull,
} from '@/types'

/* ─── signUp ─────────────────────────────────────────────────── */

export async function signUp(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  // 1. Zod validate
  const parsed = SignUpSchema.safeParse({
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const supabase = createServiceClient()

  // 2. Check username uniqueness
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', parsed.data.username)
    .single()

  if (existingUser) {
    return { success: false, error: 'Username is already taken' }
  }

  // 3. Hash password
  const passwordHash = await bcrypt.hash(parsed.data.password, 12)

  // 4. Insert profile
  const id = crypto.randomUUID()
  const { error: insertError } = await supabase.from('profiles').insert({
    id,
    username: parsed.data.username,
    email: parsed.data.email,
    password_hash: passwordHash,
    role: 'listener',
  })

  if (insertError) {
    // Handle duplicate email (Postgres unique violation)
    if (insertError.code === '23505') {
      return { success: false, error: 'An account with this email already exists' }
    }
    return { success: false, error: `Sign up failed: ${insertError.message}` }
  }

  return { success: true, data: { id } }
}

/* ─── updateProfile ──────────────────────────────────────────── */

export async function updateProfile(
  formData: FormData
): Promise<ActionResult<Profile>> {
  // 1. Auth check
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Please sign in' }
  }
  const userId = session.user.id

  // 2. Parse fields
  const username = formData.get('username') as string | null
  const avatarFile = formData.get('avatarUrl') as File | null

  const updates: Record<string, unknown> = {}

  // Validate text fields with Zod
  const zodInput: Record<string, unknown> = {}
  if (username) zodInput.username = username

  const parsed = UpdateProfileSchema.safeParse(zodInput)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  if (parsed.data.username) updates.username = parsed.data.username

  const supabase = createServiceClient()

  // 3. If avatar is a File, upload to Storage
  if (avatarFile && avatarFile.size > 0) {
    const avatarPath = `${userId}/${Date.now()}-${avatarFile.name}`
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(avatarPath, avatarFile, { contentType: avatarFile.type })

    if (!uploadError) {
      const { data: publicData } = supabase.storage
        .from('avatars')
        .getPublicUrl(avatarPath)
      updates.avatar_url = publicData.publicUrl
    }
  } else if (parsed.data.avatar_url !== undefined) {
    updates.avatar_url = parsed.data.avatar_url
  }

  if (Object.keys(updates).length === 0) {
    return { success: false, error: 'No fields to update' }
  }

  // 4. Update profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('id, username, email, role, avatar_url, created_at')
    .single()

  if (error) {
    return { success: false, error: `Update failed: ${error.message}` }
  }

  return { success: true, data: profile as Profile }
}

/* ─── getProfile ─────────────────────────────────────────────── */

export async function getProfile(
  userId: string
): Promise<ActionResult<Profile>> {
  const supabase = createServiceClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, username, email, role, avatar_url, created_at')
    .eq('id', userId)
    .single()

  if (error || !profile) {
    return { success: false, error: 'Profile not found' }
  }

  // password_hash is never selected
  return { success: true, data: profile as Profile }
}

/* ─── getListenerStats ───────────────────────────────────────── */

export async function getListenerStats(
  userId: string
): Promise<
  ActionResult<{
    totalRated: number
    avgGiven: number
    topGenre: string
    recentRatings: Array<{ rating: number; song: SongBlind | SongFull }>
  }>
> {
  // 1. Auth — verify userId matches session
  const session = await auth()
  if (!session?.user?.id || session.user.id !== userId) {
    return { success: false, error: 'Unauthorized' }
  }

  const supabase = createServiceClient()

  // 2. Query all ratings for user joined with songs
  const { data, error } = await supabase
    .from('ratings')
    .select(
      `
      rating, created_at,
      songs (
        id, alias, genre, tags, audio_url, unsplash_image, album_art_url,
        avg_rating, rating_count, is_revealed,
        spotify_bpm, spotify_key, spotify_energy, spotify_danceability,
        spotify_valence, created_at, title, uploaded_by, is_published
      )
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, error: `Failed to fetch stats: ${error.message}` }
  }

  const rows = data ?? []

  // 3. Calculate stats
  const totalRated = rows.length
  const avgGiven =
    totalRated > 0
      ? Math.round(
          (rows.reduce((sum, r) => sum + (r.rating as number), 0) / totalRated) *
            100
        ) / 100
      : 0

  // Most frequent genre
  const genreCounts: Record<string, number> = {}
  for (const row of rows) {
    const songData = row.songs as unknown as Record<string, unknown> | null
    if (songData?.genre) {
      const g = songData.genre as string
      genreCounts[g] = (genreCounts[g] || 0) + 1
    }
  }
  const topGenre =
    Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'None'

  // 4. Recent 10 ratings with privacy-aware song data
  const recentRatings = rows.slice(0, 10).map((row) => {
    const songData = row.songs as unknown as Record<string, unknown> | null
    if (!songData) {
      return {
        rating: row.rating as number,
        song: {} as SongBlind,
      }
    }

    let song: SongBlind | SongFull

    if (songData.is_revealed) {
      song = songData as unknown as SongFull
    } else {
      song = {
        id: songData.id,
        alias: songData.alias,
        genre: songData.genre,
        tags: songData.tags,
        audio_url: songData.audio_url,
        unsplash_image: songData.unsplash_image,
        album_art_url: songData.unsplash_image,
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

    return { rating: row.rating as number, song }
  })

  return {
    success: true,
    data: { totalRated, avgGiven, topGenre, recentRatings },
  }
}
