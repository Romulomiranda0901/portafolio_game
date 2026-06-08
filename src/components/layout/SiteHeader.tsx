/**
 * Encabezado del sitio con nombre, navegación por secciones (scrollspy) y acciones.
 * Incluye selector de idioma ES/EN, modo claro/oscuro, selector de acento y botón de configuración.
 */

import { Button } from '../../components/ui/button'
import {
  Github,
  Mail,
  Printer,
  Download,
  Moon,
  Sun,
  Settings as SettingsIcon,
  Languages,
  Palette,
  Gamepad2,
} from 'lucide-react'
import { useSettings, ACCENT_KEYS } from '../../contexts/SettingsContext'
import { useTranslation } from 'react-i18next'
import '../../i18n'
import useScrollSpy from '../../hooks/useScrollSpy'
import { useEffect, useRef, useState } from 'react'

/** Props para SiteHeader */
interface SiteHeaderProps {
  /** Acción para imprimir/exportar a PDF */
  onPrint: () => void
  /** URL al PDF del CV */
  cvUrl: string
  /** URL del perfil de GitHub */
  githubUrl: string
  /** Email de contacto */
  email: string
  /** Abrir panel de configuración */
  onOpenSettings: () => void
  /** Estado de modo juego */
  gameMode: boolean
  /** Alternar modo juego */
  onToggleGameMode: () => void
}

/**
 * Header del sitio con navegación anclada, acciones rápidas y control de idioma/tema/acento.
 */
