import type { ReactElement } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DownloadPage from './pages/DownloadPage/DownloadPage'

function App(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dl/:token" element={<DownloadPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function NotFound(): ReactElement {
  return (
    <main style={{ padding: '2rem', fontFamily: 'VT323, monospace', color: '#0df20d' }}>
      <p>// NOT_FOUND // INVALID_PATH</p>
    </main>
  )
}

export default App
