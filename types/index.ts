import { z } from 'zod'

/* ─── Interfaces ─────────────────────────────────────────────── */

export interface Profile {
  id: string
  username: string
  email: string
  role: 'user' | 'artist' | 'admin' | 'listener'
  avatar_url: string | null
  created_at: string
}

/** Blind-safe song — never exposes title or uploader identity */
export interface SongBlind {
  id: string
  alias: string
  genre: string
  tags: string[]
  audio_url: string
  unsplash_image: string
  album_art_url: string | null
  avg_rating: number
  rating_count: number
  is_revealed: boolean
  spotify_bpm: number | null
  spotify_key: number | null
  spotify_energy: number | null
  spotify_danceability: number | null
  spotify_valence: number | null
  created_at: string
}

/** Full song — only sent when is_revealed === true */
export interface SongFull extends SongBlind {
  title: string
  uploaded_by: string
  is_published: boolean
}

export interface Rating {
  id: string
  song_id: string
  user_id: string
  rating: number
  created_at: string
}

export interface Playlist {
  id: string
  name: string
  user_id: string
  song_ids: string[]
  created_at: string
}

/* ─── Action Result ──────────────────────────────────────────── */

export type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; error: string }

/* ─── Genre Constants ────────────────────────────────────────── */

export const GENRES = [
  'Electronic',
  'Hip-Hop',
  'Pop',
  'Rock',
  'R&B',
  'Jazz',
  'Classical',
  'Indie/Rock',
  'Other',
] as const

export type Genre = (typeof GENRES)[number]

/* ─── Zod Schemas ────────────────────────────────────────────── */

export const CreateSongSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  alias: z.string().min(1, 'Alias is required').max(50, 'Alias too long'),
  genre: z.enum(GENRES),
  tags: z.array(z.string().max(30, 'Tag too long')).max(5, 'Maximum 5 tags').default([]),
  spotifyTrackUrl: z.string().url('Invalid Spotify URL').optional().or(z.literal('')),
})

export const RatingSchema = z.object({
  song_id: z.string().min(1, 'Invalid song ID'),
  rating: z.number().int().min(1, 'Minimum rating is 1').max(10, 'Maximum rating is 10'),
})

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username too long'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password too long'),
})

export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const UpdateProfileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30).optional(),
  avatar_url: z.string().url('Invalid URL').optional().nullable(),
})

/* ─── Unsplash Queries ───────────────────────────────────────── */

export const GENRE_UNSPLASH_QUERIES: Record<string, string> = {
  Electronic: 'electronic music neon lights dj',
  'Hip-Hop': 'hip hop urban street art graffiti',
  Pop: 'pop music colorful vibrant stage',
  Rock: 'rock music electric guitar concert',
  'R&B': 'r&b soul music moody night city',
  Jazz: 'jazz music saxophone smoky bar',
  Classical: 'classical music orchestra concert hall',
  'Indie/Rock': 'indie rock music vinyl records',
  Other: 'abstract music sound waves',
}

/* ─── Spotify Pitch-Class Names ──────────────────────────────── */

export const SPOTIFY_KEYS = [
  'C', 'C♯', 'D', 'D♯', 'E', 'F',
  'F♯', 'G', 'G♯', 'A', 'A♯', 'B',
] as const
