import { TopBarA } from './TopBarA'
import { T } from './theme'

export function MandateA() {
  return (
    <>
      <TopBarA title="MandateA" subtitle="Version A — coming up" />
      <div style={{ padding: 32, color: T.muted }}>Stub: MandateA</div>
    </>
  )
}
