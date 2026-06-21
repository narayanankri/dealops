import { TopBarA } from './TopBarA'
import { T } from './theme'

export function PipelineA() {
  return (
    <>
      <TopBarA title="PipelineA" subtitle="Version A — coming up" />
      <div style={{ padding: 32, color: T.muted }}>Stub: PipelineA</div>
    </>
  )
}
