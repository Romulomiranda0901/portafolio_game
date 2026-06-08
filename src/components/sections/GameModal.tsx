import { useEffect } from 'react'
import { X, Terminal, ArrowRight, ShieldCheck, Mail, Briefcase, Award, Cpu } from 'lucide-react'
import { Button } from '../ui/button'

interface GameModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'about' | 'skills' | 'experience' | 'projects' | 'certifications' | 'contact' | null
  title: string
  contentProps?: any
}

export default function GameModal({ isOpen, onClose, type, title, contentProps }: GameModalProps) {
  // Evitar scroll en el body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !type) return null

  // Cerrar presionando Escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Efecto de scanline CRT para todo el modal */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-40 z-10" />

      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-xl glass-card overflow-hidden border-primary/40 shadow-[0_0_50px_rgba(var(--primary),0.15)] animate-zoom-in">
        {/* Cabecera del terminal holográfico */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary/20 bg-muted/30">
          <div className="flex items-center gap-2 text-primary">
            <Terminal className="size-5 animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-muted-foreground">SYSTEM_CORE //</span>
            <h2 className="font-mono text-lg font-bold tracking-tight text-glow-primary uppercase">{title}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-primary/20 hover:text-primary transition-all duration-300 text-muted-foreground"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 font-sans custom-scrollbar bg-card/40">
          {type === 'about' && <AboutContent {...contentProps} />}
          {type === 'skills' && <SkillsContent {...contentProps} />}
          {type === 'experience' && <ExperienceContent {...contentProps} />}
          {type === 'projects' && <ProjectsContent {...contentProps} />}
          {type === 'certifications' && <CertificationsContent {...contentProps} />}
          {type === 'contact' && <ContactContent onClose={onClose} {...contentProps} />}
        </div>

        {/* Pie de modal */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-primary/10 bg-muted/10 font-mono text-[10px] text-muted-foreground gap-4">
          <span>STATUS: SECURE_LINK</span>
          <span>SYSTEM: OK</span>
          <Button size="sm" variant="outline" onClick={onClose} className="border-primary/20 hover:border-primary text-xs h-7">
            [ESC] CERRAR
          </Button>
        </div>
      </div>
    </div>
  )
}

// ---------------- SUB-COMPONENTES DE CONTENIDO ----------------

/** 1. SOBRE MÍ */
function AboutContent({ name, avatarUrl, location }: { name: string; avatarUrl?: string; location?: string }) {
  return (
    <div className="grid md:grid-cols-[180px_1fr] gap-6 items-start">
      <div className="flex flex-col items-center gap-3">
        <div className="size-44 rounded-xl border border-primary/30 p-1.5 bg-muted/40 relative overflow-hidden group shadow-[0_0_20px_rgba(var(--primary),0.1)]">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent z-10 pointer-events-none" />
          <img
            src={avatarUrl || 'https://github.com/Romulomiranda0901.png'}
            alt={name}
            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-all duration-500"
          />
        </div>
        <span className="text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          {location || 'Honduras / Nicaragua'}
        </span>
      </div>

      <div className="space-y-4 font-mono">
        <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
          <p className="text-primary font-bold text-sm mb-1">{`> WHOAMI.TXT`}</p>
          <p className="text-sm text-foreground leading-relaxed font-sans">
            Ingeniero de Software y Arquitecto de Sistemas de élite, especializado en la creación de plataformas web
            escalables, de alto rendimiento y con seguridad militar. Con amplia experiencia docente universitaria y
            desarrollo empresarial, diseño arquitecturas robustas y optimizo el rendimiento de extremo a extremo,
            convirtiendo problemas complejos en productos digitales excepcionales, seguros y listos para millones de usuarios.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 border border-border/40 rounded-lg bg-muted/10">
            <span className="text-muted-foreground block mb-1">ROL PRINCIPAL</span>
            <span className="text-foreground font-semibold font-sans">Lead Full Stack Architect</span>
          </div>
          <div className="p-3 border border-border/40 rounded-lg bg-muted/10">
            <span className="text-muted-foreground block mb-1">ESPECIALIDAD</span>
            <span className="text-foreground font-semibold font-sans">Ciberseguridad & Web</span>
          </div>
          <div className="p-3 border border-border/40 rounded-lg bg-muted/10">
            <span className="text-muted-foreground block mb-1">EXPERIENCIA</span>
            <span className="text-foreground font-semibold font-sans">4+ Años Profesional</span>
          </div>
          <div className="p-3 border border-border/40 rounded-lg bg-muted/10">
            <span className="text-muted-foreground block mb-1">PROYECTOS</span>
            <span className="text-foreground font-semibold font-sans">50+ Repositorios</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** 2. HABILIDADES */
function SkillsContent() {
  const skills = {
    frontend: ['React', 'Angular', 'TypeScript', 'Tailwind', 'Shadcn UI'],
    backend: ['Node.js', 'Express', 'Java', 'Spring Boot', 'Laravel', 'PostgreSQL'],
    devops: ['Docker', 'GitHub Actions', 'AWS', 'CI/CD'],
    security: ['Pentesting', 'OWASP', 'ISO 27001', 'Hardening'],
  }

  const icons = {
    frontend: <Cpu className="size-4 text-cyan-400" />,
    backend: <Terminal className="size-4 text-emerald-400" />,
    devops: <ArrowRight className="size-4 text-indigo-400" />,
    security: <ShieldCheck className="size-4 text-rose-400" />,
  }

  const titles = {
    frontend: 'Desarrollo Frontend',
    backend: 'Arquitectura Backend',
    devops: 'Operaciones e Infraestructura Cloud',
    security: 'Seguridad Informática & Pentesting',
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {Object.entries(skills).map(([key, list]) => (
        <div key={key} className="rounded-lg border border-primary/20 bg-muted/10 p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
            {icons[key as keyof typeof icons]}
          </div>
          <h3 className="font-mono text-sm font-bold mb-4 flex items-center gap-2 text-primary uppercase">
            {icons[key as keyof typeof icons]}
            {titles[key as keyof typeof titles]}
          </h3>
          <div className="flex flex-wrap gap-2">
            {list.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all duration-300 shadow-[0_0_10px_rgba(var(--primary),0.02)]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/** 3. EXPERIENCIA */
function ExperienceContent() {
  const items = [
    {
      company: 'Credifac Honduras',
      role: 'Lead Full Stack Architect & Developer',
      period: 'Abril 2026 — Actualidad',
      details: 'Liderazgo técnico en la arquitectura de microservicios y refactorización del core financiero. Implementación de estándares de ciberseguridad corporativos y optimización de base de datos MySQL distribuidas.'
    },
    {
      company: 'UNAN-León',
      role: 'Catedrático Universitario de Ingeniería de Sistemas',
      period: 'Marzo 2025 — Actualidad',
      details: 'Profesor titular impartiendo asignaturas avanzadas de diseño de software, seguridad de la información y arquitecturas web.'
    },
    {
      company: 'Universidad Padre Gaspar García Laviana',
      role: 'Catedrático Universitario de Ingeniería de Sistemas',
      period: 'Marzo 2023 — Junio 2024',
      details: 'Docencia e impartición de cátedras sobre lenguajes de programación y bases de datos relacionales.'
    },
    {
      company: 'UNAN-León',
      role: 'Full Stack Tech Lead & Coordinador Tecnológico',
      period: '2021 — 2024',
      details: 'Dirección del equipo de desarrollo, implementación de sistemas académicos internos y automatización de despliegues (CI/CD).'
    },
    {
      company: 'Universidad Padre Gaspar García Laviana',
      role: 'Arquitecto de Sistemas & Coordinador de TI',
      period: '2022 — 2024',
      details: 'Diseño e integración de la infraestructura del campus universitario, administración de servidores locales y políticas de seguridad perimetral.'
    },
    {
      company: 'Alcaldía Municipal de León',
      role: 'Senior Full Stack Developer',
      period: '2020 — 2021',
      details: 'Desarrollo de módulos de catastro municipal y portales web ciudadanos utilizando Laravel, React y PostgreSQL.'
    },
  ]

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {items.map((it, idx) => (
        <div key={idx} className="flex gap-4 relative group">
          {/* Timeline bar */}
          {idx < items.length - 1 && (
            <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 to-transparent" />
          )}

          <div className="flex-shrink-0 size-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all duration-300 shadow-[0_0_15px_rgba(var(--primary),0.05)]">
            <Briefcase className="size-5" />
          </div>

          <div className="flex-1 p-5 rounded-lg border border-border/40 bg-muted/10 group-hover:border-primary/20 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <h3 className="font-bold text-base text-glow-primary">{it.role}</h3>
              <span className="text-xs font-mono text-muted-foreground">{it.period}</span>
            </div>
            <p className="text-xs font-semibold text-primary/80 mb-2">{it.company}</p>
            <p className="text-sm text-muted-foreground leading-relaxed font-sans">{it.details}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/** 4. PROYECTOS */
function ProjectsContent() {
  const externalProjects = [
    {
      name: "Roma Chess",
      url: "https://roma-chess.onrender.com/",
      desc: "Juego de ajedrez interactivo con integración de Inteligencia Artificial (Stockfish), desarrollado utilizando mi propio framework de backend en Python llamado ROMA Framework (inspirado en Laravel).",
      tags: ["Python", "ROMA Framework", "Stockfish AI", "WebSockets"],
      badge: "ROMA Framework"
    },
    {
      name: "Roma Tasks",
      url: "https://roma-tasks.onrender.com/",
      desc: "Administrador de tareas y proyectos construido sobre ROMA Framework en Python, con soporte para autenticación de sesiones, operaciones CRUD y base de datos relacional.",
      tags: ["Python", "ROMA Framework", "SQLite", "MVC"],
      badge: "ROMA Framework"
    },
    {
      name: "Sistema de Tickets",
      url: "https://sistema-de-tickets-1.onrender.com/",
      desc: "Sistema completo para gestión de soporte técnico y reporte de tickets, permitiendo la creación de incidencias, asignación de técnicos, prioridad y seguimiento en tiempo real.",
      tags: ["Node.js", "React", "Express", "MongoDB"],
      badge: "Full Stack"
    },
    {
      name: "Tetris",
      url: "https://tetris-jugo.onrender.com",
      desc: "Recreación interactiva del clásico juego Tetris en el navegador con interfaz minimalista y moderna.",
      tags: ["HTML5 Canvas", "JavaScript", "CSS3"],
      badge: "Front-end Game"
    },
    {
      name: "Rick and Morty Portal View",
      url: "https://rickandmortyportalview.onrender.com",
      desc: "Explorador de personajes y episodios de la serie Rick and Morty, conectando de forma fluida con la API oficial.",
      tags: ["React", "API REST", "TailwindCSS"],
      badge: "API REST"
    },
    {
      name: "PokeAPI",
      url: "https://pokeapi-u8ik.onrender.com",
      desc: "Pokédex interactiva con estadísticas detalladas de Pokémon, buscador y filtrado por tipos en tiempo real.",
      tags: ["React", "PokeAPI", "CSS Grid"],
      badge: "API REST"
    },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {externalProjects.map((project, index) => (
        <article key={index} className="group flex flex-col justify-between rounded-lg border border-primary/20 bg-muted/10 p-5 relative overflow-hidden transition-all duration-300 hover:border-primary/40">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <h4 className="font-bold tracking-tight text-base group-hover:text-primary transition duration-300">
                {project.name}
              </h4>
              {project.badge && (
                <span className="text-[9px] font-mono font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                  {project.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              {project.desc}
            </p>
          </div>

          <div className="mt-auto pt-3 border-t border-border/10">
            <div className="flex flex-wrap gap-1 mb-4">
              {project.tags.map((tag) => (
                <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted/65 text-muted-foreground border border-border/10">
                  {tag}
                </span>
              ))}
            </div>
            <a href={project.url} target="_blank" rel="noreferrer" className="block w-full">
              <Button size="sm" variant="secondary" className="w-full justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-xs h-8">
                [COMPILAR SIMULACIÓN]
              </Button>
            </a>
          </div>
        </article>
      ))}
    </div>
  )
}

/** 5. CERTIFICACIONES */
function CertificationsContent() {
  const items = [
    {
      name: 'Máster en Seguridad Informática — Universidad Internacional de La Rioja (UNIR España)',
      year: '2025',
    },
    {
      name: 'Liderazgo en la Gestión de Proyectos de Software',
      year: '2026',
    },
    {
      name: 'ISO 27001 (Auditoría y Cumplimiento)',
      year: '2020',
    },
    {
      name: 'Hacking Ético',
      year: '2020',
    },
    {
      name: 'Managed Security',
      year: '2020',
    },
  ]

  return (
    <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {items.map((c, idx) => (
        <div key={idx} className="rounded-lg border border-border/40 bg-muted/10 p-5 flex items-start gap-4 hover:border-primary/20 transition-all duration-300">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20 mt-0.5">
            <Award className="size-5" />
          </div>
          <div>
            <p className="font-semibold text-sm leading-snug">{c.name}</p>
            <p className="text-xs text-muted-foreground mt-2 font-mono">EMISIÓN: {c.year}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/** 6. CONTACTO */
function ContactContent({ onClose }: { onClose: () => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Mensaje simulado correctamente. ¡Gracias por contactar!')
    onClose()
  }

  return (
    <div className="max-w-md mx-auto p-6 border border-primary/20 bg-muted/10 rounded-lg relative">
      <div className="absolute top-0 right-0 p-3 opacity-20">
        <Mail className="size-6 text-primary" />
      </div>
      <h3 className="font-mono text-sm font-bold mb-4 text-glow-primary text-primary flex items-center gap-2">
        <Mail className="size-4 animate-pulse" />
        {`> ENVIAR_MENSAJE.SH`}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono text-muted-foreground uppercase mb-1">Nombre del Remitente</label>
          <input
            type="text"
            required
            className="w-full bg-background border border-border/60 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary font-sans"
            placeholder="Ej. John Doe"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-muted-foreground uppercase mb-1">Email de Retorno</label>
          <input
            type="email"
            required
            className="w-full bg-background border border-border/60 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary font-sans"
            placeholder="johndoe@example.com"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-muted-foreground uppercase mb-1">Cuerpo del Mensaje</label>
          <textarea
            required
            rows={4}
            className="w-full bg-background border border-border/60 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary font-sans resize-none"
            placeholder="Describe tu propuesta o comentario..."
          />
        </div>
        <Button type="submit" className="w-full font-mono text-xs py-5">
          [TRANSMITIR_MENSAJE]
        </Button>
      </form>
    </div>
  )
}
