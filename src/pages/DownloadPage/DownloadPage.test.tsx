import { render, screen, waitFor, act } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import DownloadPage from './DownloadPage'
import * as api from '../../api'

vi.mock('../../api')

const mockShareInfo = {
  fileName: 'document.pdf',
  fileSize: 1048576,
  expiresAt: null,
  createdAt: '2026-01-01T00:00:00Z',
}

const mockShareInfoWithExpiry = {
  fileName: 'document.pdf',
  fileSize: 1048576,
  expiresAt: new Date(Date.now() + 3600000).toISOString(),
  createdAt: '2026-01-01T00:00:00Z',
}

function renderWithRoute(token = 'testtoken123') {
  return render(
    <MemoryRouter initialEntries={[`/dl/${token}`]}>
      <Routes>
        <Route path="/dl/:token" element={<DownloadPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('DownloadPage', () => {
  beforeEach(() => {
    vi.mocked(api.getDownloadFileUrl).mockReturnValue('/dl/testtoken123/file')
  })

  it('exibe estado de loading inicialmente', () => {
    // Arrange
    vi.mocked(api.getShareInfo).mockReturnValue(new Promise(() => {}))

    // Act
    renderWithRoute()

    // Assert
    expect(screen.getByText(/LOADING_MANIFEST/)).toBeInTheDocument()
  })

  it('TerminalHeader presente durante loading', () => {
    // Arrange
    vi.mocked(api.getShareInfo).mockReturnValue(new Promise(() => {}))

    // Act
    renderWithRoute()

    // Assert
    expect(screen.getByText('// RASPBERRY_PI_GATEWAY')).toBeInTheDocument()
  })

  it('exibe o nome do arquivo após carregamento com sucesso', async () => {
    // Arrange
    vi.mocked(api.getShareInfo).mockResolvedValue(mockShareInfo)

    // Act
    renderWithRoute()

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'document.pdf' })).toBeInTheDocument()
    })
  })

  it('exibe FileMetaGrid após carregamento com sucesso', async () => {
    // Arrange
    vi.mocked(api.getShareInfo).mockResolvedValue(mockShareInfo)

    // Act
    renderWithRoute()

    // Assert
    await waitFor(() => {
      expect(screen.getByText('SIZE_ON_DISK')).toBeInTheDocument()
      expect(screen.getByText('MIME_TYPE')).toBeInTheDocument()
    })
  })

  it('exibe ErrorState denied quando a API retorna TOKEN_NOT_FOUND (AC: 3)', async () => {
    // Arrange
    vi.mocked(api.getShareInfo).mockRejectedValue(new Error('TOKEN_NOT_FOUND'))

    // Act
    renderWithRoute()

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('ACCESS_DENIED')).toBeInTheDocument()
      expect(screen.getByText('// INVALID_TOKEN')).toBeInTheDocument()
    })
  })

  it('exibe ErrorState expired quando a API retorna SHARE_EXPIRED_OR_INVALID (AC: 1)', async () => {
    // Arrange
    vi.mocked(api.getShareInfo).mockRejectedValue(new Error('SHARE_EXPIRED_OR_INVALID'))

    // Act
    renderWithRoute()

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('LINK_EXPIRED')).toBeInTheDocument()
      expect(screen.getByText('// TOKEN_REVOKED')).toBeInTheDocument()
    })
  })

  it('exibe ErrorState not-found quando a API retorna FILE_NOT_FOUND (AC: 2)', async () => {
    // Arrange
    vi.mocked(api.getShareInfo).mockRejectedValue(new Error('FILE_NOT_FOUND'))

    // Act
    renderWithRoute()

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('TARGET_NOT_FOUND')).toBeInTheDocument()
      expect(screen.getByText('// ASSET_REMOVED')).toBeInTheDocument()
    })
  })

  it('exibe ErrorState denied para erro genérico desconhecido (AC: 3)', async () => {
    // Arrange
    vi.mocked(api.getShareInfo).mockRejectedValue(new Error('UNKNOWN_ERROR'))

    // Act
    renderWithRoute()

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('ACCESS_DENIED')).toBeInTheDocument()
    })
  })

  it('TerminalHeader presente após carregamento com sucesso', async () => {
    // Arrange
    vi.mocked(api.getShareInfo).mockResolvedValue(mockShareInfo)

    // Act
    renderWithRoute()

    // Assert
    await waitFor(() => {
      expect(screen.getByText('// RASPBERRY_PI_GATEWAY')).toBeInTheDocument()
    })
  })

  it('exibe tamanho formatado em MB', async () => {
    // Arrange
    vi.mocked(api.getShareInfo).mockResolvedValue(mockShareInfo)

    // Act
    renderWithRoute()

    // Assert
    await waitFor(() => {
      expect(screen.getByText('1.0 MB')).toBeInTheDocument()
    })
  })

  it('exibe DownloadButton após carregamento com sucesso', async () => {
    // Arrange
    vi.mocked(api.getShareInfo).mockResolvedValue(mockShareInfo)

    // Act
    renderWithRoute()

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '[ EXECUTE_DOWNLOAD ]' })).toBeInTheDocument()
    })
  })

  it('exibe CountdownTimer quando expiresAt não é null', async () => {
    // Arrange
    vi.mocked(api.getShareInfo).mockResolvedValue(mockShareInfoWithExpiry)

    // Act
    renderWithRoute()

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('timer')).toBeInTheDocument()
    })
  })

  it('NÃO exibe CountdownTimer quando expiresAt é null', async () => {
    // Arrange
    vi.mocked(api.getShareInfo).mockResolvedValue(mockShareInfo)

    // Act
    renderWithRoute()

    // Assert
    await waitFor(() => {
      expect(screen.queryByRole('timer')).not.toBeInTheDocument()
    })
  })

  it('não crasha e não exibe erro quando AbortError é lançado (StrictMode double-mount)', async () => {
    // Arrange
    const abortError = new Error('Aborted')
    abortError.name = 'AbortError'
    vi.mocked(api.getShareInfo).mockRejectedValue(abortError)

    // Act
    renderWithRoute()
    await act(async () => {})

    // Assert
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText(/LOADING_MANIFEST/)).toBeInTheDocument()
  })

  it('não crasha quando getShareInfo resolve null — guard defensivo exibe loading', async () => {
    // Arrange
    vi.mocked(api.getShareInfo).mockResolvedValue(null as any)

    // Act
    renderWithRoute()
    await act(async () => {})

    // Assert
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText(/LOADING_MANIFEST/)).toBeInTheDocument()
  })

  it('transiciona para ErrorState expired quando CountdownTimer expira em tela (AC: 7)', async () => {
    // Arrange
    vi.useFakeTimers()
    const expiresAt = new Date(Date.now() + 2000).toISOString()
    vi.mocked(api.getShareInfo).mockResolvedValue({
      ...mockShareInfo,
      expiresAt,
    })

    // Act
    renderWithRoute()
    await act(async () => {})
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    // Assert
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('LINK_EXPIRED')).toBeInTheDocument()

    vi.useRealTimers()
  })
})
