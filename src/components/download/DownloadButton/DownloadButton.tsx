import { useEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import styles from './DownloadButton.module.scss'

type ButtonState = 'idle' | 'loading' | 'complete'

interface DownloadButtonProps {
  downloadUrl: string
  fileName: string
  disabled?: boolean
}

const LABELS: Record<ButtonState, string> = {
  idle: '[ EXECUTE_DOWNLOAD ]',
  loading: 'INITIATING_TRANSFER...',
  complete: 'TRANSFER_COMPLETE',
}

function DownloadButton({ downloadUrl, fileName, disabled = false }: DownloadButtonProps): ReactElement {
  const [state, setState] = useState<ButtonState>('idle')
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout)
  }, [])

  function handleDownload(): void {
    if (disabled || state !== 'idle') return

    setState('loading')

    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    timersRef.current.push(
      setTimeout(() => {
        setState('complete')
        timersRef.current.push(setTimeout(() => setState('idle'), 3000))
      }, 500),
    )
  }

  const className = [styles.button, styles[state], disabled && styles.disabled].filter(Boolean).join(' ')

  return (
    <button
      className={className}
      onClick={handleDownload}
      disabled={disabled || state !== 'idle'}
      aria-busy={state === 'loading'}
      type="button"
    >
      {LABELS[state]}
    </button>
  )
}

export default DownloadButton
