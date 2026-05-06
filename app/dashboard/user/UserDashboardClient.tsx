'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Profile, SongBlind, SongFull } from '@/types'

interface UserDashboardClientProps {
  profile: Profile
  ratings: Array<{
    songId: string
    rating: number
    ratedAt: string
    song: SongBlind | SongFull
  }>
}

export function UserDashboardClient({ profile, ratings }: UserDashboardClientProps) {
  const [tab, setTab] = useState<'ratings' | 'playlists'>('ratings')

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
      <h1 className="gradient-text" style={{ fontSize: 28, fontWeight: 800, margin: '0 0 24px' }}>
        Dashboard
      </h1>

      {/* Quick profile */}
      <div
        className="glass"
        style={{
          padding: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: profile.avatar_url
              ? `url(${profile.avatar_url}) center/cover`
              : 'linear-gradient(135deg, hsl(263 100% 67%), hsl(174 70% 52%))',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 800,
            color: 'white',
          }}
        >
          {!profile.avatar_url && profile.username[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>{profile.username}</div>
          <div style={{ fontSize: 13, color: 'hsl(220 15% 55%)' }}>
            {ratings.length} track{ratings.length !== 1 ? 's' : ''} rated
          </div>
        </div>
        <Link
          href="/profile"
          style={{
            fontSize: 13,
            color: 'hsl(263 100% 75%)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          View Profile →
        </Link>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          marginBottom: 20,
          background: 'hsl(220 20% 10% / 0.6)',
          borderRadius: 'var(--radius-md)',
          padding: 4,
        }}
      >
        {(['ratings', 'playlists'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              background: tab === t ? 'hsl(263 100% 67% / 0.15)' : 'transparent',
              color: tab === t ? 'hsl(263 100% 80%)' : 'hsl(220 15% 55%)',
              transition: 'all 0.2s',
            }}
          >
            {t === 'ratings' ? 'Rating History' : 'Playlists'}
          </button>
        ))}
      </div>

      {/* Rating History Tab */}
      {tab === 'ratings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ratings.length === 0 ? (
            <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
              <p style={{ color: 'hsl(220 15% 55%)' }}>No ratings yet.</p>
              <Link
                href="/discover"
                style={{ color: 'hsl(263 100% 75%)', fontWeight: 600, textDecoration: 'none' }}
              >
                Start Discovering →
              </Link>
            </div>
          ) : (
            ratings.map((r) => {
              const song = r.song
              const revealed = song.is_revealed && 'title' in song
              return (
                <Link
                  key={r.songId}
                  href={`/listen/${r.songId}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    className="glass"
                    style={{
                      padding: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        flexShrink: 0,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundImage: revealed && (song as SongFull).album_art_url
                          ? `url(${(song as SongFull).album_art_url})`
                          : `url(${song.unsplash_image})`,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {revealed ? (song as SongFull).title : song.alias}
                      </div>
                      <div style={{ fontSize: 12, color: 'hsl(220 15% 55%)', display: 'flex', gap: 8 }}>
                        {revealed && <span>by {(song as SongFull).uploaded_by}</span>}
                        <span className="badge" style={{ fontSize: 10, padding: '2px 6px' }}>
                          {song.genre}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{r.rating}/10</div>
                      <div style={{ fontSize: 11, color: 'hsl(220 15% 55%)' }}>
                        Avg: {song.avg_rating.toFixed(1)}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'hsl(220 15% 45%)',
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {new Date(r.ratedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      )}

      {/* Playlists Tab */}
      {tab === 'playlists' && (
        <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <p style={{ color: 'hsl(220 15% 55%)', marginBottom: 8 }}>
            Playlists coming soon
          </p>
          <p style={{ fontSize: 13, color: 'hsl(220 15% 40%)' }}>
            Save your favorite discoveries into custom playlists.
          </p>
        </div>
      )}
    </main>
  )
}
