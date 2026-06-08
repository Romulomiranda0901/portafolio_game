/** 
 * Página Home: Portafolio completo de Romulo Miranda.
 * Ensambla las secciones: Hero, Sobre mí, Habilidades, Servicios, Experiencia, Proyectos, Certificaciones, Testimonios, Contacto.
 * Incluye estilos de impresión, header, footer, panel de configuración y barra de acciones flotante.
 */

import { useEffect, useMemo, useState } from "react"
import SiteHeader from "../components/layout/SiteHeader"
import PrintStyles from "../components/layout/PrintStyles"
import Hero from "../components/sections/Hero"
import About from "../components/sections/About"
import Skills from "../components/sections/Skills"
import Services from "../components/sections/Services"
import Experience from "../components/sections/Experience"
import Projects from "../components/sections/Projects"
import Certifications from "../components/sections/Certifications"
import Testimonials from "../components/sections/Testimonials"
import Contact from "../components/sections/Contact"
import GamePortfolio from "../components/sections/GamePortfolio"
import type { GitHubUser } from "../types/github"
import { fetchGitHubUser } from "../lib/github"
import { Separator } from "../components/ui/separator"
import { Button } from "../components/ui/button"
import { ArrowUp, Gamepad2 } from "lucide-react"
import SettingsPanel from "../components/settings/SettingsPanel"
import ActionBar from "../components/layout/ActionBar"

/** Constantes del autor */
const GITHUB_USERNAME = "Romulomiranda0901"
const EMAIL = "romulomiranda20092009@gmail.com"
const CV_URL = "Romulo_Miranda_CV_2025.pdf"

/**
 * Home: compone todas las secciones y maneja la UI global (panel de config).
 */
export default function Home() {
  /** Estado del perfil de GitHub */
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  /** Estado del panel de configuración */
  const [settingsOpen, setSettingsOpen] = useState(false)
  /** Estado de modo juego */
  const [gameMode, setGameMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('rm_portfolio_gamemode')
      return stored !== 'false' // Por defecto true para lucir la V2 interactiva
    } catch {
      return true
    }
  })

  /** Guardar elección en localStorage */
  useEffect(() => {
    try {
      localStorage.setItem('rm_portfolio_gamemode', String(gameMode))
    } catch {}
  }, [gameMode])

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

  /** Acción de impresión/exportar PDF */
  function handlePrint() {
    window.print()
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <PrintStyles />
      <SiteHeader
        onPrint={handlePrint}
        cvUrl={CV_URL}
        githubUrl={`https://github.com/${GITHUB_USERNAME}`}
        email={EMAIL}
        onOpenSettings={() => setSettingsOpen(true)}
        gameMode={gameMode}
        onToggleGameMode={() => setGameMode(!gameMode)}
      />

      {/* Botón flotante para alternar modo juego rápido (visible solo en PC/Móvil) no-print */}
      <div className="fixed bottom-6 left-6 z-40 no-print">
        <Button
          onClick={() => setGameMode(!gameMode)}
          className="shadow-[0_0_20px_rgba(var(--primary),0.35)] font-mono text-xs border border-primary-foreground/15 hover:scale-105 transition-all duration-300 gap-2 h-10 px-4"
        >
          <Gamepad2 className="size-4 animate-bounce" />
          {gameMode ? 'MODO CLÁSICO' : 'MODO ARCADE'}
        </Button>
      </div>

      {/* Área del contenido */}
      <main id="print-area" className={gameMode ? "py-8 px-4 max-w-6xl mx-auto flex items-center justify-center min-h-[calc(100vh-140px)]" : ""}>
        {gameMode ? (
          <GamePortfolio
            onExitGameMode={() => setGameMode(false)}
            name={displayName}
            avatarUrl={user?.avatar_url}
            location={user?.location}
          />
        ) : (
          <>
            <Hero
              name={displayName}
              title="Senior Software Engineer • Full Stack • Ciberseguridad"
              avatarUrl={user?.avatar_url}
              cvUrl={CV_URL}
              githubUrl={`https://github.com/${GITHUB_USERNAME}`}
            />

            <About location={user?.location} years={4} />
            <Skills />
            <Services />
            <Experience />
            <Projects username={GITHUB_USERNAME} />

            <Certifications />
            <Testimonials />
          </>
        )}
      </main>

      {/* Footer */}
      {!gameMode && (
        <footer className="mt-12 border-t py-8 no-print">
          <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {displayName}. Todos los derechos reservados.
            </p>
            <a href="#home">
              <Button variant="outline" className="bg-transparent">
                <ArrowUp className="size-4 mr-2" />
                Volver arriba
              </Button>
            </a>
          </div>
        </footer>
      )}

      {/* Barra de acciones flotante */}
      {!gameMode && <ActionBar email={EMAIL} onPrint={handlePrint} />}

      {/* Panel de configuración */}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
