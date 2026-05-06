import Link from 'next/link'
import { GlowButton } from '@/components/GlowButton/GlowButton'

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px',
        gap: 16,
      }}
    >
      <h1
        className="gradient-text"
        style={{
          fontSize: 'clamp(5rem, 15vw, 10rem)',
          fontWeight: 800,
          lineHeight: 1,
          margin: 0,
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: 20,
          color: 'hsl(220 15% 55%)',
          margin: 0,
        }}
      >
        Track not found
      </p>
      <div style={{ marginTop: 16 }}>
        <GlowButton href="/discover">Back to Discover</GlowButton>
      </div>
    </main>
  )
}
