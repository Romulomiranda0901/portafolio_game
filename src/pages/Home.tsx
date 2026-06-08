/** 
 * Página Home: Portafolio de juego de Romulo Miranda.
 * Carga el perfil del autor y renderiza el motor de juego interactivo Cyberpunk.
 */

import { useEffect, useMemo, useState } from "react"
import SiteHeader from "../components/layout/SiteHeader"
import GamePortfolio from "../components/sections/GamePortfolio"
import type { GitHubUser } from "../types/github"
import { fetchGitHubUser } from "../lib/github"
import SettingsPanel from "../components/settings/SettingsPanel"

/** Constantes del autor */
const GITHUB_USERNAME = "Romulomiranda0901"
const EMAIL = "romulomiranda20092009@gmail.com"
const CV_URL = "Romulo_Miranda_CV_2025.pdf"

/**
 * Home: compone el juego interactivo principal y el panel de configuración.
 */
export default function Home() {
  /** Estado del perfil de GitHub */
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  /** Estado del panel de configuración */
  const [settingsOpen, setSettingsOpen] = useState(false)

  /** Cargar perfil del usuario */
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

  /** Nombre a mostrar */
  const displayName = useMemo(() => user?.name ?? "Romulo Miranda", [user])

  function handlePrint() {
    window.print()
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <SiteHeader
        onPrint={handlePrint}
        cvUrl={CV_URL}
        githubUrl={`https://github.com/${GITHUB_USERNAME}`}
        email={EMAIL}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Área del contenido del juego (pantalla completa real) */}
      <main className="w-full h-[calc(100vh-57px)] flex items-stretch justify-stretch overflow-hidden">
        <GamePortfolio
          name={displayName}
          avatarUrl={user?.avatar_url}
          location={user?.location}
        />
      </main>

      {/* Panel de configuración */}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
