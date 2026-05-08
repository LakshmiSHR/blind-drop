'use client'

import { useState } from 'react'

export default function ArtistSigninPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSignin(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch('/api/artist-signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    const data = await res.json()

    alert(data.message)

    if (res.ok) {
      window.location.href = '/upload'
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
      }}
    >
      <form
        onSubmit={handleSignin}
        style={{
          width: 350,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <h1>Artist Signin</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 8,
            border: '1px solid gray',
          }}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 8,
            border: '1px solid gray',
          }}
          required
        />

        <button
          type="submit"
          style={{
            padding: 12,
            background: 'purple',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Sign In
        </button>

        <p style={{ textAlign: 'center' }}>
          Don’t have an account?{' '}
          <a
            href="/artist/signup"
            style={{
              color: '#a855f7',
            }}
          >
            Signup
          </a>
        </p>
      </form>
    </main>
  )
}