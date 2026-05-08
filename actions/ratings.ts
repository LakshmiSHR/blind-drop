'use server'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function submitRating(
  songId: string,
  rating: number,
  userId: string
) {
  const { data, error } = await supabase
    .from('ratings')
    .insert({
      song_id: songId,
      rating,
      user_id: userId,
    })
    .select()
    .single()

  if (error) {
    console.log(error)

    return {
      success: false,
      error: error.message,
    }
  }

  return {
    success: true,
    data,
  }
}

export async function getUserRating(songId: string, userId: string) {
  const { data } = await supabase
    .from('ratings')
    .select('*')
    .eq('song_id', songId)
    .eq('user_id', userId)
    .single()

  return data
}