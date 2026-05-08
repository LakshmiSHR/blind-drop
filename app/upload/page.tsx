import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { UploadForm } from './UploadForm'

export default async function UploadPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/artist/signin')
  }

  const supabase = createServiceClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role !== 'artist') {
    redirect('/')
  }

  return (
    <main
      style={{
        paddingTop: 100,
        maxWidth: 700,
        margin: '0 auto',
        color: 'white',
      }}
    >
      <h1>Upload Song</h1>

      <UploadForm />
    </main>
  )
}