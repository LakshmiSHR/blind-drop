'use client'

type Props = {
  songs: any[]
}

export default function ArtistDashboardClient({ songs }: Props) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'black',
        color: 'white',
        padding: '40px',
      }}
    >
      <h1>Artist Dashboard</h1>

      <p>Total Songs: {songs?.length || 0}</p>
    </div>
  )
}