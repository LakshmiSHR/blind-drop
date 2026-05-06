'use client'

import type { Profile, SongBlind, SongFull } from '@/types'

interface ProfileClientProps {
  profile: Profile
  stats: {
    totalRated: number
    avgGiven: number
    topGenre: string
    recentRatings: Array<{ rating: number; song: SongBlind | SongFull }>
  } | null
}

export function ProfileClient({ profile, stats }: ProfileClientProps) {
  return (
    <main
      style={{
        paddingTop: 88,
        paddingBottom: 60,
        minHeight: '100dvh',
        maxWidth: 800,
        margin: '0 auto',
        padding: '88px 24px 60px',
      }}
    >
      {/* Header */}
      <div
        className="glass"
        style={{
          padding: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: profile.avatar_url
              ? `url(${profile.avatar_url}) center/cover`
              : 'linear-gradient(135deg, hsl(263 100% 67%), hsl(174 70% 52%))',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            fontWeight: 800,
            color: 'white',
          }}
        >
          {!profile.avatar_url && profile.username[0]?.toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{profile.username}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span className="badge">{profile.role}</span>
            <span style={{ fontSize: 13, color: 'hsl(220 15% 55%)' }}>
              Joined {new Date(profile.created_at).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              marginBottom: 24,
            }}
          >
            {[
              { label: 'Tracks Rated', value: stats.totalRated },
              { label: 'Avg Score', value: stats.avgGiven.toFixed(1) },
              { label: 'Top Genre', value: stats.topGenre },
            ].map((s) => (
              <div
                key={s.label}
                className="glass"
                style={{ padding: 20, textAlign: 'center' }}
              >
                <div
                  className="gradient-text"
                  style={{ fontSize: 28, fontWeight: 800 }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'hsl(220 15% 55%)',
                    marginTop: 4,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Rating History */}
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>
            Recent Ratings
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stats.recentRatings.length === 0 && (
              <p style={{ color: 'hsl(220 15% 55%)', textAlign: 'center', padding: 40 }}>
                No ratings yet. Start discovering!
              </p>
            )}
            {stats.recentRatings.map((r, i) => {
              const song = r.song
              const revealed = song.is_revealed && 'title' in song
              return (
                <div
                  key={i}
                  className="glass"
                  style={{
                    padding: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  {/* Thumbnail */}
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
                    {revealed && (
                      <div style={{ fontSize: 12, color: 'hsl(220 15% 55%)' }}>
                        by {(song as SongFull).uploaded_by}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>
                      {r.rating}/10
                    </div>
                    <div style={{ fontSize: 11, color: 'hsl(220 15% 55%)' }}>
                      Avg: {song.avg_rating.toFixed(1)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </main>
  )
}
