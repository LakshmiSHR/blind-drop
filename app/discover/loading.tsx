export default function DiscoverLoading() {
  return (
    <main style={{ paddingTop: 88, paddingBottom: 60, minHeight: '100dvh' }}>
      {/* Genre pills skeleton */}
      <div style={{ display: 'flex', gap: 8, padding: '0 24px 24px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ width: 72, height: 34, borderRadius: 'var(--radius-pill)' }}
          />
        ))}
      </div>

      {/* Card grid skeleton */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
          padding: '0 24px',
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="glass"
            style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            <div
              className="skeleton"
              style={{ width: '100%', paddingTop: '60%', borderRadius: 0 }}
            />
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="skeleton" style={{ height: 18, width: '70%', borderRadius: 6 }} />
              <div className="skeleton" style={{ height: 14, width: '45%', borderRadius: 6 }} />
              <div className="skeleton" style={{ height: 3, width: '100%', borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
