import { auth } from '@/auth'
import { NextResponse } from 'next/server'

/* ─── Protected Route Groups ────────────────────────────────── */

/** Routes that require the 'artist' or 'admin' role */
const ARTIST_ROUTES = ['/upload', '/dashboard/artist']

/** Routes that require any authenticated session */
const AUTH_ROUTES = ['/dashboard/user', '/profile', '/wrapped']

/* ─── Middleware ─────────────────────────────────────────────── */

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Artist / admin-only routes
  const isArtistRoute = ARTIST_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  if (isArtistRoute) {
    const role = session?.user?.role
    if (role !== 'artist' && role !== 'admin') {
      const signInUrl = new URL('/signin', req.url)
      return NextResponse.redirect(signInUrl)
    }
    return NextResponse.next()
  }

  // Authenticated-only routes
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  if (isAuthRoute) {
    if (!session?.user) {
      const signInUrl = new URL('/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
})

/* ─── Matcher ────────────────────────────────────────────────── */

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)'],
}
