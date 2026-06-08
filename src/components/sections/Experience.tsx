/**
 * Experience: línea de tiempo simple de experiencias relevantes.
 */

import Section from '../common/Section'
import { Briefcase } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const items = [
  {
    company: 'Credifac Honduras',
    roleEs: 'Lead Full Stack Architect & Developer',
    roleEn: 'Lead Full Stack Architect & Developer',
    periodEs: 'Abril 2026 — Actualidad',
    periodEn: 'April 2026 — Present',
  },
  {
    company: 'UNAN-León',
    roleEs: 'Catedrático Universitario del Área de Ingeniería de Sistemas',
    roleEn: 'University Professor of Systems Engineering',
    periodEs: 'Marzo 2025 — Actualidad',
    periodEn: 'March 2025 — Present',
  },
  {
    company: 'Universidad Padre Gaspar García Laviana',
    roleEs: 'Catedrático Universitario del Área de Ingeniería de Sistemas',
    roleEn: 'University Professor of Systems Engineering',
    periodEs: 'Marzo 2023 — Junio 2024',
    periodEn: 'March 2023 — June 2024',
  },
  {
    company: 'UNAN-León',
    roleEs: 'Full Stack Tech Lead & Coordinador Tecnológico',
    roleEn: 'Full Stack Tech Lead & Technology Coordinator',
    periodEs: '2021 — 2024',
    periodEn: '2021 — 2024',
  },
  {
    company: 'Universidad Padre Gaspar García Laviana',
    roleEs: 'Arquitecto de Sistemas & Coordinador de TI',
    roleEn: 'Systems Architect & IT Coordinator',
    periodEs: '2022 — 2024',
    periodEn: '2022 — 2024',
  },
  {
    company: 'Alcaldía Municipal de León',
    roleEs: 'Senior Full Stack Developer',
    roleEn: 'Senior Full Stack Developer',
    periodEs: '2020 — 2021',
    periodEn: '2020 — 2021',
  },
]

export default function Experience() {
  const { t, i18n } = useTranslation('common')
  const isEs = i18n.language.startsWith('es')

  return (
    <Section id="experience" title={t('experience.title')}>
      <div className="space-y-4">
        {items.map((it, idx) => {
          const role = isEs ? it.roleEs : it.roleEn
          const period = isEs ? it.periodEs : it.periodEn
          return (
            <div key={idx} className="flex items-start gap-4 glass-card rounded-xl p-5">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary mt-0.5">
                <Briefcase className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{role}</h3>
                <p className="text-sm font-medium text-primary mt-0.5">{it.company}</p>
                <p className="text-xs text-muted-foreground mt-1.5">{period}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
