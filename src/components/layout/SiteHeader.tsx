/**
 * Encabezado de Navegación y Comando (SiteHeader).
 * Estilo Cybernetic Neural HUD: telemetría en tiempo real, conmutador de modo de visualización,
 * sintetizador de audio espacial, acento cuántico y acceso a credenciales.
 */

import { useState, useRef, useEffect } from 'react'
import {
  Terminal,
  Volume2,
  VolumeX,
  FileDown,
  Github,
  Palette,
  SlidersHorizontal,
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react'
import { Button } from '../ui/button'
import { useSettings, ACCENT_KEYS, Accent } from '../../contexts/SettingsContext'
import { useTranslation } from 'react-i18next'
import { soundEngine } from '../../lib/soundEngine'

interface SiteHeaderProps {
  onPrint?: () => void
  cvUrl: string
  githubUrl: string
  email: string
  onOpenSettings: () => void
  viewMode: 'game' | 'dossier'
  onToggleViewMode: (mode: 'game' | 'dossier') => void
  teleportToNode?: (nodeId: string) => void
}

export default function SiteHeader({
  cvUrl,
  githubUrl,
  email,
  onOpenSettings,
  viewMode,
  onToggleViewMode,
}: SiteHeaderProps) {
  const { settings, update } = useSettings()
  const { i18n } = useTranslation('common')

  const [soundActive, setSoundActive] = useState(false)
  const [openAccent, setOpenAccent] = useState(false)
  const accentRef = useRef<HTMLDivElement | null>(null)

  // Sincronizar estado de audio con el soundEngine
  useEffect(() => {
    const unsub = soundEngine.subscribe((active) => {
      setSoundActive(active)
    })
    return () => unsub()
  }, [])

  // Cerrar popover de acento al hacer click afuera
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (accentRef.current && !accentRef.current.contains(e.target as Node)) {
        setOpenAccent(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const handleToggleSound = () => {
    const next = soundEngine.toggle()
    setSoundActive(next)
  }

  const toggleLanguage = () => {
    soundEngine.play('click')
    const next = i18n.language.startsWith('es') ? 'en' : 'es'
    i18n.changeLanguage(next)
  }

  const accentColors: Record<Accent, { name: string; bg: string; border: string }> = {
    cyan: { name: 'Holo Cyan', bg: 'bg-[#00f2fe]', border: 'border-[#00f2fe]' },
    violet: { name: 'Electric Violet', bg: 'bg-[#a855f7]', border: 'border-[#a855f7]' },
    rose: { name: 'Cyber Magenta', bg: 'bg-[#f43f5e]', border: 'border-[#f43f5e]' },
    emerald: { name: 'Emerald Phosphor', bg: 'bg-[#10b981]', border: 'border-[#10b981]' },
    blue: { name: 'Quantum Blue', bg: 'bg-[#3b82f6]', border: 'border-[#3b82f6]' },
    amber: { name: 'Matrix Amber', bg: 'bg-[#f59e0b]', border: 'border-[#f59e0b]' },
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#030712]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[#030712]/75 select-none no-print">
      <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center justify-between gap-3 font-mono text-xs">
        {/* Identidad / Marca Cuántica */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center size-8 rounded border border-cyan-500/40 bg-cyan-950/30 text-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
            <Terminal className="size-4 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold tracking-wider text-sm sm:text-base text-white">
                ROMULO MIRANDA
              </span>
              <span className="hidden md:inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                LEAD FULL STACK ARCHITECT
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/80">
              <span className="text-cyan-400 font-semibold">CIBERSEGURIDAD & SISTEMAS</span>
              <span className="hidden sm:inline opacity-40">|</span>
              <span className="hidden sm:inline text-muted-foreground/60">PORTAFOLIO INTERACTIVO 3D</span>
            </div>
          </div>
        </div>

        {/* Conmutador Central de Modo: Exploración 3D vs Expediente */}
        <div className="hidden lg:flex items-center p-1 rounded-md border border-cyan-500/25 bg-black/60 shadow-inner">
          <button
            onClick={() => {
              soundEngine.play('warp')
              onToggleViewMode('game')
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-semibold transition-all duration-300 ${
              viewMode === 'game'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            <Compass className="size-3.5" />
            <span>EXPLORACIÓN 3D</span>
          </button>
          <button
            onClick={() => {
              soundEngine.play('portal')
              onToggleViewMode('dossier')
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-semibold transition-all duration-300 ${
              viewMode === 'dossier'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            <Layers className="size-3.5" />
            <span>EXPEDIENTE EJECUTIVO</span>
          </button>
        </div>

        {/* Controles del Sistema HUD */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Conmutador Móvil de Modo */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              soundEngine.play('warp')
              onToggleViewMode(viewMode === 'game' ? 'dossier' : 'game')
            }}
            className="lg:hidden h-8 px-2.5 border-cyan-500/30 bg-cyan-950/20 text-cyan-300 text-[10px]"
          >
            {viewMode === 'game' ? (
              <span className="flex items-center gap-1">
                <Layers className="size-3" /> EXPEDIENTE
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Compass className="size-3" /> VISTA 3D
              </span>
            )}
          </Button>

          {/* Sintetizador de Audio Cuántico */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleSound}
            className={`h-8 px-2.5 border transition-all duration-300 ${
              soundActive
                ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                : 'border-border/30 bg-transparent text-muted-foreground hover:text-white'
            }`}
            title="Activar/Desactivar sintetizador de audio espacial"
          >
            {soundActive ? (
              <span className="flex items-center gap-1.5">
                <Volume2 className="size-3.5 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline text-[10px] font-bold">AUDIO ON</span>
                {/* Visualizador de audio sintético */}
                <span className="hidden md:flex items-end gap-0.5 h-3 ml-1">
                  <span className="w-0.5 h-full bg-cyan-400 animate-pulse"></span>
                  <span className="w-0.5 h-2 bg-cyan-300 animate-ping"></span>
                  <span className="w-0.5 h-3 bg-cyan-400 animate-pulse"></span>
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px]">
                <VolumeX className="size-3.5 opacity-60" />
                <span className="hidden sm:inline">AUDIO</span>
              </span>
            )}
          </Button>

          {/* Descarga Holo-CV */}
          <a
            href={cvUrl}
            download="Romulo_Miranda_CV_2025.pdf"
            target="_blank"
            rel="noreferrer"
            onClick={() => soundEngine.play('chirp')}
          >
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 border-cyan-500/30 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300 text-[10px]"
              title="Descargar Curriculum Vitae verificado"
            >
              <FileDown className="size-3.5 mr-1" />
              <span className="hidden sm:inline">HOLO-CV</span>
              <span className="sm:hidden">CV</span>
            </Button>
          </a>

          {/* Selector de Acento Cuántico */}
          <div className="relative" ref={accentRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                soundEngine.play('click')
                setOpenAccent((v) => !v)
              }}
              className="h-8 w-8 p-0 border-cyan-500/25 bg-black/40 hover:border-cyan-400"
              title="Ajustar color de frecuencia de energía"
            >
              <Palette className="size-3.5 text-cyan-400" />
            </Button>

            {openAccent && (
              <div className="absolute right-0 mt-2 w-52 rounded-lg border border-cyan-500/30 bg-[#060919]/95 p-3 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50 animate-zoom-in">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20 text-[10px] text-cyan-400 font-bold uppercase">
                  <span>FRECUENCIA DE NÚCLEO</span>
                  <Sparkles className="size-3" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ACCENT_KEYS.map((key) => {
                    const item = accentColors[key]
                    const isActive = settings.accent === key
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          soundEngine.play('success')
                          update({ accent: key })
                          setOpenAccent(false)
                        }}
                        className={`flex flex-col items-center gap-1 p-1.5 rounded border text-[9px] transition-all ${
                          isActive
                            ? `${item.border} bg-cyan-950/40 text-white shadow-[0_0_10px_rgba(0,242,254,0.3)]`
                            : 'border-border/30 bg-black/30 text-muted-foreground hover:border-cyan-500/40 hover:text-white'
                        }`}
                      >
                        <span className={`size-3.5 rounded-full ${item.bg}`} />
                        <span className="truncate w-full text-center capitalize">{key}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Conmutador de Idioma */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="h-8 px-2 border-cyan-500/25 bg-black/40 hover:border-cyan-400 text-[10px] font-bold"
            title="Alternar Idioma ES / EN"
          >
            {i18n.language.startsWith('es') ? 'ES' : 'EN'}
          </Button>

          {/* Enlace Neural GitHub */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => soundEngine.play('chirp')}
            className="h-8 w-8 rounded border border-cyan-500/25 bg-black/40 flex items-center justify-center text-muted-foreground hover:text-cyan-400 hover:border-cyan-400 transition-colors"
            title="Uplink GitHub @Romulomiranda0901"
          >
            <Github className="size-3.5" />
          </a>

          {/* Panel de Configuración General */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              soundEngine.play('click')
              onOpenSettings()
            }}
            className="h-8 w-8 p-0 border-cyan-500/25 bg-black/40 hover:border-cyan-400 text-muted-foreground hover:text-cyan-400"
            title="Parámetros del Sistema"
          >
            <SlidersHorizontal className="size-3.5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
