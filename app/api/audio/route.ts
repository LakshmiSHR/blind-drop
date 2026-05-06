import 'server-only'

import { auth } from '@/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const BodySchema = z.object({
  audioPath: z.string().min(1, 'Audio path is required'),
})

export async function POST(request: Request) {
  // Auth check
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Validate body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  // Generate signed URL (1 hour expiry)
  const supabase = createServiceClient()
  const { data, error } = await supabase.storage
    .from('audio')
    .createSignedUrl(parsed.data.audioPath, 3600)

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: error?.message ?? 'Failed to generate signed URL' },
      { status: 500 }
    )
  }

  return NextResponse.json({ signedUrl: data.signedUrl })
}
