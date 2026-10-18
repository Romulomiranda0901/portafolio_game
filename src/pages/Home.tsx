/**
 * Página Principal (Home): Portafolio Interactivo 3D de Romulo Miranda.
 * Renderiza la experiencia de navegación 3D o el Expediente Ejecutivo.
 */

import { useEffect, useMemo, useState } from 'react'
import SiteHeader from '../components/layout/SiteHeader'
import GamePortfolio from '../components/sections/GamePortfolio'
import TacticalDossierView from '../components/sections/TacticalDossierView'
import type { GitHubUser } from '../types/github'
import { fetchGitHubUser } from '../lib/github'
import SettingsPanel from '../components/settings/SettingsPanel'

const GITHUB_USERNAME = 'Romulomiranda0901'
const EMAIL = 'romulomiranda20092009@gmail.com'
const CV_URL = 'Romulo_Miranda_CV_2025.pdf'

export default function Home() {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'game' | 'dossier'>('game')

  // Cargar perfil del usuario desde GitHub
  useEffect(() => {
    let mounted = true
    setLoadingUser(true)
    fetchGitHubUser(GITHUB_USERNAME)
      .then((u) => mounted && setUser(u))
      .finally(() => mounted && setLoadingUser(false))
    return () => {
      mounted = false
    }
  }, [])

  const displayName = useMemo(() => user?.name ?? 'Romulo Miranda', [user])

  return (
    <div className="min-h-screen bg-[#030712] text-[#dfe1f8] flex flex-col font-sans transition-colors duration-300">
      {/* Encabezado Principal */}
      <SiteHeader
        cvUrl={CV_URL}
        githubUrl={`https://github.com/${GITHUB_USERNAME}`}
        email={EMAIL}
        onOpenSettings={() => setSettingsOpen(true)}
        viewMode={viewMode}
        onToggleViewMode={(mode) => setViewMode(mode)}
      />

      {/* Área Principal de Contenido (Pantalla Completa Real) */}
      <main className="w-full h-[calc(100vh-57px)] flex items-stretch justify-stretch overflow-hidden relative">
        {viewMode === 'game' ? (
          <GamePortfolio
            name={displayName}
            avatarUrl={user?.avatar_url}
            location={user?.location}
          />
        ) : (
          <TacticalDossierView
            name={displayName}
            avatarUrl={user?.avatar_url}
            location={user?.location}
            onSwitchToGame={() => setViewMode('game')}
          />
        )}
      </main>

      {/* Panel de Configuración General */}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
