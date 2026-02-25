import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import styles from './CountdownTimer.module.scss'

const TEN_MINUTES_MS = 10 * 60 * 1000

interface CountdownTimerProps {
  expiresAt: string // ISO 8601 UTC
  onExpire?: () => void // Callback disparado uma vez quando remaining chega a 0
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'T-00:00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `T-${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`
}

function CountdownTimer({ expiresAt, onExpire }: CountdownTimerProps): ReactElement {
  const expiresMs = useMemo(() => new Date(expiresAt).getTime(), [expiresAt])
  const initialRemainingRef = useRef(Math.max(0, expiresMs - Date.now()))
  const [remaining, setRemaining] = useState(() => Math.max(0, expiresMs - Date.now()))

  const hasExpiredRef = useRef(false)
  useEffect(() => {
    hasExpiredRef.current = false
  }, [expiresAt])

  useEffect(() => {
    initialRemainingRef.current = Math.max(0, expiresMs - Date.now())
    const id = setInterval(() => {
      setRemaining(Math.max(0, expiresMs - Date.now()))
    }, 1000)
    return () => clearInterval(id)
  }, [expiresMs])

  useEffect(() => {
    if (remaining === 0 && !hasExpiredRef.current) {
      hasExpiredRef.current = true
      onExpire?.()
    }
  }, [remaining, onExpire])

  const isUrgent = remaining > 0 && remaining < TEN_MINUTES_MS
  const progressPct =
    initialRemainingRef.current > 0
      ? Math.max(0, (remaining / initialRemainingRef.current) * 100)
      : 0
  const label = formatCountdown(remaining)

  const displayClass = [styles.display, isUrgent && styles.urgent].filter(Boolean).join(' ')
  const fillClass = [styles.progressFill, isUrgent && styles.progressUrgent].filter(Boolean).join(' ')

  return (
    <div
      className={styles.container}
      role="timer"
      aria-label={`Tempo restante: ${label}`}
      aria-live="off"
    >
      <p className={styles.label}>EXPIRATION_SEQUENCE</p>
      <p className={displayClass} data-urgent={isUrgent}>
        {label}
      </p>
      <div className={styles.progressBar} aria-hidden="true">
        <div className={fillClass} style={{ width: `${progressPct}%` }} />
      </div>
    </div>
  )
}

export default CountdownTimer
