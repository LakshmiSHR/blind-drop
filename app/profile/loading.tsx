export default function ProfileLoading() {
  return (
    <main
      style={{
        paddingTop: 88,
        paddingBottom: 60,
        minHeight: '100dvh',
        maxWidth: 800,
        margin: '0 auto',
        padding: '88px 24px 60px',
      }}
    >
      {/* Header */}
      <div
        className="glass"
        style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}
      >
        <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skeleton" style={{ height: 24, width: 160, borderRadius: 8 }} />
          <div className="skeleton" style={{ height: 14, width: 100, borderRadius: 6 }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass" style={{ padding: 20, textAlign: 'center' }}>
            <div className="skeleton" style={{ height: 28, width: 60, borderRadius: 8, margin: '0 auto 8px' }} />
            <div className="skeleton" style={{ height: 12, width: 80, borderRadius: 6, margin: '0 auto' }} />
          </div>
        ))}
      </div>

      {/* Rating rows */}
      <div className="skeleton" style={{ height: 18, width: 140, borderRadius: 6, marginBottom: 16 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="glass"
            style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}
          >
            <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 8, flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 6 }} />
              <div className="skeleton" style={{ height: 12, width: '35%', borderRadius: 6 }} />
            </div>
            <div className="skeleton" style={{ width: 40, height: 20, borderRadius: 6 }} />
          </div>
        ))}
      </div>
    </main>
  )
}