export default function SiteHeader({
  onPrint,
  cvUrl,
  githubUrl,
  email,
  onOpenSettings,
  gameMode,
  onToggleGameMode,
}: SiteHeaderProps) {
  const { resolvedTheme, toggleTheme, settings, update } = useSettings()
  const { t, i18n } = useTranslation('common')

  /** IDs de secciones a observar para el estado activo */
  const sectionIds = [
    'home',
    'about',
    'skills',
    'services',
    'experience',
    'projects',
    'certifications'
  ]
  const activeId = useScrollSpy(sectionIds)

  /** Estado del popover de acento */
  const [openAccent, setOpenAccent] = useState(false)
  const accentRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    /** Cierra el popover al hacer clic fuera */
    function onDocClick(e: MouseEvent) {
      if (!accentRef.current) return
      if (!accentRef.current.contains(e.target as Node)) setOpenAccent(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  /** Cambia de idioma y persiste en i18n */
  function changeLang(lng: 'es' | 'en') {
    i18n.changeLanguage(lng)
  }

  /** Alterna ES/EN rápido (para móvil) */
  function toggleLang() {
    const next = i18n.language.startsWith('es') ? 'en' : 'es'
    i18n.changeLanguage(next)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 no-print">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        {/* Marca */}
        <a href="#home" className="font-semibold tracking-tight text-lg shrink-0">
          Romulo Miranda
        </a>

        {/* Navegación por secciones (scroll horizontal si desborda) */}
        <nav className="hidden md:flex items-center gap-1 mx-2 overflow-x-auto">
          {sectionIds.map((id) => {
            const labelMap: Record<string, string> = {
              home: t('nav.home', { defaultValue: 'Inicio' }),
              about: t('nav.about', { defaultValue: 'Sobre mí' }),
              skills: t('nav.skills', { defaultValue: 'Habilidades' }),
              services: t('nav.services', { defaultValue: 'Servicios' }),
              experience: t('nav.experience', { defaultValue: 'Experiencia' }),
              projects: t('nav.projects', { defaultValue: 'Proyectos' }),
              certifications: t('nav.certifications', { defaultValue: 'Certificaciones' }),
            }
            const isActive = activeId === id
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => {
                  if (gameMode) {
                    onToggleGameMode()
                  }
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-md text-sm transition font-medium ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {labelMap[id] ?? id}
              </a>
            )
          })}
        </nav>

        {/* Acciones a la derecha */}
        <div className="ml-auto flex items-center gap-2">
          {/* Botón rápido de idioma para móvil */}
          <Button
            variant="outline"
            className="bg-transparent md:hidden"
            onClick={toggleLang}
            title={t('actions.langToggle', { defaultValue: 'Cambiar idioma' })}
          >
            <Languages className="size-4 mr-2" />
            {i18n.language.startsWith('es') ? 'ES' : 'EN'}
          </Button>

           <a href={`mailto:${email}`} title="Contactar por correo">
            <Button>
              <Mail className="size-4 mr-2" />
              {t('actions.contact')}
            </Button>
          </a>

          {/* Selector de idioma (desktop) */}
          <div className="hidden md:flex items-center gap-1 pl-1 ml-1 border-l">
            <Languages className="size-4 text-muted-foreground" />
            <Button
              variant={i18n.language.startsWith('es') ? 'secondary' : 'outline'}
              className={i18n.language.startsWith('es') ? '' : 'bg-transparent'}
              onClick={() => changeLang('es')}
              title="Español"
            >
              {t('lang.es')}
            </Button>
            <Button
              variant={i18n.language.startsWith('en') ? 'secondary' : 'outline'}
              className={i18n.language.startsWith('en') ? '' : 'bg-transparent'}
              onClick={() => changeLang('en')}
              title="English"
            >
              {t('lang.en')}
            </Button>
          </div>

          {/* Modo Juego / Modo Web */}
          <Button
            variant={gameMode ? 'default' : 'outline'}
            className={gameMode ? 'bg-primary text-primary-foreground border-transparent animate-pulse mr-1' : 'bg-transparent mr-1'}
            onClick={onToggleGameMode}
            title={gameMode ? 'Modo Web Clásico' : 'Modo Arcade Juego'}
          >
            <Gamepad2 className="size-4 mr-2" />
            <span className="hidden sm:inline">{gameMode ? 'Modo Web' : 'Modo Arcade'}</span>
          </Button>

          {/* Tema */}
          <Button
            variant="outline"
            className="bg-transparent"
            onClick={toggleTheme}
            title={resolvedTheme === 'dark' ? t('theme.light') : t('theme.dark')}
          >
            {resolvedTheme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          {/* Selector de acento (popover simple) */}
          <div className="relative" ref={accentRef}>
            <Button
              variant="outline"
              className="bg-transparent"
              onClick={() => setOpenAccent((v) => !v)}
              title={t('actions.accent') ?? 'Acento'}
            >
              <Palette className="size-4 mr-2" />
              {t('actions.accent') ?? 'Acento'}
            </Button>
            {openAccent ? (
              <div
                className="absolute right-0 mt-2 w-56 rounded-lg border bg-popover p-3 shadow-md"
                role="dialog"
                aria-label="Selector de acento"
              >
                <p className="text-xs text-muted-foreground mb-2">{t('accent.title', { defaultValue: 'Color de acento' })}</p>
                <div className="flex items-center gap-2">
                  {ACCENT_KEYS.map((key) => {
                    const isActive = settings.accent === key
                    const swatch: Record<string, string> = {
                      violet: 'from-violet-500 to-fuchsia-500',
                      blue: 'from-blue-500 to-cyan-500',
                      emerald: 'from-emerald-500 to-teal-500',
                      amber: 'from-amber-500 to-orange-500',
                      zinc: 'from-zinc-700 to-zinc-500',
                    }
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-label={`Acento ${key}`}
                        title={`Acento ${key}`}
                        onClick={() => update({ accent: key })}
                        className={`size-7 rounded-full bg-gradient-to-br ${swatch[key]} ring-2 transition ${
                          isActive ? 'ring-primary' : 'ring-transparent hover:ring-muted-foreground/30'
                        }`}
                      />
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <Button
            variant="outline"
            className="bg-transparent"
            onClick={onOpenSettings}
            title={t('actions.settings')}
          >
            <SettingsIcon className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
