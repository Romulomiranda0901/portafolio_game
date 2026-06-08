import { MemoryRouter, Route, Routes } from 'react-router'
import HomePage from './pages/Home'
import ThanksPage from './pages/Thanks'
import NotFoundPage from './pages/NotFound'
import { SettingsProvider } from './contexts/SettingsContext'
import { Toaster } from 'sonner'
import ErrorBoundary from './components/common/ErrorBoundary'
import './i18n'

/**
 * App principal: enruta y provee el SettingsProvider global.
 * Usa MemoryRouter para evitar dependencias a react-router-dom.
 * Monta Toaster (notificaciones) y ErrorBoundary de recuperación.
 */
export default function App() {
  return (
    <SettingsProvider>
      {/* Toaster global para notificaciones (usa el tema del sistema) */}
      <Toaster position="top-right" richColors theme="system" />
      {/* ErrorBoundary global: evita que un error rompa toda la vista previa */}
      <ErrorBoundary>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/thanks" element={<ThanksPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      </ErrorBoundary>
    </SettingsProvider>
  )
}
