/**
 * Section: envoltorio con espaciado, título y ancla para cada sección de la landing.
 */

import type { PropsWithChildren, ReactNode } from 'react'

/** Props para Section */
interface SectionProps {
  id: string
  title?: ReactNode
  subtitle?: ReactNode
  className?: string
}

export default function Section({ id, title, subtitle, className, children }: PropsWithChildren<SectionProps>) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-4 py-10 md:py-14 scroll-mt-20 ${className ?? ''}`}>
      {(title || subtitle) && (
        <header className="mb-8 relative">
          {title ? (
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-gradient-to-b from-primary to-purple-600 rounded-full" />
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                {title}
              </h2>
            </div>
          ) : null}
          {subtitle ? <p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-base leading-relaxed">{subtitle}</p> : null}
        </header>
      )}
      {children}
    </section>
  )
}
