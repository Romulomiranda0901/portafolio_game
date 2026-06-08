/**
 * Hero: cabecera con nombre, rol, avatar y CTAs principales.
 */

import { Github, Download } from 'lucide-react'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'

/** Props del Hero */
interface HeroProps {
  name: string
  title: string
  avatarUrl?: string
  cvUrl: string
  githubUrl: string
}

export default function Hero({ name, title, avatarUrl, cvUrl, githubUrl }: HeroProps) {
  const { t } = useTranslation('common')

  return (
    <section id="home" className="mx-auto max-w-6xl px-4 py-12 md:py-20 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-8 md:gap-12">
        <div className="relative size-32 md:size-40 rounded-full overflow-hidden ring-4 ring-primary/80 ring-offset-4 ring-offset-background hover:scale-105 transition-all duration-500 shadow-xl shadow-primary/10 group">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
          ) : (
            <img src="https://pub-cdn.sider.ai/u/U09GHALYW1O/web-coder/689be3e3a616cfbf06700a6d/resource/447e8043-97cb-4f0d-8d79-c6d4cdb99a1d.jpg" className="object-cover w-full h-full group-hover:scale-110 transition duration-500" alt={name} />
          )}
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3 animate-pulse">
            <span className="size-2 rounded-full bg-emerald-500" />
            {t('hero.status', { defaultValue: 'Disponible para trabajar' })}
          </div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">{t('hero.hello')}</p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent mt-1">{name}</h1>
          <p className="text-lg md:text-xl font-medium text-muted-foreground/95 mt-2 max-w-2xl leading-relaxed">{t('hero.role')}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href={githubUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" className="bg-transparent hover:bg-primary/5 hover:text-primary border-primary/20 hover:border-primary transition duration-300">
                <Github className="size-4 mr-2" />
                {t('actions.githubProfile')}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
