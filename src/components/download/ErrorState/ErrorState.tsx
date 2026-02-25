import { useEffect, useRef, type ReactElement } from 'react'
import styles from './ErrorState.module.scss'

type ErrorVariant = 'expired' | 'not-found' | 'denied'

interface ErrorStateProps {
  variant: ErrorVariant
}

const CONTENT: Record<ErrorVariant, { title: string; subtitle: string; description: string; visual: string }> = {
  expired: {
    title: 'LINK_EXPIRED',
    subtitle: '// TOKEN_REVOKED',
    description: 'O link de compartilhamento atingiu seu prazo de validade.',
    visual: 'T-00:00:00',
  },
  'not-found': {
    title: 'TARGET_NOT_FOUND',
    subtitle: '// ASSET_REMOVED',
    description: 'O arquivo associado a este link foi removido do servidor.',
    visual: '[FILE]',
  },
  denied: {
    title: 'ACCESS_DENIED',
    subtitle: '// INVALID_TOKEN',
    description: 'Token inválido ou inexistente. Solicite um novo link.',
    visual: '//',
  },
}

function ErrorState({ variant }: ErrorStateProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  const { title, subtitle, description, visual } = CONTENT[variant]
  const visualClass = variant === 'not-found'
    ? `${styles.visual} ${styles.visualGlitch}`
    : styles.visual

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      role="alert"
      aria-live="assertive"
      className={styles.container}
    >
      <div className={visualClass} aria-hidden="true">
        {visual}
      </div>
      <p className={styles.errorCode}>{title}</p>
      <p className={styles.subCode}>{subtitle}</p>
      <p className={styles.description}>{description}</p>
    </div>
  )
}

export default ErrorState
