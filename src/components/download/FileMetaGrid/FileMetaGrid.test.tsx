import { render, screen } from '@testing-library/react'
import FileMetaGrid from './FileMetaGrid'

describe('FileMetaGrid', () => {
  it('exibe label SIZE_ON_DISK', () => {
    render(<FileMetaGrid fileSize={1024} fileName="test.txt" />)
    expect(screen.getByText('SIZE_ON_DISK')).toBeInTheDocument()
  })

  it('formata fileSize em bytes', () => {
    render(<FileMetaGrid fileSize={512} fileName="test.txt" />)
    expect(screen.getByText('512 B')).toBeInTheDocument()
  })

  it('formata fileSize em KB', () => {
    render(<FileMetaGrid fileSize={1024} fileName="test.txt" />)
    expect(screen.getByText('1.0 KB')).toBeInTheDocument()
  })

  it('formata fileSize em MB', () => {
    render(<FileMetaGrid fileSize={1048576} fileName="test.txt" />)
    expect(screen.getByText('1.0 MB')).toBeInTheDocument()
  })

  it('exibe label MIME_TYPE', () => {
    render(<FileMetaGrid fileSize={1024} fileName="document.pdf" />)
    expect(screen.getByText('MIME_TYPE')).toBeInTheDocument()
  })

  it('exibe application/pdf para .pdf', () => {
    render(<FileMetaGrid fileSize={1024} fileName="document.pdf" />)
    expect(screen.getByText('application/pdf')).toBeInTheDocument()
  })

  it('exibe application/zip para .zip', () => {
    render(<FileMetaGrid fileSize={2048} fileName="archive.zip" />)
    expect(screen.getByText('application/zip')).toBeInTheDocument()
  })

  it('exibe application/octet-stream para extensão desconhecida', () => {
    render(<FileMetaGrid fileSize={1024} fileName="mystery.xyz" />)
    expect(screen.getByText('application/octet-stream')).toBeInTheDocument()
  })
})
