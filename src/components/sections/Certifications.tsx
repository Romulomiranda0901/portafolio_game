/**
 * Certifications: listado breve de credenciales.
 */

import Section from '../common/Section'
import { Award } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const items = [
  {
    nameEs: 'Máster en Seguridad Informática — Universidad Internacional de La Rioja (UNIR España)',
    nameEn: "Master's in Cybersecurity — International University of La Rioja (UNIR Spain)",
    year: '2025',
  },
  {
    nameEs: 'Liderazgo en la Gestión de Proyectos de Software',
    nameEn: 'Leadership in Software Project Management',
    year: '2026',
  },
  {
    nameEs: 'ISO 27001 (Auditoría y Cumplimiento)',
    nameEn: 'ISO 27001 (Audit & Compliance)',
    year: '2020',
  },
  {
    nameEs: 'Hacking Ético',
    nameEn: 'Ethical Hacking',
    year: '2020',
  },
  {
    nameEs: 'Managed Security',
    nameEn: 'Managed Security',
    year: '2020',
  },
]

export default function Certifications() {
  const { t, i18n } = useTranslation('common')
  const isEs = i18n.language.startsWith('es')

  return (
    <Section id="certifications" title={t('certifications.title')}>
      <ul className="grid md:grid-cols-3 gap-6">
        {items.map((c, idx) => {
          const name = isEs ? c.nameEs : c.nameEn
          return (
            <li key={idx} className="rounded-xl glass-card p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary mt-0.5">
                <Award className="size-5" />
              </div>
              <div>
                <p className="font-semibold text-base leading-snug">{name}</p>
                <p className="text-xs text-muted-foreground mt-1.5">{c.year}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
