import type { ReactElement } from 'react'
import styles from './ArtifactVisual.module.scss'

interface ArtifactVisualProps {
  fileName: string
}

function ArtifactVisual({ fileName }: ArtifactVisualProps): ReactElement {
  const dotIndex = fileName.lastIndexOf('.')
  const rawExt = dotIndex !== -1 ? fileName.slice(dotIndex + 1) : ''
  const ext = rawExt.toUpperCase() || 'FILE'

  return (
    <div className={styles.container} aria-hidden="true">
      <span className={styles.cornerTL} />
      <span className={styles.cornerTR} />
      <span className={styles.cornerBL} />
      <span className={styles.cornerBR} />
      <div className={styles.inner}>
        <span className={styles.fileExt}>[{ext}]</span>
        <span className={styles.binary}>01001010 10110100</span>
      </div>
    </div>
  )
}

export default ArtifactVisual
