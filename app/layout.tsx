import type { Metadata } from 'next'
import { auth } from '@/auth'
import { Navigation } from '@/components/Navigation/Navigation'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s · Blind Drop',
    default: 'Blind Drop — Hear it first. Judge it honestly.',
  },
  description:
    'Artists upload anonymously. You rate on sound alone. The truth is revealed on the first rating.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Navigation session={session} />
        {children}
      </body>
    </html>
  )
}
