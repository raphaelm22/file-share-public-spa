import { render, screen } from '@testing-library/react'
import ErrorState from './ErrorState'

describe('ErrorState', () => {
  describe('variant: expired', () => {
    it('exibe código LINK_EXPIRED', () => {
      // Act
      render(<ErrorState variant="expired" />)

      // Assert
      expect(screen.getByText('LINK_EXPIRED')).toBeInTheDocument()
    })

    it('exibe subtítulo // TOKEN_REVOKED', () => {
      // Act
      render(<ErrorState variant="expired" />)

      // Assert
      expect(screen.getByText('// TOKEN_REVOKED')).toBeInTheDocument()
    })
  })

  describe('variant: not-found', () => {
    it('exibe código TARGET_NOT_FOUND', () => {
      // Act
      render(<ErrorState variant="not-found" />)

      // Assert
      expect(screen.getByText('TARGET_NOT_FOUND')).toBeInTheDocument()
    })

    it('exibe subtítulo // ASSET_REMOVED', () => {
      // Act
      render(<ErrorState variant="not-found" />)

      // Assert
      expect(screen.getByText('// ASSET_REMOVED')).toBeInTheDocument()
    })
  })

  describe('variant: denied', () => {
    it('exibe código ACCESS_DENIED', () => {
      // Act
      render(<ErrorState variant="denied" />)

      // Assert
      expect(screen.getByText('ACCESS_DENIED')).toBeInTheDocument()
    })

    it('exibe subtítulo // INVALID_TOKEN', () => {
      // Act
      render(<ErrorState variant="denied" />)

      // Assert
      expect(screen.getByText('// INVALID_TOKEN')).toBeInTheDocument()
    })
  })

  describe('acessibilidade (AC: 4)', () => {
    it('tem role="alert" em todos os variants', () => {
      // Act
      render(<ErrorState variant="expired" />)

      // Assert
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('tem aria-live="assertive"', () => {
      // Act
      render(<ErrorState variant="denied" />)

      // Assert
      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive')
    })

    it('tem tabIndex=-1 para suportar foco programático', () => {
      // Act
      render(<ErrorState variant="not-found" />)

      // Assert
      expect(screen.getByRole('alert')).toHaveAttribute('tabindex', '-1')
    })

    it('move foco automaticamente para o container ao renderizar (AC: 4)', () => {
      // Act
      render(<ErrorState variant="denied" />)

      // Assert
      expect(screen.getByRole('alert')).toHaveFocus()
    })
  })

  describe('sem CTA (AC: 5)', () => {
    it('não exibe nenhum botão no variant expired', () => {
      // Act
      render(<ErrorState variant="expired" />)

      // Assert
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('não exibe nenhum link no variant denied', () => {
      // Act
      render(<ErrorState variant="denied" />)

      // Assert
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
  })
})
