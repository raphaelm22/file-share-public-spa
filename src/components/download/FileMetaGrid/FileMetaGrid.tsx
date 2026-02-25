import type { ReactElement } from 'react'
import styles from './FileMetaGrid.module.scss'
import { formatFileSize } from '../../../utils/formatFileSize'
import { getMimeType } from '../../../utils/getMimeType'

interface FileMetaGridProps {
  fileSize: number
  fileName: string
}

function FileMetaGrid({ fileSize, fileName }: FileMetaGridProps): ReactElement {
  return (
    <dl className={styles.grid}>
      <div className={styles.row}>
        <dt className={styles.label}>SIZE_ON_DISK</dt>
        <dd className={styles.value}>{formatFileSize(fileSize)}</dd>
      </div>
      <div className={styles.row}>
        <dt className={styles.label}>MIME_TYPE</dt>
        <dd className={styles.value}>{getMimeType(fileName)}</dd>
      </div>
    </dl>
  )
}

export default FileMetaGrid
