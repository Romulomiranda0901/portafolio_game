/**
 * Panel de Configuración: permite ajustar tema, acento, tipografía, radio y preferencias.
 * Es un panel flotante simple controlado por props open/onClose.
 */

import { useMemo } from 'react'
import { Button } from '../ui/button'
import { useSettings, ACCENT_KEYS } from '../../contexts/SettingsContext'
import { Check, Moon, Sun, Settings as SettingsIcon, SlidersHorizontal } from 'lucide-react'

/** Props del panel */
interface SettingsPanelProps {
  /** Visible o no */
  open: boolean
  /** Cerrar panel */
  onClose: () => void
}

/** Opción simple de radio input */
function RadioItem({
  name,
  value,
  checked,
  label,
  onChange,
}: {
  name: string
  value: string
  checked: boolean
  label: string
  onChange: (value: string) => void
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="accent-foreground"
      />
      <span>{label}</span>
    </label>
  )
}

/** Opción simple de checkbox */
function CheckItem({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-foreground"
      />
      <span>{label}</span>
    </label>
  )
}

/**
 * Pequeños chips de color para selección de acento.
 */
function AccentSwatch({
  accent,
  selected,
  onSelect,
}: {
  accent: string
  selected: boolean
  onSelect: () => void
}) {
  const style = useMemo(() => {
    const map: Record<string, string> = {
      cyan: 'from-cyan-400 to-blue-500',
      violet: 'from-violet-500 to-fuchsia-500',
      rose: 'from-rose-500 to-pink-500',
      emerald: 'from-emerald-500 to-teal-500',
      blue: 'from-blue-500 to-cyan-500',
      amber: 'from-amber-500 to-orange-500',
      zinc: 'from-zinc-700 to-zinc-500',
    }
    return map[accent] ?? 'from-cyan-400 to-blue-500'
  }, [accent])
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative size-8 rounded-full bg-gradient-to-br ${style} ring-2 transition ${
        selected ? 'ring-primary' : 'ring-transparent hover:ring-muted-foreground/30'
      }`}
      aria-label={`Acento ${accent}`}
      title={`Acento ${accent}`}
    >
      {selected ? <Check className="absolute inset-0 m-auto size-4 text-white drop-shadow" /> : null}
    </button>
  )
}

/**
 * Panel de Configuración
 */
export default function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { settings, update, resolvedTheme, toggleTheme, reset } = useSettings()

  if (!open) return null

  return (
    <div className="no-print">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Panel de configuración"
        className="fixed right-0 top-0 h-full w-full sm:w-[420px] z-50 bg-background border-l shadow-xl overflow-auto"
      >
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SettingsIcon className="size-5" />
            <h3 className="text-lg font-semibold">Configuración</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-transparent"
              onClick={toggleTheme}
              title={resolvedTheme === 'dark' ? 'Pasar a claro' : 'Pasar a oscuro'}
            >
              {resolvedTheme === 'dark' ? <Sun className="size-4 mr-2" /> : <Moon className="size-4 mr-2" />}
              Modo
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </header>

        <div className="px-5 py-6 space-y-8">
          {/* Tema */}
          <section>
            <h4 className="font-medium mb-3">Tema</h4>
            <div className="grid grid-cols-3 gap-3">
              <RadioItem
                name="theme"
                value="system"
                checked={settings.theme === 'system'}
                label="Sistema"
                onChange={(v) => update({ theme: v as any })}
              />
              <RadioItem
                name="theme"
                value="light"
                checked={settings.theme === 'light'}
                label="Claro"
                onChange={(v) => update({ theme: v as any })}
              />
              <RadioItem
                name="theme"
                value="dark"
                checked={settings.theme === 'dark'}
                label="Oscuro"
                onChange={(v) => update({ theme: v as any })}
              />
            </div>
          </section>

          {/* Acento */}
          <section>
            <h4 className="font-medium mb-3">Color de acento</h4>
            <div className="flex items-center gap-3">
              {ACCENT_KEYS.map((key) => (
                <AccentSwatch
                  key={key}
                  accent={key}
                  selected={settings.accent === key}
                  onSelect={() => update({ accent: key })}
                />
              ))}
            </div>
          </section>

          {/* Tipografía */}
          <section>
            <h4 className="font-medium mb-3">Tamaño base de fuente</h4>
            <div className="grid grid-cols-3 gap-3">
              <RadioItem
                name="fontScale"
                value="0.95"
                checked={settings.fontScale === 0.95}
                label="−5%"
                onChange={(v) => update({ fontScale: Number(v) as any })}
              />
              <RadioItem
                name="fontScale"
                value="1"
                checked={settings.fontScale === 1}
                label="100%"
                onChange={(v) => update({ fontScale: Number(v) as any })}
              />
              <RadioItem
                name="fontScale"
                value="1.05"
                checked={settings.fontScale === 1.05}
                label="+5%"
                onChange={(v) => update({ fontScale: Number(v) as any })}
              />
            </div>
          </section>

          {/* Radio de bordes */}
          <section>
            <h4 className="font-medium mb-3">Curvatura de bordes</h4>
            <div className="grid grid-cols-3 gap-3">
              <RadioItem
                name="radius"
                value="sm"
                checked={settings.radius === 'sm'}
                label="Pequeño"
                onChange={(v) => update({ radius: v as any })}
              />
              <RadioItem
                name="radius"
                value="md"
                checked={settings.radius === 'md'}
                label="Medio"
                onChange={(v) => update({ radius: v as any })}
              />
              <RadioItem
                name="radius"
                value="lg"
                checked={settings.radius === 'lg'}
                label="Grande"
                onChange={(v) => update({ radius: v as any })}
              />
            </div>
          </section>

          {/* Preferencias de contenido */}
          <section>
            <h4 className="font-medium mb-3">Contenido</h4>
            <div className="space-y-2">
              <CheckItem
                checked={settings.showProjectImages}
                label="Mostrar imágenes de proyectos"
                onChange={(checked) => update({ showProjectImages: checked })}
              />
            </div>
          </section>

          <section className="pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <SlidersHorizontal className="size-4" />
                <span>Tus preferencias se guardan en este dispositivo.</span>
              </div>
              <Button variant="outline" className="bg-transparent" onClick={reset}>
                Restablecer
              </Button>
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}
