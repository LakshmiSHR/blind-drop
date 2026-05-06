'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

interface AudioPlayerProps {
  audioPath: string
  durationMs?: number
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export function AudioPlayer({ audioPath }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch signed URL
  useEffect(() => {
    async function loadAudio() {
      try {
        const res = await fetch('/api/audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioPath }),
        })
        if (!res.ok) throw new Error('Failed to load audio')
        const { signedUrl } = await res.json()
        setSrc(signedUrl)
      } catch {
        setError('Audio unavailable')
      } finally {
        setLoading(false)
      }
    }
    loadAudio()
  }, [audioPath])

  // Audio element event binding
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !src) return

    audio.src = src
    audio.volume = volume

    const onLoaded = () => setDuration(audio.duration)
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onEnded = () => setIsPlaying(false)
    const onError = () => setError('Audio playback error')

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [src, volume])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audio.currentTime = ratio * duration
  }, [duration])

  const skip = useCallback((seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration))
  }, [duration])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const BAR_COUNT = 40

  if (error) {
    return (
      <div
        className="glass"
        style={{
          padding: 24,
          textAlign: 'center',
          color: 'hsl(0 70% 65%)',
          fontSize: 14,
        }}
      >
        {error}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <audio ref={audioRef} preload="metadata" />

      {/* Waveform visualizer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 2,
          height: 64,
          cursor: 'pointer',
        }}
        onClick={seek}
      >
        {Array.from({ length: BAR_COUNT }).map((_, i) => {
          const barProgress = (i / BAR_COUNT) * 100
          const isPast = barProgress < progress
          const h = Math.sin(i * 0.7) * 24 + 28
          return (
            <div
              key={i}
              style={{
                width: 4,
                height: h,
                borderRadius: 2,
                background: isPast
                  ? 'hsl(263 100% 67%)'
                  : 'hsl(220 15% 25%)',
                transition: 'background 0.15s',
                animation: isPlaying
                  ? `waveform ${1.2 + (i % 5) * 0.2}s ease-in-out infinite`
                  : 'none',
                animationDelay: `${i * 0.05}s`,
              }}
            />
          )
        })}
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        {/* Rewind */}
        <button
          type="button"
          onClick={() => skip(-10)}
          style={controlBtnStyle}
          aria-label="Rewind 10 seconds"
        >
          ⏪
        </button>

        {/* Play/Pause */}
        <button
          type="button"
          onClick={togglePlay}
          disabled={loading}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'hsl(263 100% 67%)',
            border: 'none',
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            color: 'white',
            boxShadow: '0 0 20px hsl(263 100% 67% / 0.4)',
            transition: 'transform 0.15s',
          }}
        >
          {loading ? '…' : isPlaying ? '⏸' : '▶'}
        </button>

        {/* Forward */}
        <button
          type="button"
          onClick={() => skip(10)}
          style={controlBtnStyle}
          aria-label="Forward 10 seconds"
        >
          ⏩
        </button>
      </div>

      {/* Seek bar */}
      <div
        onClick={seek}
        style={{
          height: 4,
          borderRadius: 2,
          background: 'hsl(220 15% 20%)',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'hsl(263 100% 67%)',
            borderRadius: 2,
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      {/* Time + Volume */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          color: 'hsl(220 15% 55%)',
        }}
      >
        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>🔊</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value)
              setVolume(v)
              if (audioRef.current) audioRef.current.volume = v
            }}
            style={{ width: 80, accentColor: 'hsl(263 100% 67%)' }}
          />
        </div>
      </div>
    </div>
  )
}

const controlBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 18,
  color: 'hsl(220 15% 55%)',
  padding: 8,
  transition: 'color 0.15s',
}
