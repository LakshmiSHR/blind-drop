'use client'

import { useState } from 'react'
import { submitRating } from '@/actions/ratings'

interface RatingSliderProps {
  songId: string
  existingRating: number | null
  onReveal: (data: { isRevealed: boolean; avgRating: number; ratingCount: number }) => void
}

const ratingColors: Record<number, string> = {
  1: 'hsl(213 100% 65%)',
  2: 'hsl(213 100% 65%)',
  3: 'hsl(142 70% 45%)',
  4: 'hsl(142 70% 45%)',
  5: 'hsl(45 100% 55%)',
  6: 'hsl(45 100% 55%)',
  7: 'hsl(20 100% 60%)',
  8: 'hsl(20 100% 60%)',
  9: 'hsl(0 80% 60%)',
  10: 'hsl(0 80% 60%)',
}

export function RatingSlider({ songId, existingRating, onReveal }: RatingSliderProps) {
  const [selected, setSelected] = useState<number | null>(existingRating)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(existingRating !== null)

  async function handleRate(value: number) {
    if (submitted) return

    // Optimistic
    setSelected(value)
    setError(null)
    setSubmitting(true)

    const result = await submitRating(songId, value)

    if (result.success) {
      setSubmitted(true)
      if (result.data.isRevealed) {
        onReveal(result.data)
      }
    } else {
      setError(result.error)
      setSelected(existingRating) // reset
    }

    setSubmitting(false)
  }

  return (
    <div className="glass" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>
        {submitted ? `You rated: ${selected}/10` : 'Rate this track'}
      </h3>

      <div
        style={{
          display: 'flex',
          gap: 6,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const isSelected = selected === n
          const color = ratingColors[n]

          return (
            <button
              key={n}
              type="button"
              disabled={submitted || submitting}
              onClick={() => handleRate(n)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                border: isSelected
                  ? `2px solid ${color}`
                  : '1px solid hsl(263 50% 25% / 0.4)',
                background: isSelected ? `${color}33` : 'hsl(220 20% 10%)',
                color: isSelected ? color : 'hsl(220 15% 55%)',
                fontSize: 15,
                fontWeight: 700,
                cursor: submitted ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
                transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                boxShadow: isSelected ? `0 0 12px ${color}66` : 'none',
              }}
              onMouseEnter={(e) => {
                if (!submitted) e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                if (!submitted)
                  e.currentTarget.style.transform = isSelected ? 'scale(1.2)' : 'scale(1)'
              }}
            >
              {n}
            </button>
          )
        })}
      </div>

      {error && (
        <p style={{ color: 'hsl(0 70% 65%)', fontSize: 13, marginTop: 12, textAlign: 'center' }}>
          {error}
        </p>
      )}
    </div>
  )
}
