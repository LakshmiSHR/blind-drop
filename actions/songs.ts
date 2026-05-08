'use server'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function createSong(formData: FormData) {
  try {
    const title = formData.get('title') as string
    const alias = formData.get('alias') as string
    const genre = formData.get('genre') as string
    const audio = formData.get('audio') as File

    if (!audio) {
      return {
        success: false,
        error: 'No audio file',
      }
    }

    const fileName = `${Date.now()}-${audio.name}`

    const arrayBuffer = await audio.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('songs')
      .upload(fileName, buffer, {
        contentType: audio.type,
      })

    if (uploadError) {
      console.log(uploadError)

      return {
        success: false,
        error: uploadError.message,
      }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('songs').getPublicUrl(fileName)

    const { data, error } = await supabase
      .from('songs')
      .insert({
        title,
        alias,
        genre,
        audio_url: publicUrl,
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
  } catch (err) {
    console.log(err)

    return {
      success: false,
      error: 'Upload failed',
    }
  }
}

export async function getSongs() {
  const { data, error } = await supabase
    .from('songs')
    .select('*')

  if (error) {
    return {
      success: false,
      data: [],
    }
  }

  return {
    success: true,
    data,
  }
}

export async function getSongById(id: string) {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return {
      success: false,
      data: null,
    }
  }

  return {
    success: true,
    data,
  }
}