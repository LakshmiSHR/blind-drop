'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { GlowButton } from '@/components/GlowButton/GlowButton'
import { useRouter } from 'next/navigation'

interface RevealOverlayProps {
  isRevealed: boolean
  albumArtUrl: string
  artistName: string
  trackTitle: string
  avgRating: number
}

export function RevealOverlay({
  isRevealed,
  albumArtUrl,
  artistName,
  trackTitle,
  avgRating,
}: RevealOverlayProps) {
  const router = useRouter()

  return (
    <AnimatePresence>
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'hsl(220 25% 4% / 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          {/* Phase 1: White flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'white',
              pointerEvents: 'none',
            }}
          />

          {/* Phase 5: Radial glow burst */}
          <motion.div
            initial={{ scale: 0, opacity: 0.7 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ delay: 1, duration: 1.2, ease: [0, 0, 0.2, 1] }}
            style={{
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, hsl(263 100% 67% / 0.6), transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Phase 3: Album art */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0, 0, 0.2, 1] }}
            style={{
              width: 'min(300px, 70vw)',
              aspectRatio: '1',
              borderRadius: 'var(--radius-lg)',
              backgroundImage: `url(${albumArtUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 0 60px hsl(263 100% 67% / 0.3)',
              marginBottom: 32,
            }}
          />

          {/* Phase 4: Track title */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="gradient-text"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 800,
              margin: 0,
              textAlign: 'center',
            }}
          >
            {trackTitle}
          </motion.h2>

          {/* Phase 4: Artist name — letter stagger */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { delayChildren: 1, staggerChildren: 0.04 } },
            }}
            style={{
              display: 'flex',
              marginTop: 8,
              fontSize: 18,
              color: 'hsl(220 15% 55%)',
            }}
          >
            <span style={{ marginRight: 6 }}>by</span>
            {artistName.split('').map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.div>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            style={{
              marginTop: 20,
              fontSize: 16,
              color: 'hsl(45 100% 55%)',
              fontWeight: 600,
            }}
          >
            ⭐ {avgRating.toFixed(1)} / 10
          </motion.div>

          {/* Close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            style={{ marginTop: 32 }}
          >
            <GlowButton onClick={() => router.push('/discover')}>
              Back to Discover
            </GlowButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
