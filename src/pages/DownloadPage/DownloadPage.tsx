import { useEffect, useState, type ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import styles from './DownloadPage.module.scss'
import TerminalHeader from '../../components/primitives/TerminalHeader/TerminalHeader'
import ArtifactVisual from '../../components/download/ArtifactVisual/ArtifactVisual'
import FileMetaGrid from '../../components/download/FileMetaGrid/FileMetaGrid'
import CountdownTimer from '../../components/download/CountdownTimer/CountdownTimer'
import DownloadButton from '../../components/download/DownloadButton/DownloadButton'
import ErrorState from '../../components/download/ErrorState/ErrorState'
import { getShareInfo, getDownloadFileUrl } from '../../api'
import type { ShareInfo } from '../../types'

type ErrorVariant = 'expired' | 'not-found' | 'denied'

function getErrorVariant(code: string): ErrorVariant {
  if (code === 'SHARE_EXPIRED_OR_INVALID') return 'expired'
  if (code === 'FILE_NOT_FOUND') return 'not-found'
  return 'denied' // TOKEN_NOT_FOUND, UNKNOWN_ERROR, INVALID_ROUTE, etc.
}

function DownloadPage(): ReactElement {
  const { token } = useParams<{ token: string }>()
  const [shareInfo, setShareInfo] = useState<ShareInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setError('INVALID_ROUTE')
      setLoading(false)
      return
    }

    const controller = new AbortController()
    getShareInfo(token, controller.signal)
      .then(setShareInfo)
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [token])

  function handleTimerExpire() {
    setError('SHARE_EXPIRED_OR_INVALID')
  }

  function renderContent(): ReactElement {
    if (error) {
      return (
        <main className={styles.state}>
          <ErrorState variant={getErrorVariant(error)} />
        </main>
      )
    }

    if (loading || !shareInfo) {
      return (
        <main className={styles.state} aria-busy="true">
          <p className={styles.loadingText}>
            {'// LOADING_MANIFEST...'}<span className={`${styles.cursor} allowBlink`}>▋</span>
          </p>
        </main>
      )
    }

    const { fileName, fileSize, expiresAt } = shareInfo

    return (
      <main className={styles.content}>
        <div className={styles.layout}>
          <div className={styles.artifactSection}>
            <ArtifactVisual fileName={fileName} />
          </div>
          <section className={styles.detailsSection}>
            <h1 className={styles.fileName}>{fileName}</h1>
            <FileMetaGrid fileSize={fileSize} fileName={fileName} />
            {expiresAt !== null && (
              <CountdownTimer
                expiresAt={expiresAt}
                onExpire={handleTimerExpire}
              />
            )}
            <DownloadButton
              downloadUrl={getDownloadFileUrl(token!)}
              fileName={fileName}
            />
          </section>
        </div>
      </main>
    )
  }

  return (
    <div className={styles.page}>
      <TerminalHeader />
      {renderContent()}
    </div>
  )
}

export default DownloadPage
