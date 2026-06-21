// Neutral A/B entry. Picks which presentation of the SAME app to load:
//   Version A — "KPMG editorial" facelift (deep navy, Fraunces serif)
//   Version B — "Instrument" (our current cyan-on-near-black build)
// Both share one engine, store, data and content; only the skin differs.
export function Chooser({ onPick }: { onPick: (v: 'a' | 'b') => void }) {
  return (
    <div
      style={{
        minHeight: '100vh', background: 'radial-gradient(ellipse at 50% -10%, #0b1430 0%, #06080f 60%)',
        color: '#e9ebef', fontFamily: "'Inter', system-ui, sans-serif", display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '40px 24px', gap: 36,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 640 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: '#19c2db', marginBottom: 14 }}>
          AI Deal Operations
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.8, margin: 0, color: '#fff' }}>Choose your experience</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22, width: '100%', maxWidth: 760 }}>
        {/* Version A */}
        <button onClick={() => onPick('a')} style={cardStyle('#1E3460')}
          onMouseEnter={(e) => hover(e, true, '#00A3E0')} onMouseLeave={(e) => hover(e, false, '#1E3460')}>
          <div style={{ height: 116, borderRadius: 10, marginBottom: 18, background: 'linear-gradient(135deg, #060E1A 0%, #0F2040 100%)', border: '1px solid #1E3460', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 16, top: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: 3, color: '#00A3E0' }}>◆ PLATFORM</div>
            <div style={{ position: 'absolute', left: 16, top: 38, fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: -0.5 }}>1,750<span style={{ fontSize: 13, color: '#8BA3C7' }}>bn</span></div>
            <div style={{ position: 'absolute', right: 14, bottom: 14, display: 'flex', gap: 5 }}>
              {['#00A651', '#F59E0B', '#0091DA'].map((c) => <span key={c} style={{ width: 24, height: 6, borderRadius: 3, background: c }} />)}
            </div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: '#00A3E0', marginBottom: 8 }}>VERSION A</div>
          <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: -0.4 }}>KPMG Editorial</div>
        </button>

        {/* Version B */}
        <button onClick={() => onPick('b')} style={cardStyle('#242a3a')}
          onMouseEnter={(e) => hover(e, true, '#19c2db')} onMouseLeave={(e) => hover(e, false, '#242a3a')}>
          <div style={{ height: 116, borderRadius: 10, marginBottom: 18, background: 'linear-gradient(135deg, #090a11 0%, #12151f 100%)', border: '1px solid #242a3a', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 16, top: 16, fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: 3, color: '#19c2db' }}>◇ THE INSTRUMENT</div>
            <div style={{ position: 'absolute', left: 16, top: 38, fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: -0.5 }}>1,750<span style={{ fontSize: 13, color: '#6c7480' }}>bn</span></div>
            <div style={{ position: 'absolute', right: 14, bottom: 14, width: 40, height: 40, borderRadius: 20, border: '2px solid #19c2db', borderTopColor: 'transparent', transform: 'rotate(45deg)' }} />
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 2, color: '#19c2db', marginBottom: 8 }}>VERSION B</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: -0.4 }}>The Instrument</div>
        </button>
      </div>
    </div>
  )
}

function cardStyle(border: string): React.CSSProperties {
  return {
    textAlign: 'left', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', border: `1px solid ${border}`,
    borderRadius: 16, padding: 20, transition: 'all 0.18s', color: 'inherit',
  }
}
function hover(e: React.MouseEvent<HTMLButtonElement>, on: boolean, color: string) {
  e.currentTarget.style.borderColor = color
  e.currentTarget.style.transform = on ? 'translateY(-3px)' : 'translateY(0)'
  e.currentTarget.style.boxShadow = on ? '0 16px 40px rgba(0,0,0,0.4)' : 'none'
}
