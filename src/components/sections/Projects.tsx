import Section from "../common/Section"
import { useEffect, useMemo, useState } from "react"
import { Button } from "../ui/button"
import { GitFork, Globe, Star, Github, ImageOff, Filter } from "lucide-react"
import { useSettings } from "../../contexts/SettingsContext"
import { useTranslation } from "react-i18next"

/** Props */
interface ProjectsProps {
  /** Usuario de GitHub */
  username: string
}

/** Modelo mínimo de repo público de GitHub */
interface Repo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  homepage: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics?: string[]
  archived: boolean
}

/** Obtiene repos del usuario */
async function fetchRepos(username: string): Promise<Repo[]> {
  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!res.ok) throw new Error('GitHub API error')
  const data = (await res.json()) as Repo[]
  // Filtramos forks archivados irrelevantes
  return data.filter((r) => !r.archived)
}

/** Card de repositorio */
function RepoCard({ repo, showImg }: { repo: Repo; showImg: boolean }) {
  // Imagen placeholder basada en el nombre del repo
  const imgSrc = `https://pub-cdn.sider.ai/u/U09GHALYW1O/web-coder/689be3e3a616cfbf06700a6d/resource/b496038d-4470-4684-af0e-51a462b2d307.jpg`
  return (
    <article className="group rounded-xl overflow-hidden glass-card transition flex flex-col justify-between h-full">
      <div>
        {showImg ? (
          <div className="aspect-[16/9] w-full bg-muted overflow-hidden relative">
            <img src={imgSrc} alt={repo.name} className="object-cover w-full h-full group-hover:scale-105 transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
          </div>
        ) : (
          <div className="aspect-[16/9] w-full bg-muted/30 grid place-content-center">
            <ImageOff className="size-6 text-muted-foreground" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-lg tracking-tight group-hover:text-primary transition duration-300">{repo.name}</h4>
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded-md shrink-0">
              <span className="inline-flex items-center gap-1">
                <Star className="size-3.5 text-amber-400" /> {repo.stargazers_count}
              </span>
              <span className="inline-flex items-center gap-1">
                <GitFork className="size-3.5 text-blue-400" /> {repo.forks_count}
              </span>
            </div>
          </div>
          {repo.description ? (
            <p className="mt-2.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{repo.description}</p>
          ) : null}
        </div>
      </div>
      <div className="p-5 pt-0 mt-auto">
        <div className="flex items-center gap-2 border-t border-border/20 pt-4">
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent border-primary/20 hover:border-primary hover:text-primary transition-all duration-300">
              <Github className="size-4 mr-2" />
              GitHub
            </Button>
          </a>
          {repo.homepage ? (
            <a href={repo.homepage} target="_blank" rel="noreferrer" className="flex-1">
              <Button variant="secondary" className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Globe className="size-4 mr-2" />
                Demo
              </Button>
            </a>
          ) : null}
          {repo.language ? (
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0 ml-auto">
              {repo.language}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

/**
 * Sección principal
 */
export default function Projects({ username }: ProjectsProps) {
  const { t, i18n } = useTranslation('common')
  const { settings } = useSettings()
  const [repos, setRepos] = useState<Repo[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('All')

  // Cargar repos
  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    fetchRepos(username)
      .then((data) => mounted && setRepos(data))
      .catch((e) => mounted && setError(e?.message || 'Error'))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [username])

  // Lenguajes únicos
  const languages = useMemo(() => {
    const set = new Set<string>()
      ; (repos || []).forEach((r) => r.language && set.add(r.language))
    return ['All', ...Array.from(set).sort()]
  }, [repos])

  // Filtrado por lenguaje
  const filtered = useMemo(() => {
    if (!repos) return []
    if (filter === 'All') return repos
    return repos.filter((r) => r.language === filter)
  }, [repos, filter])

  // Proyectos externos
  const externalProjects = [
    {
      name: "Roma Chess",
      url: "https://roma-chess.onrender.com/",
      descEs: "Juego de ajedrez interactivo con integración de Inteligencia Artificial (Stockfish), desarrollado utilizando mi propio framework de backend en Python llamado ROMA Framework (inspirado en Laravel).",
      descEn: "Interactive chess game with AI integration (Stockfish), built using my custom Python backend framework called ROMA Framework (inspired by Laravel).",
      tags: ["Python", "ROMA Framework", "Stockfish AI", "WebSockets"],
      badge: "ROMA Framework"
    },
    {
      name: "Roma Tasks",
      url: "https://roma-tasks.onrender.com/",
      descEs: "Administrador de tareas y proyectos construido sobre ROMA Framework en Python, con soporte para autenticación de sesiones, operaciones CRUD y base de datos relacional.",
      descEn: "Task and project manager built on ROMA Framework in Python, supporting session-based authentication, CRUD operations, and relational database.",
      tags: ["Python", "ROMA Framework", "SQLite", "MVC"],
      badge: "ROMA Framework"
    },
    {
      name: "Sistema de Tickets",
      url: "https://sistema-de-tickets-1.onrender.com/",
      descEs: "Sistema completo para gestión de soporte técnico y reporte de tickets, permitiendo la creación de incidencias, asignación de técnicos, prioridad y seguimiento en tiempo real.",
      descEn: "Full-stack helpdesk and ticket management system, enabling ticket creation, agent assignments, priority setting, and real-time status tracking.",
      tags: ["Node.js", "React", "Express", "MongoDB"],
      badge: "Full Stack"
    },
    {
      name: "Tetris",
      url: "https://tetris-jugo.onrender.com",
      descEs: "Recreación interactiva del clásico juego Tetris en el navegador con interfaz minimalista y moderna.",
      descEn: "Interactive recreation of the classic Tetris game in the browser with a minimalist and modern UI.",
      tags: ["HTML5 Canvas", "JavaScript", "CSS3"]
    },
    {
      name: "Rick and Morty Portal View",
      url: "https://rickandmortyportalview.onrender.com",
      descEs: "Explorador de personajes y episodios de la serie Rick and Morty, conectando de forma fluida con la API oficial.",
      descEn: "Character and episode explorer for the Rick and Morty show, consuming the official REST API.",
      tags: ["React", "API REST", "TailwindCSS"]
    },
    {
      name: "PokeAPI",
      url: "https://pokeapi-u8ik.onrender.com",
      descEs: "Pokédex interactiva con estadísticas detalladas de Pokémon, buscador y filtrado por tipos en tiempo real.",
      descEn: "Interactive Pokédex with detailed Pokémon stats, search functionality, and real-time type filtering.",
      tags: ["React", "PokeAPI", "CSS Grid"]
    },
    {
      name: "Chat App",
      url: "https://chat-app-1-034c.onrender.com",
      descEs: "Aplicación de chat en tiempo real con salas personalizadas e interfaz de mensajería fluida.",
      descEn: "Real-time chat application featuring custom rooms and a fluid messaging user interface.",
      tags: ["Node.js", "Socket.io", "React", "Express"]
    }
  ];

  return (
    <Section id="projects" title={t('projects.title')}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="size-4" />
          <span>{t('projects.filterBy', { defaultValue: 'Filtrar por lenguaje' })}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => {
            const active = filter === lang
            return (
              <Button
                key={lang}
                size="sm"
                variant={active ? 'secondary' : 'outline'}
                className={active ? '' : 'bg-transparent'}
                onClick={() => setFilter(lang)}
              >
                {lang}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg border overflow-hidden">
                <div className="aspect-[16/9] bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-2/3 bg-muted rounded" />
                  <div className="h-3 w-full bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-sm text-destructive">GitHub: {error}</div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('projects.empty')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((repo) => (
              <RepoCard key={repo.id} repo={repo} showImg={settings.showProjectImages} />
            ))}
          </div>
        )}
      </div>

      {/* Sección de Proyectos Externos */}
      <div className="mt-12">
        <h3 className="font-semibold tracking-tight text-xl mb-4">
          {t('projects.externalProjects', { defaultValue: 'Proyectos Externos' })}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {externalProjects.map((project, index) => {
            const isEs = i18n.language.startsWith('es')
            const desc = isEs ? project.descEs : project.descEn
            return (
              <article key={index} className="group flex flex-col justify-between rounded-xl glass-card p-6 relative overflow-hidden h-full">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="font-bold tracking-tight text-lg group-hover:text-primary transition duration-300">
                      {project.name}
                    </h4>
                    {project.badge && (
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                        {project.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/20">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-semibold px-2 py-1 rounded bg-muted/65 text-muted-foreground border border-border/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={project.url} target="_blank" rel="noreferrer" className="w-full">
                      <Button variant="secondary" className="w-full justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                        <Globe className="size-4 mr-2 animate-pulse" />
                        Demo
                      </Button>
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </Section>
  )
}