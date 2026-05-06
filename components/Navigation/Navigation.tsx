'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { GlowButton } from '@/components/GlowButton/GlowButton'
import type { Session } from 'next-auth'

interface NavigationProps {
  session: Session | null
}

export function Navigation({ session }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="glass"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: scrolled ? 'blur(28px) saturate(2)' : undefined,
        borderBottom: '1px solid hsl(263 50% 25% / 0.3)',
        transition: 'backdrop-filter 0.3s ease',
      }}
    >
      {/* Left — Logo */}
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, hsl(263 100% 67%), hsl(174 70% 52%))',
          }}
        />
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'hsl(0 0% 91%)',
            letterSpacing: '-0.02em',
          }}
        >
          Blind Drop
        </span>
      </Link>

      {/* Center — Links (desktop) */}
      <div
        style={{
          display: 'flex',
          gap: 32,
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        className="nav-center"
      >
        <Link
          href="/discover"
          style={{
            color: 'hsl(220 15% 55%)',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'hsl(0 0% 91%)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'hsl(220 15% 55%)')}
        >
          Discover
        </Link>
        <Link
          href="/artists"
          style={{
            color: 'hsl(220 15% 55%)',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'hsl(0 0% 91%)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'hsl(220 15% 55%)')}
        >
          Artists
        </Link>
      </div>

      {/* Right — Auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!session ? (
          <GlowButton size="sm" href="/signin">
            Sign In
          </GlowButton>
        ) : (
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt=""
                  width={32}
                  height={32}
                  style={{ borderRadius: '50%' }}
                />
              ) : (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'hsl(263 100% 67% / 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'hsl(263 100% 80%)',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {session.user?.name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
            </button>

            {dropdownOpen && (
              <div
                className="glass"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 44,
                  width: 200,
                  padding: 8,
                  borderRadius: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  style={dropdownLinkStyle}
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard/user"
                  onClick={() => setDropdownOpen(false)}
                  style={dropdownLinkStyle}
                >
                  Dashboard
                </Link>
                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid hsl(263 50% 25% / 0.3)',
                    margin: '4px 0',
                  }}
                />
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{
                    ...dropdownLinkStyle,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    color: 'hsl(0 70% 65%)',
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="nav-hamburger"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'hsl(0 0% 91%)',
            fontSize: 24,
            padding: 4,
          }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile slide-down */}
      {mobileOpen && (
        <div
          className="glass"
          style={{
            position: 'absolute',
            top: 64,
            left: 0,
            right: 0,
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            borderTop: '1px solid hsl(263 50% 25% / 0.3)',
          }}
        >
          <Link
            href="/discover"
            onClick={() => setMobileOpen(false)}
            style={mobileLinkStyle}
          >
            Discover
          </Link>
          <Link
            href="/artists"
            onClick={() => setMobileOpen(false)}
            style={mobileLinkStyle}
          >
            Artists
          </Link>
          {!session && (
            <GlowButton size="sm" href="/signin">
              Sign In
            </GlowButton>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-center { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

const dropdownLinkStyle: React.CSSProperties = {
  display: 'block',
  padding: '8px 12px',
  borderRadius: 8,
  color: 'hsl(0 0% 91%)',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 500,
  transition: 'background 0.15s',
}

const mobileLinkStyle: React.CSSProperties = {
  color: 'hsl(0 0% 91%)',
  textDecoration: 'none',
  fontSize: 16,
  fontWeight: 500,
  padding: '8px 0',
}
