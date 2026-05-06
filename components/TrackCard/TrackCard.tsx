'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { SongBlind, SongFull } from '@/types'
import styles from './TrackCard.module.css'

interface TrackCardProps {
  song: SongBlind | SongFull
}

function isSongFull(song: SongBlind | SongFull): song is SongFull {
  return song.is_revealed && 'title' in song
}

export function TrackCard({ song }: TrackCardProps) {
  const router = useRouter()
  const revealed = isSongFull(song)
  const imageUrl = revealed && song.album_art_url
    ? song.album_art_url
    : song.unsplash_image

  return (
    <motion.div
      className={styles.card}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      onClick={() => router.push(`/listen/${song.id}`)}
    >
      {/* Artwork */}
      <div
        className={styles.artwork}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className={styles.overlay} />

        {/* Genre badge — top left */}
        <div
          className="badge"
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 3,
          }}
        >
          {song.genre}
        </div>

        {/* Rating — top right */}
        {song.avg_rating > 0 && (
          <div
            className="glass"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 3,
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            ⭐ {song.avg_rating.toFixed(1)}
          </div>
        )}

        {/* Play overlay */}
        <div className={styles.playOverlay}>
          <div className={styles.playBtn}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
            >
              <polygon points="6,3 20,12 6,21" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>
          {song.alias}
        </div>

        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 13, color: 'hsl(220 15% 55%)' }}
          >
            by {(song as SongFull).uploaded_by}
          </motion.div>
        )}

        {/* Reveal progress */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: song.is_revealed ? '100%' : '0%',
            }}
          />
        </div>

        <div
          style={{
            fontSize: 12,
            color: 'hsl(220 15% 55%)',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>
            {song.rating_count} rating{song.rating_count !== 1 ? 's' : ''}
          </span>
          <span>
            {song.is_revealed ? '✨ Revealed' : 'Rate to reveal'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
