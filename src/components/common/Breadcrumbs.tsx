/** 
 * Breadcrumbs: Migas de pan simples para rutas de páginas (/thanks, 404).
 * Solo se usan en páginas fuera del one-page Home.
 */

import { Link, useLocation } from 'react-router'
import { ChevronRight, Home } from 'lucide-react'

/** Segmento de breadcrumb */
interface Crumb {
  label: string
  to?: string
}

/**
 * Genera los crumbs a partir de la ubicación actual.
 * Para este sitio, solo mapeamos algunas rutas conocidas para una UX amigable.
 */
function useCrumbs(): Crumb[] {
  const { pathname } = useLocation()
  // Normalizamos
  const clean = pathname.replace(/\/+$/, '') || '/'
  if (clean === '/') {
    return [{ label: 'Inicio' }]
  }
  if (clean === '/thanks') {
    return [
      { label: 'Inicio', to: '/' },
      { label: 'Gracias' },
    ]
  }
  // Cualquier otra ruta se considera 404
  return [
    { label: 'Inicio', to: '/' },
    { label: '404' },
  ]
}

/**
 * Componente Breadcrumbs
 */
export default function Breadcrumbs() {
  const crumbs = useCrumbs()

  return (
    <nav className="w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-2 text-sm text-muted-foreground">
        <Home className="size-4" />
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1
          return (
            <span key={idx} className="flex items-center gap-2">
              {idx > 0 && <ChevronRight className="size-3.5 opacity-70" />}
              {c.to && !isLast ? (
                <Link className="hover:text-foreground underline underline-offset-2" to={c.to}>
                  {c.label}
                </Link>
              ) : (
                <span className="text-foreground">{c.label}</span>
              )}
            </span>
          )
        })}
      </div>
    </nav>
  )
}
