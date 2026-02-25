import { render, screen, fireEvent, act } from '@testing-library/react'
import DownloadButton from './DownloadButton'

describe('DownloadButton', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('exibe [ EXECUTE_DOWNLOAD ] no estado idle', () => {
    // Arrange & Act
    render(<DownloadButton downloadUrl="/dl/token/file" fileName="file.pdf" />)

    // Assert
    expect(screen.getByRole('button', { name: '[ EXECUTE_DOWNLOAD ]' })).toBeInTheDocument()
  })

  it('exibe INITIATING_TRANSFER após clique', () => {
    // Arrange
    render(<DownloadButton downloadUrl="/dl/token/file" fileName="file.pdf" />)

    // Act
    fireEvent.click(screen.getByRole('button'))

    // Assert
    expect(screen.getByText('INITIATING_TRANSFER...')).toBeInTheDocument()
  })

  it('exibe TRANSFER_COMPLETE após 500ms', () => {
    // Arrange
    render(<DownloadButton downloadUrl="/dl/token/file" fileName="file.pdf" />)

    // Act
    fireEvent.click(screen.getByRole('button'))
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Assert
    expect(screen.getByText('TRANSFER_COMPLETE')).toBeInTheDocument()
  })

  it('retorna a [ EXECUTE_DOWNLOAD ] após 3500ms', () => {
    // Arrange
    render(<DownloadButton downloadUrl="/dl/token/file" fileName="file.pdf" />)

    // Act
    fireEvent.click(screen.getByRole('button'))
    act(() => {
      vi.advanceTimersByTime(3500)
    })

    // Assert
    expect(screen.getByRole('button', { name: '[ EXECUTE_DOWNLOAD ]' })).toBeInTheDocument()
  })

  it('está desabilitado quando disabled=true', () => {
    // Arrange & Act
    render(<DownloadButton downloadUrl="/dl/token/file" fileName="file.pdf" disabled />)

    // Assert
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('não altera label quando disabled e clicado', () => {
    // Arrange
    render(<DownloadButton downloadUrl="/dl/token/file" fileName="file.pdf" disabled />)

    // Act
    fireEvent.click(screen.getByRole('button'))
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Assert
    expect(screen.getByText('[ EXECUTE_DOWNLOAD ]')).toBeInTheDocument()
  })

  it('tem aria-busy=false no estado idle', () => {
    // Arrange & Act
    render(<DownloadButton downloadUrl="/dl/token/file" fileName="file.pdf" />)

    // Assert
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'false')
  })

  it('tem aria-busy=true durante loading', () => {
    // Arrange
    render(<DownloadButton downloadUrl="/dl/token/file" fileName="file.pdf" />)

    // Act
    fireEvent.click(screen.getByRole('button'))

    // Assert
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })

  it('botão fica desabilitado durante loading', () => {
    // Arrange
    render(<DownloadButton downloadUrl="/dl/token/file" fileName="file.pdf" />)

    // Act
    fireEvent.click(screen.getByRole('button'))

    // Assert
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
