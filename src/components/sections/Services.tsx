/**
 * Services: tarjetas con los servicios principales.
 */

import Section from '../common/Section'
import { Code2, Boxes, Cloud } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Services() {
  const { t } = useTranslation('common')

  const items = [
    { icon: Code2, title: t('services.items.webapp.title'), desc: t('services.items.webapp.desc') },
    { icon: Boxes, title: t('services.items.backend.title'), desc: t('services.items.backend.desc') },
    { icon: Cloud, title: t('services.items.cloud.title'), desc: t('services.items.cloud.desc') },
  ]

  return (
    <Section id="services" title={t('services.title')}>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it) => (
          <article key={it.title} className="group rounded-xl glass-card p-6 flex flex-col items-start">
            <div className="p-3 rounded-xl bg-primary/10 mb-4 group-hover:scale-110 transition duration-300">
              <it.icon className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{it.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
