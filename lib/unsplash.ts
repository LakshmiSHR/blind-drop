import 'server-only'

import { GENRE_UNSPLASH_QUERIES } from '@/types'

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80'

interface UnsplashPhoto {
  urls: {
    regular: string
    small: string
  }
  alt_description: string | null
  user: {
    name: string
    links: { html: string }
  }
}

/**
 * Fetch a genre-appropriate image from Unsplash.
 * Builds a query from GENRE_UNSPLASH_QUERIES + the first 2 tags.
 * Returns a hardcoded fallback URL on any error.
 */
export async function fetchUnsplashImage(
  genre: string,
  tags: string[] = []
): Promise<{ url: string; alt: string; credit: string; creditUrl: string }> {
  if (!UNSPLASH_ACCESS_KEY) {
    return {
      url: FALLBACK_IMAGE,
      alt: 'Abstract music visualization',
      credit: 'Unsplash',
      creditUrl: 'https://unsplash.com',
    }
  }

  const baseQuery = GENRE_UNSPLASH_QUERIES[genre] ?? GENRE_UNSPLASH_QUERIES['Other']
  const tagSuffix = tags.slice(0, 2).join(' ')
  const query = tagSuffix ? `${baseQuery} ${tagSuffix}` : baseQuery

  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
        query
      )}&orientation=landscape&content_filter=high`,
      {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) {
      console.error(`Unsplash API error: ${res.status}`)
      return {
        url: FALLBACK_IMAGE,
        alt: 'Abstract music visualization',
        credit: 'Unsplash',
        creditUrl: 'https://unsplash.com',
      }
    }

    const photo = (await res.json()) as UnsplashPhoto

    return {
      url: photo.urls.regular,
      alt: photo.alt_description ?? `${genre} music artwork`,
      credit: photo.user.name,
      creditUrl: photo.user.links.html,
    }
  } catch (error) {
    console.error('Unsplash fetch failed:', error)
    return {
      url: FALLBACK_IMAGE,
      alt: 'Abstract music visualization',
      credit: 'Unsplash',
      creditUrl: 'https://unsplash.com',
    }
  }
}
