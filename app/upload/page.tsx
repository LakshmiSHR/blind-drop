import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { UploadForm } from './UploadForm'

export const metadata = { title: 'Upload' }

export default async function UploadPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/signin')

  const role = session.user.role
  if (role !== 'artist' && role !== 'admin') redirect('/signin')

  return (
    <main
      style={{
        paddingTop: 88,
        paddingBottom: 60,
        minHeight: '100dvh',
        maxWidth: 680,
        margin: '0 auto',
        padding: '88px 24px 60px',
      }}
    >
      <h1
        className="gradient-text"
        style={{ fontSize: 32, fontWeight: 800, margin: '0 0 32px', textAlign: 'center' }}
      >
        Upload a Track
      </h1>
      <UploadForm />
    </main>
  )
}
