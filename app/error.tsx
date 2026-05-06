'use client'

import { GlowButton } from '@/components/GlowButton/GlowButton'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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
        gap: 20,
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 8 }}>⚠️</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
        Something went wrong
      </h1>
      <p style={{ color: 'hsl(220 15% 55%)', margin: 0, maxWidth: 400 }}>
        An unexpected error occurred. Please try again.
      </p>

      {process.env.NODE_ENV === 'development' && error.message && (
        <pre
          style={{
            background: 'hsl(220 20% 8%)',
            border: '1px solid hsl(263 50% 25% / 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            fontSize: 13,
            color: 'hsl(0 70% 65%)',
            maxWidth: 500,
            overflow: 'auto',
            textAlign: 'left',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {error.message}
        </pre>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <GlowButton onClick={reset}>Try Again</GlowButton>
        <GlowButton href="/">Home</GlowButton>
      </div>
    </main>
  )
}
