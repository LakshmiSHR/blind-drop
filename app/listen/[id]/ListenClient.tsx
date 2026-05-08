'use client'

import { useState } from 'react'
import type { SongBlind, SongFull } from '@/types'

import { AudioPlayer } from '@/components/AudioPlayer/AudioPlayer'
import { SpotifyFingerprint } from '@/components/SpotifyFingerprint/SpotifyFingerprint'
import { RatingSlider } from '@/components/ui/RatingSlider'

import { RevealOverlay } from '@/components/RevealOverlay/RevealOverlay'

interface ListenClientProps {
  song: SongBlind | SongFull
  existingRating: number | null
}

export function ListenClient({
  song,
  existingRating,
}: ListenClientProps) {
  const [revealData, setRevealData] = useState<{
    isRevealed: boolean
    avgRating: number
    ratingCount: number
  } | null>(null)

  const revealed =
    song.is_revealed || revealData?.isRevealed

  return (
    <main
      style={{
        paddingTop: 88,
        paddingBottom: 60,
        minHeight: '100dvh',
        maxWidth: 1100,
        margin: '0 auto',
        padding: '88px 24px 60px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 32,
        }}
      >
        {/* Song card */}
        <div
          className="glass"
          style={{
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Artwork */}
          <div
            style={{
              width: '100%',
              maxWidth: 400,
              aspectRatio: '1',
              borderRadius: '20px',
              backgroundImage: `url(${
                revealed &&
                'album_art_url' in song &&
                song.album_art_url
                  ? song.album_art_url
                  : song.unsplash_image
              })`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              margin: '0 auto',
            }}
          />

          {/* Title */}
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                margin: 0,
              }}
            >
              {revealed &&
              'title' in song
                ? song.title
                : song.alias}
            </h1>

            {revealed &&
              'uploaded_by' in song && (
                <p
                  style={{
                    color:
                      'hsl(220 15% 55%)',
                    marginTop: 4,
                    fontSize: 14,
                  }}
                >
                  by {song.uploaded_by}
                </p>
              )}

            <div
              className="badge"
              style={{ marginTop: 12 }}
            >
              {song.genre}
            </div>
          </div>

          {/* Audio */}
          <AudioPlayer
            audioPath={song.audio_url}
          />
        </div>

        {/* Right side */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <SpotifyFingerprint
            bpm={song.spotify_bpm ?? undefined}
            energy={
              song.spotify_energy ??
              undefined
            }
            danceability={
              song.spotify_danceability ??
              undefined
            }
            valence={
              song.spotify_valence ??
              undefined
            }
            keyIndex={
              song.spotify_key ?? undefined
            }
          />

          <RatingSlider
            songId={song.id}
            existingRating={existingRating}
            onReveal={(data) =>
              setRevealData(data)
            }
          />
        </div>
      </div>

      {/* Reveal */}
      <RevealOverlay
        isRevealed={
          !!(
            revealData?.isRevealed &&
            !song.is_revealed
          )
        }
        albumArtUrl={
          song.album_art_url ??
          song.unsplash_image
        }
        artistName={
          'uploaded_by' in song
            ? song.uploaded_by
            : song.alias
        }
        trackTitle={
          'title' in song
            ? song.title
            : song.alias
        }
        avgRating={
          revealData?.avgRating ??
          song.avg_rating
        }
      />
    </main>
  )
}