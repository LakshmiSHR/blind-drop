'use client'

import { motion } from 'framer-motion'
import { SPOTIFY_KEYS } from '@/types'

interface SpotifyFingerprintProps {
  bpm?: number
  energy?: number
  danceability?: number
  valence?: number
  keyIndex?: number
}

const bars = [
  { label: 'BPM', key: 'bpm' },
  { label: 'Energy', key: 'energy' },
  { label: 'Dance', key: 'danceability' },
  { label: 'Vibe', key: 'valence' },
  { label: 'Key', key: 'keyIndex' },
] as const

const gradientColors = [
  'hsl(263 100% 67%)',
  'hsl(240 80% 62%)',
  'hsl(210 90% 55%)',
  'hsl(185 80% 50%)',
  'hsl(174 70% 52%)',
]

export function SpotifyFingerprint({
  bpm,
  energy,
  danceability,
  valence,
  keyIndex,
}: SpotifyFingerprintProps) {
  const values: Record<string, number> = {
    bpm: bpm ? Math.min((bpm - 60) / 140, 1) : 0,
    energy: energy ?? 0,
    danceability: danceability ?? 0,
    valence: valence ?? 0,
    keyIndex: 0,
  }

  const isMock = bpm === 120 && energy === 0.8 && danceability === 0.7 && valence === 0.6

  return (
    <div className="glass" style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
          Audio Fingerprint
        </h3>
        <span className="badge">{isMock ? 'Mock' : 'Spotify'}</span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          height: 140,
          gap: 8,
        }}
      >
        {bars.map((bar, i) => {
          const isKey = bar.key === 'keyIndex'
          const value = values[bar.key]
          const barHeight = isKey ? 0.5 : value

          return (
            <div
              key={bar.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                flex: 1,
              }}
            >
              {/* Value label */}
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: gradientColors[i],
                }}
              >
                {isKey
                  ? (keyIndex !== undefined ? SPOTIFY_KEYS[keyIndex] : '—')
                  : bar.key === 'bpm'
                    ? (bpm ?? '—')
                    : (value * 100).toFixed(0)}
              </span>

              {/* Bar */}
              {!isKey && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: barHeight }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.6,
                    ease: [0, 0, 0.2, 1],
                  }}
                  style={{
                    width: '100%',
                    maxWidth: 32,
                    height: 80,
                    borderRadius: 6,
                    background: `linear-gradient(to top, ${gradientColors[i]}, ${gradientColors[i]}88)`,
                    transformOrigin: 'bottom',
                  }}
                />
              )}

              {isKey && (
                <div
                  style={{
                    width: '100%',
                    maxWidth: 32,
                    height: 80,
                    borderRadius: 6,
                    background: 'hsl(220 20% 10% / 0.5)',
                    border: `1px solid ${gradientColors[i]}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 800,
                    color: gradientColors[i],
                  }}
                >
                  {keyIndex !== undefined ? SPOTIFY_KEYS[keyIndex] : '?'}
                </div>
              )}

              {/* Label */}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'hsl(220 15% 55%)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {bar.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
