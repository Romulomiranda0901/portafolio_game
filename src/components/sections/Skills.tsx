/**
 * Skills: muestra categorías principales con chips.
 */

import Section from '../common/Section'
import { useTranslation } from 'react-i18next'

const skills = {
  frontend: ['React', 'Angular', 'TypeScript', 'Tailwind', 'Shadcn UI'],
  backend: ['Node.js', 'Express', 'Java', 'Spring Boot', 'Laravel', 'PostgreSQL'],
  devops: ['Docker', 'GitHub Actions', 'AWS', 'CI/CD'],
  security: ['Pentesting', 'OWASP', 'ISO 27001', 'Hardening'],
}

export default function Skills() {
  const { t } = useTranslation('common')

  return (
    <Section id="skills" title={t('skills.title')}>
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(skills).map(([key, list]) => (
          <div key={key} className="rounded-xl glass-card p-5">
            <h3 className="font-semibold text-lg mb-4 text-glow-primary">{t(`skills.stacks.${key}`)}</h3>
            <div className="flex flex-wrap gap-2">
              {list.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all duration-300"
                  title={s}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
