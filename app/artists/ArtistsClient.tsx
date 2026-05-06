'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface Artist {
  id: string
  username: string
  avatarUrl: string | null
  trackCount: number
  avgRating: number
  genres: string[]
}

export function ArtistsClient({ artists }: { artists: Artist[] }) {
  return (
    <main
      style={{
        paddingTop: 88,
        paddingBottom: 60,
        minHeight: '100dvh',
        maxWidth: 900,
        margin: '0 auto',
        padding: '88px 24px 60px',
      }}
    >
      <h1 className="gradient-text" style={{ fontSize: 32, fontWeight: 800, margin: '0 0 32px' }}>
        Artists
      </h1>

      {artists.length === 0 ? (
        <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: 'hsl(220 15% 55%)' }}>
            No revealed artists yet. Rate some tracks to unlock them!
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          {artists.map((artist, i) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/artists/${artist.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className="glass"
                  style={{
                    padding: 24,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    transition: 'border-color 0.2s',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: artist.avatarUrl
                        ? `url(${artist.avatarUrl}) center/cover`
                        : 'linear-gradient(135deg, hsl(263 100% 67%), hsl(174 70% 52%))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      fontWeight: 800,
                      color: 'white',
                    }}
                  >
                    {!artist.avatarUrl && artist.username[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{artist.username}</div>
                    <div style={{ fontSize: 13, color: 'hsl(220 15% 55%)', marginTop: 2 }}>
                      {artist.trackCount} track{artist.trackCount !== 1 ? 's' : ''}
                      {artist.avgRating > 0 && ` · ⭐ ${artist.avgRating.toFixed(1)}`}
                    </div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                      {artist.genres.slice(0, 3).map((g) => (
                        <span
                          key={g}
                          className="badge"
                          style={{ fontSize: 10, padding: '2px 6px' }}
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  )
}
