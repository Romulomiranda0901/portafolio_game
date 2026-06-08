/**
 * Testimonials: testimonios estáticos breves.
 */

import Section from '../common/Section'
import { Quote } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const items = [
  {
    quote:
      'Entrega resultados consistentes y mantiene una comunicación clara con las áreas involucradas.',
    author: 'Líder de Proyecto',
  },
  { quote: 'Excelente criterio técnico y foco en seguridad desde el diseño.', author: 'CTO' },
]

export default function Testimonials() {
  const { t } = useTranslation('common')

  return (
    <Section id="testimonials" title={t('testimonials.title')}>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it, idx) => (
          <figure key={idx} className="rounded-lg border p-4">
            <Quote className="size-5 text-primary" />
            <blockquote className="mt-2 text-sm text-muted-foreground">“{it.quote}”</blockquote>
            <figcaption className="text-xs mt-1">— {it.author}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}
