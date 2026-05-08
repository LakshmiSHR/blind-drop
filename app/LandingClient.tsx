'use client'

import { motion } from 'framer-motion'
import { GlowButton } from '@/components/GlowButton/GlowButton'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const } },
}

const steps = [
  {
    num: 1,
    title: 'Listen',
    icon: '🎧',
    desc: 'Track plays blind. No name. No art. Just sound.',
  },
  {
    num: 2,
    title: 'Rate',
    icon: '⭐',
    desc: 'Score it 1–10 on sound alone.',
  },
  {
    num: 3,
    title: 'Reveal',
    icon: '✨',
    desc: 'Artist identity unlocks with an animation.',
  },
]

const features = [
  {
    title: 'Zero Bias',
    icon: '🎭',
    desc: 'Every song is judged on merit. No follower counts, no fame — just pure sound.',
  },
  {
    title: 'Artist Discovery',
    icon: '🔍',
    desc: 'Find artists you\'d never hear otherwise. Let your ears be the algorithm.',
  },
  {
    title: 'Your Taste Profile',
    icon: '📊',
    desc: 'Build a history of your ratings. See your genres, patterns, and discoveries.',
  },
]

export function LandingClient() {
  return (
    <main>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '120px 24px 80px',
          overflow: 'hidden',
        }}
      >
        {/* Waveform bars */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 6,
            opacity: 0.07,
          }}
        >
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 60 + Math.sin(i * 0.5) * 40,
                background: 'linear-gradient(to top, hsl(263 100% 67%), hsl(174 70% 52%))',
                borderRadius: 2,
                animation: `waveform ${1.2 + (i % 5) * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.h1
            variants={fadeUp}
            className="gradient-text"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              maxWidth: 800,
              margin: 0,
            }}
          >
            Hear it first.
            <br />
            Judge it honestly.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'hsl(220 15% 55%)',
              maxWidth: 520,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Artists upload anonymously. You rate on sound alone.
            Identity reveals on the first rating.
          </motion.p>

          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <GlowButton size="lg" href="/discover">
  Start Discovering
</GlowButton>

<GlowButton size="lg" href="/artist/signup">
  Become an Artist
</GlowButton>

<GlowButton size="lg" href="/upload">
  Upload Song
</GlowButton>
          </motion.div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section
        style={{
          padding: '80px 24px',
          maxWidth: 1000,
          margin: '0 auto',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 700,
            marginBottom: 48,
          }}
        >
          How It Works
        </motion.h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
          }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.num}
              className="glass"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: step.num * 0.1 }}
              style={{
                padding: 32,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                className="neon-glow"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'hsl(263 100% 67% / 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}
              >
                {step.icon}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'hsl(263 100% 80%)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Step {step.num}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                {step.title}
              </h3>
              <p style={{ color: 'hsl(220 15% 55%)', margin: 0, lineHeight: 1.6 }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section
        style={{
          padding: '80px 24px',
          maxWidth: 1000,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              className="glass"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ padding: 32 }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{feat.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
                {feat.title}
              </h3>
              <p style={{ color: 'hsl(220 15% 55%)', margin: 0, lineHeight: 1.6 }}>
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section
        style={{
          padding: '80px 24px 120px',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 700,
              margin: 0,
            }}
          >
            Ready to listen differently?
          </h2>
          <GlowButton size="lg" href="/discover">
            Start Discovering
          </GlowButton>
        </motion.div>
      </section>
    </main>
  )
}
