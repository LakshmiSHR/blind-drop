'use client'

import { useState } from 'react'

export default function ArtistSignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch('/api/artist-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })

   const data = await res.json()

alert(data.message)

window.location.href = '/artist/signin'
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
        onSubmit={handleSignup}
        style={{
          width: 350,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <h1>Artist Signup</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 8,
            border: '1px solid gray',
          }}
          required
        />

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
          Create Artist Account
        </button>
      </form>
    </main>
  )
}