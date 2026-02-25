import type { ReactElement } from 'react'
import styles from './TerminalHeader.module.scss'

function TerminalHeader(): ReactElement {
  return (
    <header className={styles.header}>
      <span className={styles.title}>// RASPBERRY_PI_GATEWAY</span>
    </header>
  )
}

export default TerminalHeader
