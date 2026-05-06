export default function ListenLoading() {
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
        {/* Left column */}
        <div className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            className="skeleton"
            style={{ width: '100%', maxWidth: 400, aspectRatio: '1', borderRadius: 'var(--radius-lg)', margin: '0 auto' }}
          />
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div className="skeleton" style={{ height: 28, width: 200, borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 14, width: 120, borderRadius: 6 }} />
          </div>
          {/* Waveform placeholder */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2, height: 64 }}>
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{
                  width: 4,
                  height: Math.sin(i * 0.7) * 24 + 28,
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
            <div className="skeleton" style={{ width: 52, height: 52, borderRadius: '50%' }} />
            <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Fingerprint */}
          <div className="glass" style={{ padding: 24 }}>
            <div className="skeleton" style={{ height: 16, width: 140, borderRadius: 6, marginBottom: 20 }} />
            <div style={{ display: 'flex', justifyContent: 'space-around', height: 140, gap: 8 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
                  <div className="skeleton" style={{ height: 14, width: 28, borderRadius: 4 }} />
                  <div className="skeleton" style={{ width: '100%', maxWidth: 32, height: 80, borderRadius: 6 }} />
                  <div className="skeleton" style={{ height: 10, width: 36, borderRadius: 4 }} />
                </div>
              ))}
            </div>
          </div>
          {/* Rating */}
          <div className="glass" style={{ padding: 24 }}>
            <div className="skeleton" style={{ height: 16, width: 120, borderRadius: 6, marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ width: 40, height: 40, borderRadius: 10 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
