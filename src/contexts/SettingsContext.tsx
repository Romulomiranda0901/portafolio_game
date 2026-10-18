/**
 * Contexto de Configuración de UI: tema, acento, tipografía, radio, etc.
 * Aplica preferencias globales y persiste en localStorage.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

/** Modo de tema disponible */
export type ThemeMode = 'system' | 'light' | 'dark'

/** Paletas de acento disponibles */
export type Accent = 'cyan' | 'violet' | 'emerald' | 'rose' | 'blue' | 'amber'

/** Escala de tamaño base de fuente */
export type FontScale = 0.95 | 1 | 1.05

/** Radio de borde (CSS var --radius) */
export type Radius = 'sm' | 'md' | 'lg'

/** Estructura de ajustes de UI */
export interface Settings {
  /** Modo de tema */
  theme: ThemeMode
  /** Paleta de acento */
  accent: Accent
  /** Escala de fuente base (sobre html) */
  fontScale: FontScale
  /** Radio de borde */
  radius: Radius
  /** Mostrar imágenes OG en proyectos */
  showProjectImages: boolean
}

/** Mapeo de acentos a valores HSL (h s l) */
const ACCENTS: Record<
  Accent,
  { primary: string; primaryForeground: string; ring: string }
> = {
  // Paletas de Color Cyberpunk Neural
  cyan: {
    primary: '183 100% 50%', // #00f2fe Holographic Cyan
    primaryForeground: '228 39% 7.8%',
    ring: '183 100% 50%',
  },
  violet: {
    primary: '262 83% 58%', // #a855f7 Electric Violet
    primaryForeground: '210 40% 98%',
    ring: '262 83% 58%',
  },
  rose: {
    primary: '345 89% 60%', // #f43f5e Cyber Magenta
    primaryForeground: '0 0% 100%',
    ring: '345 89% 60%',
  },
  emerald: {
    primary: '160 84% 39%', // #10b981 Emerald Phosphor
    primaryForeground: '0 0% 100%',
    ring: '160 84% 39%',
  },
  blue: {
    primary: '221 83% 53%',
    primaryForeground: '210 40% 98%',
    ring: '221 83% 53%',
  },
  amber: {
    primary: '38 92% 50%',
    primaryForeground: '26 83% 14%',
    ring: '38 92% 50%',
  },
}

/** Radio a valores en rem coherentes con shadcn */
const RADIUS_MAP: Record<Radius, string> = {
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
}

/** Clave de almacenamiento */
const LS_KEY = 'rm_portfolio_settings_v2'

/** Ajustes por defecto */
const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  accent: 'cyan',
  fontScale: 1,
  radius: 'sm',
  showProjectImages: true,
}

/** Valor expuesto por el contexto */
interface SettingsContextValue {
  settings: Settings
  /** Tema resuelto según sistema si corresponde */
  resolvedTheme: 'light' | 'dark'
  /** Cambiar ajustes parcialmente */
  update: (patch: Partial<Settings>) => void
  /** Alternar tema rápido entre light/dark (si estás en system, pasa a dark) */
  toggleTheme: () => void
  /** Restablecer ajustes */
  reset: () => void
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined)

/**
 * Proveedor del contexto de ajustes.
 * Se encarga de cargar/guardar y aplicar efectos en el DOM.
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) return JSON.parse(raw) as Settings
    } catch {}
    return DEFAULT_SETTINGS
  })

  /** Media query para sistema oscuro */
  const mediaRef = useRef<MediaQueryList | null>(null)

  /** Tema resuelto (calcula con system o preferencia) */
  const resolvedTheme: 'light' | 'dark' = useMemo(() => {
    if (settings.theme === 'system') {
      const prefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      return prefersDark ? 'dark' : 'light'
    }
    return settings.theme
  }, [settings.theme])

  /** Aplica variables y clases al DOM según los ajustes */
  const applySettingsToDOM = useCallback(
    (s: Settings, rTheme: 'light' | 'dark') => {
      const root = document.documentElement

      // Tema
      root.classList.toggle('dark', rTheme === 'dark')

      // Acentos
      const accent = ACCENTS[s.accent]
      root.style.setProperty('--primary', accent.primary)
      root.style.setProperty('--primary-foreground', accent.primaryForeground)
      root.style.setProperty('--ring', accent.ring)

      // Radio
      root.style.setProperty('--radius', RADIUS_MAP[s.radius])

      // Tamaño base de fuente
      root.style.fontSize = `${16 * s.fontScale}px`
    },
    [],
  )

  /** Persistencia */
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(settings))
    } catch {}
  }, [settings])

  /** Aplicar ajustes en cada cambio */
  useEffect(() => {
    applySettingsToDOM(settings, resolvedTheme)
  }, [settings, resolvedTheme, applySettingsToDOM])

  /** Escuchar cambio de tema del sistema si está en 'system' */
  useEffect(() => {
    if (!window.matchMedia) return
    mediaRef.current = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (settings.theme === 'system') {
        applySettingsToDOM(settings, mediaRef.current?.matches ? 'dark' : 'light')
      }
    }
    mediaRef.current.addEventListener?.('change', handler)
    return () => mediaRef.current?.removeEventListener?.('change', handler)
  }, [settings, applySettingsToDOM])

  /** Actualiza ajustes con parche parcial */
  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  /** Toggle rápido del tema */
  const toggleTheme = useCallback(() => {
    setSettings((prev) => {
      // si está en system, pasa a dark; si está en dark, pasa a light; si está en light, pasa a dark
      const next: ThemeMode =
        prev.theme === 'system' ? 'dark' : prev.theme === 'dark' ? 'light' : 'dark'
      return { ...prev, theme: next }
    })
  }, [])

  /** Reset a valores por defecto */
  const reset = useCallback(() => setSettings(DEFAULT_SETTINGS), [])

  const value: SettingsContextValue = {
    settings,
    resolvedTheme,
    update,
    toggleTheme,
    reset,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

/**
 * Hook para consumir el contexto de ajustes.
 */
export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSettings debe usarse dentro de SettingsProvider')
  }
  return ctx
}

/**
 * Utilidad: listado de acentos y mapeos exportables.
 */
export const ACCENT_KEYS: Accent[] = ['cyan', 'violet', 'rose', 'emerald', 'blue', 'amber']