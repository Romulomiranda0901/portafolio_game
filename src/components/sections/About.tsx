/**
 * About: presentación corta con ubicación y años de experiencia.
 */

import Section from '../common/Section'
import { MapPin, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/** Props del About */
interface AboutProps {
  location?: string
  years: number
}

export default function About({ location, years }: AboutProps) {
  const { t } = useTranslation('common')

  return (
    <Section id="about" title={t('about.title')}>
      <div className="grid md:grid-cols-[1fr,260px] gap-8 items-start">
        <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
          {t('about.paragraph')}
        </p>
        <ul className="grid gap-3 p-5 rounded-xl glass-card text-sm">
          {location && (
            <li className="inline-flex items-center gap-2.5">
              <MapPin className="size-4.5 text-primary shrink-0" />
              <span className="font-medium">
                {t('about.locatedIn')} {location}
              </span>
            </li>
          )}
          <li className="inline-flex items-center gap-2.5">
            <Clock className="size-4.5 text-primary shrink-0" />
            <span className="font-medium">
              {t('about.yearsExp', { count: years })}
            </span>
          </li>
        </ul>
      </div>
    </Section>
  )
}
