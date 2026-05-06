'use client'

import { useState, useTransition } from 'react'
import { togglePublish, deleteSong } from '@/actions/songs'
import { GlowButton } from '@/components/GlowButton/GlowButton'
import type { SongFull } from '@/types'

interface ArtistDashboardClientProps {
  songs: SongFull[]
}

export function ArtistDashboardClient({ songs: initial }: ArtistDashboardClientProps) {
  const [songs, setSongs] = useState(initial)
  const [isPending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const totalUploads = songs.length
  const totalRatings = songs.reduce((sum, s) => sum + s.rating_count, 0)
  const avgRating =
    totalUploads > 0
      ? (songs.reduce((sum, s) => sum + s.avg_rating * s.rating_count, 0) /
          Math.max(totalRatings, 1))
      : 0

  function handleToggle(songId: string, publish: boolean) {
    startTransition(async () => {
      const result = await togglePublish(songId, publish)
      if (result.success) {
        setSongs((prev) =>
          prev.map((s) => (s.id === songId ? { ...s, is_published: publish } : s))
        )
      }
    })
  }

  function handleDelete(songId: string) {
    startTransition(async () => {
      const result = await deleteSong(songId)
      if (result.success) {
        setSongs((prev) => prev.filter((s) => s.id !== songId))
        setConfirmDelete(null)
      }
    })
  }

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
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <h1 className="gradient-text" style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
          Artist Dashboard
        </h1>
        <GlowButton href="/upload">+ Upload New Track</GlowButton>
      </div>

      {/* Summary Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[
          { label: 'Uploads', value: totalUploads },
          { label: 'Total Ratings', value: totalRatings },
          { label: 'Avg Rating', value: avgRating.toFixed(1) },
        ].map((s) => (
          <div key={s.label} className="glass" style={{ padding: 20, textAlign: 'center' }}>
            <div className="gradient-text" style={{ fontSize: 28, fontWeight: 800 }}>
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

      {/* Songs Table */}
      {songs.length === 0 ? (
        <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: 'hsl(220 15% 55%)' }}>No tracks uploaded yet.</p>
          <GlowButton href="/upload" size="sm">Upload Your First Track</GlowButton>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0 4px',
              fontSize: 14,
            }}
          >
            <thead>
              <tr>
                {['Title', 'Alias', 'Genre', 'Ratings', 'Avg', 'Status', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '8px 12px',
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'hsl(220 15% 55%)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <tr
                  key={song.id}
                  className="glass"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <td style={cellStyle}>
                    <span style={{ fontWeight: 600 }}>{song.title}</span>
                  </td>
                  <td style={cellStyle}>{song.alias}</td>
                  <td style={cellStyle}>
                    <span className="badge">{song.genre}</span>
                  </td>
                  <td style={cellStyle}>{song.rating_count}</td>
                  <td style={cellStyle}>
                    {song.avg_rating > 0 ? `⭐ ${song.avg_rating.toFixed(1)}` : '—'}
                  </td>
                  <td style={cellStyle}>
                    <span
                      style={{
                        display: 'inline-flex',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: 11,
                        fontWeight: 700,
                        background: song.is_revealed
                          ? 'hsl(142 70% 45% / 0.15)'
                          : song.is_published
                            ? 'hsl(263 100% 67% / 0.12)'
                            : 'hsl(220 15% 25% / 0.5)',
                        color: song.is_revealed
                          ? 'hsl(142 70% 65%)'
                          : song.is_published
                            ? 'hsl(263 100% 80%)'
                            : 'hsl(220 15% 55%)',
                        border: `1px solid ${
                          song.is_revealed
                            ? 'hsl(142 70% 45% / 0.3)'
                            : song.is_published
                              ? 'hsl(263 100% 67% / 0.25)'
                              : 'hsl(220 15% 25% / 0.3)'
                        }`,
                      }}
                    >
                      {song.is_revealed ? '✨ Revealed' : song.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => handleToggle(song.id, !song.is_published)}
                      disabled={isPending}
                      style={actionBtnStyle}
                    >
                      {song.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                    {confirmDelete === song.id ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => handleDelete(song.id)}
                          disabled={isPending}
                          style={{ ...actionBtnStyle, color: 'hsl(0 80% 60%)' }}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(null)}
                          style={actionBtnStyle}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(song.id)}
                        style={{ ...actionBtnStyle, color: 'hsl(0 70% 65%)' }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

const cellStyle: React.CSSProperties = {
  padding: '12px',
  verticalAlign: 'middle',
}

const actionBtnStyle: React.CSSProperties = {
  background: 'hsl(220 20% 10%)',
  border: '1px solid hsl(263 50% 25% / 0.4)',
  borderRadius: 6,
  padding: '4px 10px',
  fontSize: 12,
  fontWeight: 600,
  color: 'hsl(0 0% 91%)',
  cursor: 'pointer',
  transition: 'all 0.15s',
}
