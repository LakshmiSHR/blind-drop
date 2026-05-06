'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/actions/profiles'
import { GlowButton } from '@/components/GlowButton/GlowButton'
import Link from 'next/link'
import type { ActionResult } from '@/types'

async function signUpAction(
  _prev: ActionResult<{ id: string }> | null,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  return signUp(formData)
}

export default function SignUpPage() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(signUpAction, null)
  const [confirmError, setConfirmError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    const password = formData.get('password') as string
    const confirm = formData.get('confirmPassword') as string

    if (password !== confirm) {
      setConfirmError('Passwords do not match')
      return
    }

    setConfirmError(null)
    formAction(formData)
  }

  // Redirect on success
  if (state?.success) {
    router.push('/signin?message=Account created. Please sign in.')
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
          Create Account
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
          Join Blind Drop and start discovering
        </p>

        <form
          action={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <label
            htmlFor="signup-username"
            style={{ fontSize: 13, fontWeight: 600, color: 'hsl(220 15% 55%)' }}
          >
            Username
          </label>
          <input
            id="signup-username"
            name="username"
            type="text"
            required
            minLength={3}
            maxLength={30}
            className="input"
            placeholder="your_alias"
          />

          <label
            htmlFor="signup-email"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'hsl(220 15% 55%)',
              marginTop: 4,
            }}
          >
            Email
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            required
            className="input"
            placeholder="you@example.com"
          />

          <label
            htmlFor="signup-password"
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
            id="signup-password"
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={72}
            className="input"
            placeholder="Min 8 characters"
          />

          <label
            htmlFor="signup-confirm"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'hsl(220 15% 55%)',
              marginTop: 4,
            }}
          >
            Confirm Password
          </label>
          <input
            id="signup-confirm"
            name="confirmPassword"
            type="password"
            required
            className="input"
            placeholder="Re-enter password"
          />

          {/* Client-side match error */}
          {confirmError && (
            <p style={{ color: 'hsl(0 70% 65%)', fontSize: 14, margin: 0 }}>
              {confirmError}
            </p>
          )}

          {/* Server-side Zod / DB error */}
          {state && !state.success && (
            <p style={{ color: 'hsl(0 70% 65%)', fontSize: 14, margin: 0 }}>
              {state.error}
            </p>
          )}

          <GlowButton type="submit" disabled={pending}>
            {pending ? 'Creating account…' : 'Create Account'}
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
          Already have an account?{' '}
          <Link
            href="/signin"
            style={{ color: 'hsl(263 100% 75%)', textDecoration: 'none', fontWeight: 600 }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  )
}
