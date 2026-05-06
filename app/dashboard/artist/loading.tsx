export default function ArtistDashboardLoading() {
  return (
    <main
      style={{
        paddingTop: 88,
        paddingBottom: 60,
        minHeight: '100dvh',
        maxWidth: 1100,
        margin: '0 auto',
        padding: '88px 24px 60px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
        }}
      >
        <div className="skeleton" style={{ height: 28, width: 200, borderRadius: 8 }} />
        <div className="skeleton" style={{ height: 40, width: 160, borderRadius: 12 }} />
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass" style={{ padding: 20, textAlign: 'center' }}>
            <div className="skeleton" style={{ height: 28, width: 60, borderRadius: 8, margin: '0 auto 8px' }} />
            <div className="skeleton" style={{ height: 12, width: 80, borderRadius: 6, margin: '0 auto' }} />
          </div>
        ))}
      </div>

      {/* Table rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Header row */}
        <div style={{ display: 'flex', gap: 12, padding: '8px 12px' }}>
          {[120, 100, 70, 60, 50, 80, 100].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: 12, width: w, borderRadius: 4 }} />
          ))}
        </div>
        {/* Data rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="glass"
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}
          >
            <div className="skeleton" style={{ height: 16, width: 120, borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 14, width: 100, borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 22, width: 60, borderRadius: 'var(--radius-pill)' }} />
            <div className="skeleton" style={{ height: 14, width: 40, borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 14, width: 40, borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 'var(--radius-pill)' }} />
            <div className="skeleton" style={{ height: 28, width: 100, borderRadius: 6 }} />
          </div>
        ))}
      </div>
    </main>
  )
}
