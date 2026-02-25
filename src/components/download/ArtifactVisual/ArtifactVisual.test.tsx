import { render } from '@testing-library/react'
import ArtifactVisual from './ArtifactVisual'

describe('ArtifactVisual', () => {
  it('renderiza sem erros', () => {
    const { container } = render(<ArtifactVisual fileName="document.pdf" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('é aria-hidden (componente decorativo)', () => {
    const { container } = render(<ArtifactVisual fileName="archive.zip" />)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('exibe a extensão do arquivo em maiúsculas', () => {
    const { container } = render(<ArtifactVisual fileName="report.xlsx" />)
    expect(container.textContent).toContain('[XLSX]')
  })

  it('usa FILE como extensão fallback quando não há ponto no nome', () => {
    const { container } = render(<ArtifactVisual fileName="noextension" />)
    expect(container.textContent).toContain('[FILE]')
  })

  it('usa FILE como extensão fallback quando extensão está vazia (trailing dot)', () => {
    const { container } = render(<ArtifactVisual fileName="file." />)
    expect(container.textContent).toContain('[FILE]')
  })
})
