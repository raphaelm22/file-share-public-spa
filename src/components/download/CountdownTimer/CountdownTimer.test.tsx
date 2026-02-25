import { render, screen, act } from '@testing-library/react'
import CountdownTimer from './CountdownTimer'

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('exibe T-HH:MM:SS formatado corretamente', () => {
    // Arrange
    const expiresAt = new Date(Date.now() + 3661 * 1000).toISOString()

    // Act
    render(<CountdownTimer expiresAt={expiresAt} />)

    // Assert
    expect(screen.getByRole('timer')).toBeInTheDocument()
    expect(screen.getByText('T-01:01:01')).toBeInTheDocument()
  })

  it('atualiza a cada segundo via setInterval', () => {
    // Arrange
    const expiresAt = new Date(Date.now() + 5000).toISOString()

    // Act
    render(<CountdownTimer expiresAt={expiresAt} />)
    expect(screen.getByText('T-00:00:05')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Assert
    expect(screen.getByText('T-00:00:04')).toBeInTheDocument()
  })

  it('exibe T-00:00:00 quando já expirado', () => {
    // Arrange
    const expiresAt = new Date(Date.now() - 1000).toISOString()

    // Act
    render(<CountdownTimer expiresAt={expiresAt} />)

    // Assert
    expect(screen.getByText('T-00:00:00')).toBeInTheDocument()
  })

  it('exibe label EXPIRATION_SEQUENCE', () => {
    // Arrange
    const expiresAt = new Date(Date.now() + 3600000).toISOString()

    // Act
    render(<CountdownTimer expiresAt={expiresAt} />)

    // Assert
    expect(screen.getByText('EXPIRATION_SEQUENCE')).toBeInTheDocument()
  })

  it('tem role="timer" e aria-live="off"', () => {
    // Arrange
    const expiresAt = new Date(Date.now() + 3600000).toISOString()

    // Act
    render(<CountdownTimer expiresAt={expiresAt} />)

    // Assert
    const timer = screen.getByRole('timer')
    expect(timer).toHaveAttribute('aria-live', 'off')
  })

  it('aria-label inclui o tempo formatado', () => {
    // Arrange
    const expiresAt = new Date(Date.now() + 3600000).toISOString()

    // Act
    render(<CountdownTimer expiresAt={expiresAt} />)

    // Assert
    expect(screen.getByRole('timer')).toHaveAttribute(
      'aria-label',
      'Tempo restante: T-01:00:00'
    )
  })

  it('marca data-urgent quando restam menos de 10 minutos', () => {
    // Arrange
    const expiresAt = new Date(Date.now() + 9 * 60 * 1000).toISOString()

    // Act
    render(<CountdownTimer expiresAt={expiresAt} />)

    // Assert
    expect(screen.getByText('T-00:09:00')).toHaveAttribute('data-urgent', 'true')
  })

  it('NÃO marca data-urgent quando há mais de 10 minutos', () => {
    // Arrange
    const expiresAt = new Date(Date.now() + 11 * 60 * 1000).toISOString()

    // Act
    render(<CountdownTimer expiresAt={expiresAt} />)

    // Assert
    expect(screen.getByText('T-00:11:00')).toHaveAttribute('data-urgent', 'false')
  })

  it('avança múltiplos segundos corretamente', () => {
    // Arrange
    const expiresAt = new Date(Date.now() + 10000).toISOString()

    // Act
    render(<CountdownTimer expiresAt={expiresAt} />)
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    // Assert
    expect(screen.getByText('T-00:00:07')).toBeInTheDocument()
  })

  it('chama onExpire quando remaining atinge zero (AC: 7)', () => {
    // Arrange
    const onExpire = vi.fn()
    const expiresAt = new Date(Date.now() + 2000).toISOString()

    // Act
    render(<CountdownTimer expiresAt={expiresAt} onExpire={onExpire} />)
    act(() => {
      vi.advanceTimersByTime(2500)
    })

    // Assert
    expect(onExpire).toHaveBeenCalledTimes(1)
  })

  it('chama onExpire apenas uma vez mesmo com múltiplos ticks após expirar (AC: 7)', () => {
    // Arrange
    const onExpire = vi.fn()
    const expiresAt = new Date(Date.now() + 1000).toISOString()

    // Act
    render(<CountdownTimer expiresAt={expiresAt} onExpire={onExpire} />)
    act(() => {
      vi.advanceTimersByTime(5000) // muito além da expiração
    })

    // Assert
    expect(onExpire).toHaveBeenCalledTimes(1)
  })

  it('não chama onExpire se não fornecido (sem crash)', () => {
    // Arrange
    const expiresAt = new Date(Date.now() + 500).toISOString()

    // Act & Assert — não deve lançar erro
    expect(() => {
      render(<CountdownTimer expiresAt={expiresAt} />)
      act(() => {
        vi.advanceTimersByTime(1500)
      })
    }).not.toThrow()
  })
})
