'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlowButton } from '@/components/GlowButton/GlowButton'

interface WrappedClientProps {
  year: number
  totalRated: number
  avgGiven: number
  topGenre: string
  topMonth: string
  topTracks: Array<{ name: string; imageUrl: string; rating: number }>
  percentile: number
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.3 } },
}

const cardUp = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] as const } },
}

export function WrappedClient({
  year,
  totalRated,
  avgGiven,
  topGenre,
  topMonth,
  topTracks,
  percentile,
}: WrappedClientProps) {
  const [copied, setCopied] = useState(false)

  function handleShare() {
    const text = `I discovered ${totalRated} tracks on Blind Drop this year 🎵`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main
      style={{
        minHeight: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        padding: '100px 24px 60px',
      }}
    >
      {/* Floating orbs */}
      {[
        { size: 300, top: '10%', left: '10%', color: 'hsl(263 100% 67% / 0.08)', delay: '0s' },
        { size: 200, top: '60%', right: '5%', color: 'hsl(174 70% 52% / 0.06)', delay: '1s' },
        { size: 250, bottom: '15%', left: '30%', color: 'hsl(263 100% 67% / 0.05)', delay: '2s' },
      ].map((orb, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            filter: 'blur(60px)',
            animation: `float 6s ease-in-out infinite`,
            animationDelay: orb.delay,
            pointerEvents: 'none',
            ...orb,
          }}
        />
      ))}

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 600,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <motion.h1
          variants={cardUp}
          className="gradient-text"
          style={{
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: 800,
            textAlign: 'center',
            margin: 0,
          }}
        >
          Your {year} Wrapped
        </motion.h1>

        {/* Stat 1: Total */}
        <motion.div variants={cardUp} className="glass neon-glow" style={statCardStyle}>
          <div className="gradient-text" style={{ fontSize: 64, fontWeight: 800, lineHeight: 1 }}>
            {totalRated}
          </div>
          <div style={statLabelStyle}>tracks discovered</div>
        </motion.div>

        {/* Stat 2: Top Genre */}
        <motion.div variants={cardUp} className="glass" style={statCardStyle}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎵</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{topGenre}</div>
          <div style={statLabelStyle}>was your top genre</div>
        </motion.div>

        {/* Stat 3: Avg Rating */}
        <motion.div variants={cardUp} className="glass" style={statCardStyle}>
          <div className="gradient-text" style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}>
            {avgGiven}
          </div>
          <div style={statLabelStyle}>average score given</div>
        </motion.div>

        {/* Stat 4: Top Month */}
        <motion.div variants={cardUp} className="glass" style={statCardStyle}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{topMonth}</div>
          <div style={statLabelStyle}>was your most active month</div>
        </motion.div>

        {/* Top 5 */}
        {topTracks.length > 0 && (
          <motion.div variants={cardUp} className="glass" style={{ ...statCardStyle, gap: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'hsl(220 15% 55%)' }}>
              Your Top 5
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {topTracks.map((t, i) => (
                <div key={i} style={{ textAlign: 'center', width: 80 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 10,
                      margin: '0 auto 6px',
                      backgroundImage: t.imageUrl ? `url(${t.imageUrl})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      background: t.imageUrl
                        ? `url(${t.imageUrl}) center/cover`
                        : 'linear-gradient(135deg, hsl(263 100% 67% / 0.3), hsl(174 70% 52% / 0.3))',
                    }}
                  />
                  <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'hsl(45 100% 55%)' }}>⭐ {t.rating}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Percentile */}
        <motion.div
          variants={cardUp}
          className="glass pulse-glow"
          style={{
            ...statCardStyle,
            background: 'linear-gradient(135deg, hsl(263 100% 67% / 0.15), hsl(174 70% 52% / 0.1))',
          }}
        >
          <div className="gradient-text" style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>
            Top {100 - percentile}%
          </div>
          <div style={statLabelStyle}>
            You rated more tracks than {percentile}% of listeners
          </div>
        </motion.div>

        {/* Share */}
        <motion.div variants={cardUp}>
          <GlowButton size="lg" onClick={handleShare}>
            {copied ? '✓ Copied!' : '📋 Share Your Wrapped'}
          </GlowButton>
        </motion.div>
      </motion.div>
    </main>
  )
}

const statCardStyle: React.CSSProperties = {
  width: '100%',
  padding: 32,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
}

const statLabelStyle: React.CSSProperties = {
  fontSize: 14,
  color: 'hsl(220 15% 55%)',
  fontWeight: 500,
}
