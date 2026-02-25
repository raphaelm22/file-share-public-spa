import { render, screen } from '@testing-library/react'
import TerminalHeader from './TerminalHeader'

describe('TerminalHeader', () => {
  it('renderiza com // RASPBERRY_PI_GATEWAY', () => {
    render(<TerminalHeader />)
    expect(screen.getByText('// RASPBERRY_PI_GATEWAY')).toBeInTheDocument()
  })

  it('renderiza como <header> (role banner)', () => {
    render(<TerminalHeader />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })
})
