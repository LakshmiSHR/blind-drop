'use client'

import { useActionState, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { GlowButton } from '@/components/GlowButton/GlowButton'
import Link from 'next/link'

/* ─── Inner form (needs useSearchParams → Suspense boundary) ── */

function SignInForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/discover'
  const message = searchParams.get('message')
  const router = useRouter()

  const [credError, setCredError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleCredentials(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCredError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const result = await signIn('credentials', {
      email: form.get('email') as string,
      password: form.get('password') as string,
      callbackUrl,
      redirect: false,
    })

    if (result?.error) {
      setCredError('Invalid email or password.')
      setLoading(false)
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 24px 60px',
      }}
    >
      <div
        className="glass"
        style={{
          width: '100%',
          maxWidth: 420,
          padding: '40px 32px',
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            textAlign: 'center',
            margin: 0,
          }}
        >
          Sign In
        </h1>
        <p
          style={{
            fontSize: 14,
            color: 'hsl(220 15% 55%)',
            textAlign: 'center',
            marginTop: 8,
            marginBottom: 28,
          }}
        >
          Welcome back to Blind Drop
        </p>

        {message && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: 'hsl(150 60% 40% / 0.15)',
              color: 'hsl(150 60% 70%)',
              fontSize: 14,
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            {message}
          </div>
        )}

        {/* Google OAuth */}
        <GlowButton
          onClick={() => signIn('google', { callbackUrl })}
          className="w-full"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </GlowButton>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '24px 0',
            gap: 12,
          }}
        >
          <span style={{ flex: 1, height: 1, background: 'hsl(263 50% 25% / 0.4)' }} />
          <span
            style={{
              fontSize: 12,
              color: 'hsl(220 15% 55%)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
            }}
          >
            or
          </span>
          <span style={{ flex: 1, height: 1, background: 'hsl(263 50% 25% / 0.4)' }} />
        </div>

        {/* Credentials form */}
        <form
          onSubmit={handleCredentials}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <label
            htmlFor="signin-email"
            style={{ fontSize: 13, fontWeight: 600, color: 'hsl(220 15% 55%)' }}
          >
            Email
          </label>
          <input
            id="signin-email"
            name="email"
            type="email"
            required
            className="input"
            placeholder="you@example.com"
          />

          <label
            htmlFor="signin-password"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'hsl(220 15% 55%)',
              marginTop: 4,
            }}
          >
            Password
          </label>
          <input
            id="signin-password"
            name="password"
            type="password"
            required
            className="input"
            placeholder="••••••••"
          />

          {credError && (
            <p style={{ color: 'hsl(0 70% 65%)', fontSize: 14, margin: 0 }}>
              {credError}
            </p>
          )}

          <GlowButton type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </GlowButton>
        </form>

        <p
          style={{
            textAlign: 'center',
            fontSize: 14,
            color: 'hsl(220 15% 55%)',
            marginTop: 24,
            marginBottom: 0,
          }}
        >
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            style={{ color: 'hsl(263 100% 75%)', textDecoration: 'none', fontWeight: 600 }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  )
}

/* ─── Page with Suspense boundary ─────────────────────────────── */

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p style={{ color: 'hsl(220 15% 55%)' }}>Loading…</p>
        </main>
      }
    >
      <SignInForm />
    </Suspense>
  )
}
