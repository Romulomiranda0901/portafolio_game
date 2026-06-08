/**
 * Hook useScrollSpy: observa secciones por id y devuelve la id activa según el viewport.
 * Usa IntersectionObserver para rendimiento y precisión.
 */

import { useEffect, useState } from 'react'

/**
 * Observa los elementos con ids proporcionados y retorna la id visible priorizando la que más interseca.
 */
export default function useScrollSpy(ids: string[], rootMargin = '-40% 0px -50% 0px') {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) setActive(visible.target.id)
      },
      { rootMargin, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids, rootMargin])

  return active
}
