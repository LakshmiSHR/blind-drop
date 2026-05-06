import 'server-only'

const IS_MOCK = !process.env.SPOTIFY_CLIENT_ID

import { redis } from '@/lib/redis'

export interface SpotifyFeatures {
  tempo: number
  energy: number
  danceability: number
  valence: number
  key: number
}

const MOCK_FEATURES: SpotifyFeatures = {
  tempo: 120,
  energy: 0.8,
  danceability: 0.7,
  valence: 0.6,
  key: 5,
}

const SPOTIFY_TOKEN_KEY = 'spotify:token'

/**
 * Extract a Spotify track ID from a URL or return the raw string if already an ID.
 * Supports: https://open.spotify.com/track/{id}?si=...
 */
function extractTrackId(trackUrlOrId: string): string {
  try {
    const url = new URL(trackUrlOrId)
    const segments = url.pathname.split('/')
    const trackIndex = segments.indexOf('track')
    if (trackIndex !== -1 && segments[trackIndex + 1]) {
      return segments[trackIndex + 1]
    }
  } catch {
    // Not a URL — treat as a raw track ID
  }
  return trackUrlOrId
}

/**
 * Retrieve a Spotify Client Credentials access token.
 * Cached in Redis under `spotify:token` to avoid hitting the token endpoint on every call.
 */
async function getSpotifyToken(): Promise<string> {
  const cached = await redis.get<string>(SPOTIFY_TOKEN_KEY)
  if (cached) return cached

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    throw new Error(`Spotify token request failed: ${res.status}`)
  }

  const data = (await res.json()) as { access_token: string; expires_in: number }

  // Cache with a 60-second safety margin
  await redis.set(SPOTIFY_TOKEN_KEY, data.access_token, {
    ex: data.expires_in - 60,
  })

  return data.access_token
}

/**
 * Fetch audio features for a Spotify track.
 * When SPOTIFY_CLIENT_ID is unset (IS_MOCK), returns deterministic mock data.
 */
export async function fetchSpotifyFeatures(
  trackUrlOrId: string
): Promise<SpotifyFeatures> {
  if (IS_MOCK) return MOCK_FEATURES

  const trackId = extractTrackId(trackUrlOrId)
  const token = await getSpotifyToken()

  const res = await fetch(
    `https://api.spotify.com/v1/audio-features/${trackId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 86400 },
    }
  )

  if (!res.ok) {
    console.error(`Spotify audio-features failed: ${res.status}`)
    return MOCK_FEATURES
  }

  const data = (await res.json()) as {
    tempo: number
    energy: number
    danceability: number
    valence: number
    key: number
  }

  return {
    tempo: data.tempo,
    energy: data.energy,
    danceability: data.danceability,
    valence: data.valence,
    key: data.key,
  }
}
