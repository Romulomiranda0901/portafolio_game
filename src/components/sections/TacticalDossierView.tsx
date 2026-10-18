/**
 * Vista de Dossier Ejecutivo (TacticalDossierView).
 * Diseñada para reclutadores y líderes de ingeniería que desean consultar
 * todo el expediente de Romulo Miranda en una consola holográfica directa.
 */

import { useState } from 'react'
import {
  Terminal,
  Cpu,
  Briefcase,
  Layers,
  Award,
  Send,
  Compass,
  FileDown,
  Github,
  Mail,
  ExternalLink,
  ShieldCheck,
  Check,
  Copy,
  Sparkles,
} from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { soundEngine } from '../../lib/soundEngine'

interface TacticalDossierViewProps {
  name: string
  avatarUrl?: string
  location?: string
  onSwitchToGame: () => void
}

export default function TacticalDossierView({
  name,
  avatarUrl,
  location,
  onSwitchToGame,
}: TacticalDossierViewProps) {
  const [activeTab, setActiveTab] = useState<'bio' | 'skills' | 'experience' | 'projects' | 'creds' | 'contact'>('bio')
  const [copied, setCopied] = useState(false)

  const email = 'romulomiranda20092009@gmail.com'

  const handleCopy = () => {
    soundEngine.play('chirp')
    navigator.clipboard.writeText(email)
    setCopied(true)
    toast.success('Correo copiado al portapapeles.')
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { id: 'bio', label: 'NÚCLEO BIO', icon: <Terminal className="size-3.5" /> },
    { id: 'skills', label: 'COMPETENCIAS', icon: <Cpu className="size-3.5" /> },
    { id: 'experience', label: 'EXPERIENCIA', icon: <Briefcase className="size-3.5" /> },
    { id: 'projects', label: 'PROYECTOS', icon: <Layers className="size-3.5" /> },
    { id: 'creds', label: 'CREDENCIALES', icon: <Award className="size-3.5" /> },
    { id: 'contact', label: 'TRANSMISIÓN', icon: <Send className="size-3.5" /> },
  ] as const

  return (
    <div className="w-full h-full overflow-y-auto bg-[#030712] text-[#dfe1f8] p-4 sm:p-6 lg:p-8 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Banner Superior de Consola */}
        <div className="rounded-xl border border-cyan-500/30 bg-[#060919]/90 p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(0,242,254,0.12)] relative overflow-hidden">
          {/* Retículas en las esquinas */}
          <div className="absolute top-1 left-2 font-mono text-[9px] text-cyan-500/40">+</div>
          <div className="absolute top-1 right-2 font-mono text-[9px] text-cyan-500/40">+</div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative size-24 sm:size-28 rounded-lg border-2 border-cyan-400 p-1 bg-[#0a0d20] shadow-[0_0_20px_rgba(0,242,254,0.3)]">
                <img
                  src={avatarUrl || 'https://github.com/Romulomiranda0901.png'}
                  alt={name}
                  className="w-full h-full object-cover rounded"
                />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-cyan-500 text-black">
                  OMEGA-7
                </span>
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white glow-text-cyan">
                    {name}
                  </h1>
                </div>
                <p className="font-mono text-xs sm:text-sm text-cyan-300 font-semibold mb-2">
                  Lead Full Stack Architect & Ciberseguridad
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[10px] font-mono text-muted-foreground">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                    {location || 'Honduras / Nicaragua'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    4+ Años de Éxito Empresarial
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
                    50+ Repositorios de Código
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
              <Button
                onClick={() => {
                  soundEngine.play('warp')
                  onSwitchToGame()
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs uppercase tracking-wider h-10 px-4 shadow-[0_0_20px_rgba(0,242,254,0.3)]"
              >
                <Compass className="size-4 mr-1.5" />
                EXPLORACIÓN 3D
              </Button>

              <a
                href="Romulo_Miranda_CV_2025.pdf"
                download="Romulo_Miranda_CV_2025.pdf"
                target="_blank"
                rel="noreferrer"
                onClick={() => soundEngine.play('chirp')}
              >
                <Button
                  variant="outline"
                  className="border-cyan-500/40 text-cyan-300 bg-cyan-950/20 hover:bg-cyan-500/20 h-10 px-4 text-xs font-mono"
                >
                  <FileDown className="size-4 mr-1.5" />
                  DESCARGAR CV
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Barra de Pestañas Tácticas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-cyan-500/20 font-mono text-xs select-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.play('click')
                setActiveTab(tab.id)
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)] font-bold'
                  : 'border-border/30 bg-black/40 text-muted-foreground hover:text-white hover:border-cyan-500/30'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Contenido de la Pestaña Activa */}
        <div className="p-6 rounded-xl border border-cyan-500/25 bg-[#060919]/90 backdrop-blur-xl shadow-xl min-h-[400px]">
          {/* 1. BIO */}
          {activeTab === 'bio' && (
            <div className="space-y-6 font-mono">
              <div className="p-5 rounded-lg border border-cyan-500/20 bg-[#0a0d20]">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-cyan-500/15">
                  <span className="text-cyan-400 font-bold text-xs">{`> BITACORA_PERFIL // ARCHITECT_SUMMARY`}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">CLEARANCE: OMEGA-7</span>
                </div>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-sans">
                  Ingeniero de Software y Arquitecto de Sistemas de élite, especializado en la creación de plataformas web
                  escalables, de alto rendimiento y con seguridad militar. Con amplia experiencia docente universitaria y
                  desarrollo empresarial, diseño arquitecturas robustas y optimizo el rendimiento de extremo a extremo,
                  convirtiendo problemas complejos en productos digitales excepcionales, seguros y listos para millones de usuarios.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 border border-cyan-500/20 rounded-lg bg-black/40">
                  <span className="text-2xl font-display font-bold text-cyan-400 block mb-1">98%</span>
                  <span className="text-xs text-muted-foreground">Arquitectura Software</span>
                </div>
                <div className="p-4 border border-cyan-500/20 rounded-lg bg-black/40">
                  <span className="text-2xl font-display font-bold text-purple-400 block mb-1">95%</span>
                  <span className="text-xs text-muted-foreground">Ciberseguridad ISO</span>
                </div>
                <div className="p-4 border border-cyan-500/20 rounded-lg bg-black/40">
                  <span className="text-2xl font-display font-bold text-emerald-400 block mb-1">96%</span>
                  <span className="text-xs text-muted-foreground">Backend & Cloud</span>
                </div>
                <div className="p-4 border border-cyan-500/20 rounded-lg bg-black/40">
                  <span className="text-2xl font-display font-bold text-rose-400 block mb-1">100%</span>
                  <span className="text-xs text-muted-foreground">Compromiso de Entrega</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. SKILLS */}
          {activeTab === 'skills' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-cyan-500/25 bg-[#0a0d20]">
                <h3 className="font-display text-sm font-bold text-cyan-400 mb-3 uppercase flex items-center gap-2">
                  <Cpu className="size-4" /> Core Frontend Cuántico
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['React 18 / 19', 'TypeScript', 'TailwindCSS', 'HTML5 Canvas', 'Web Audio API', 'Next.js', 'Vite', 'Redux'].map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg border border-emerald-500/25 bg-[#0a0d20]">
                <h3 className="font-display text-sm font-bold text-emerald-400 mb-3 uppercase flex items-center gap-2">
                  <Terminal className="size-4" /> Core Backend & Microservicios
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Node.js', 'Express', 'Laravel / PHP', 'Python / ROMA Framework', 'Java Spring Boot', 'WebSockets', 'REST APIs', 'GraphQL'].map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg border border-rose-500/25 bg-[#0a0d20]">
                <h3 className="font-display text-sm font-bold text-rose-400 mb-3 uppercase flex items-center gap-2">
                  <ShieldCheck className="size-4" /> Core Ciberseguridad & DevOps
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['ISO 27001', 'Pentesting Ético', 'Docker & Compose', 'CI/CD Pipelines', 'AWS Cloud', 'OWASP Hardening', 'Linux Server'].map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg border border-amber-500/25 bg-[#0a0d20]">
                <h3 className="font-display text-sm font-bold text-amber-400 mb-3 uppercase flex items-center gap-2">
                  <Layers className="size-4" /> Core Bases de Datos & Escalabilidad
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['PostgreSQL', 'MySQL Enterprise', 'MongoDB NoSQL', 'Redis Cache', 'Diseño Relacional', 'Optimización de Índices'].map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. EXPERIENCIA */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              {[
                {
                  company: 'Credifac Honduras',
                  role: 'Lead Full Stack Architect & Developer',
                  period: 'Abril 2026 — Actualidad',
                  details: 'Liderazgo técnico en la arquitectura de microservicios y refactorización del core financiero. Implementación de estándares de ciberseguridad corporativos y optimización de base de datos MySQL distribuidas.',
                },
                {
                  company: 'UNAN-León',
                  role: 'Catedrático Universitario de Ingeniería de Sistemas',
                  period: 'Marzo 2025 — Actualidad',
                  details: 'Profesor titular impartiendo asignaturas avanzadas de diseño de software, seguridad de la información y arquitecturas web para nuevas generaciones de ingenieros.',
                },
                {
                  company: 'Universidad Padre Gaspar García Laviana',
                  role: 'Catedrático Universitario de Ingeniería de Sistemas',
                  period: 'Marzo 2023 — Junio 2024',
                  details: 'Docencia e impartición de cátedras sobre lenguajes de programación, ingeniería de requisitos y bases de datos relacionales.',
                },
                {
                  company: 'UNAN-León',
                  role: 'Full Stack Tech Lead & Coordinador Tecnológico',
                  period: '2021 — 2024',
                  details: 'Dirección del equipo de desarrollo, implementación de sistemas académicos internos y automatización de despliegues continuos (CI/CD) para alta concurrencia.',
                },
                {
                  company: 'Universidad Padre Gaspar García Laviana',
                  role: 'Arquitecto de Sistemas & Coordinador de TI',
                  period: '2022 — 2024',
                  details: 'Diseño e integración de la infraestructura del campus universitario, administración de servidores locales y políticas de seguridad perimetral.',
                },
                {
                  company: 'Alcaldía Municipal de León',
                  role: 'Senior Full Stack Developer',
                  period: '2020 — 2021',
                  details: 'Desarrollo de módulos de catastro municipal y portales web ciudadanos utilizando Laravel, React y PostgreSQL con altos estándares de resiliencia.',
                },
              ].map((it, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-cyan-500/20 bg-[#0a0d20]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h4 className="font-display font-bold text-white text-sm sm:text-base">{it.role}</h4>
                    <span className="font-mono text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {it.period}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-purple-300 font-semibold mb-2">{it.company}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{it.details}</p>
                </div>
              ))}
            </div>
          )}

          {/* 4. PROYECTOS */}
          {activeTab === 'projects' && (
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  name: 'Roma Chess',
                  url: 'https://roma-chess.onrender.com/',
                  desc: 'Juego de ajedrez interactivo con integración de Inteligencia Artificial (Stockfish), desarrollado utilizando mi propio framework de backend en Python llamado ROMA Framework (inspirado en Laravel).',
                  tags: ['Python', 'ROMA Framework', 'Stockfish AI', 'WebSockets'],
                  badge: 'ROMA Framework',
                },
                {
                  name: 'Roma Tasks',
                  url: 'https://roma-tasks.onrender.com/',
                  desc: 'Administrador de tareas y proyectos construido sobre ROMA Framework en Python, con soporte para autenticación de sesiones, operaciones CRUD y base de datos relacional.',
                  tags: ['Python', 'ROMA Framework', 'SQLite', 'MVC'],
                  badge: 'ROMA Framework',
                },
                {
                  name: 'Sistema de Tickets',
                  url: 'https://sistema-de-tickets-1.onrender.com/',
                  desc: 'Sistema completo para gestión de soporte técnico y reporte de tickets, permitiendo la creación de incidencias, asignación de técnicos, prioridad y seguimiento en tiempo real.',
                  tags: ['Node.js', 'React', 'Express', 'MongoDB'],
                  badge: 'Enterprise Full Stack',
                },
                {
                  name: 'Tetris Arcade',
                  url: 'https://tetris-jugo.onrender.com',
                  desc: 'Recreación interactiva del clásico juego Tetris en el navegador con interfaz minimalista, renderizado en HTML5 Canvas y física fluida.',
                  tags: ['HTML5 Canvas', 'JavaScript', 'CSS3 Engine'],
                  badge: 'Canvas Engine',
                },
                {
                  name: 'Rick and Morty Portal View',
                  url: 'https://rickandmortyportalview.onrender.com',
                  desc: 'Explorador de personajes y dimensiones de la serie Rick and Morty, conectando en tiempo real con la API REST oficial.',
                  tags: ['React', 'API REST', 'TailwindCSS'],
                  badge: 'REST Client',
                },
                {
                  name: 'PokeAPI Realtime Matrix',
                  url: 'https://pokeapi-u8ik.onrender.com',
                  desc: 'Pokédex interactiva con estadísticas detalladas de Pokémon, buscador instantáneo y filtrado por elementos reactivos.',
                  tags: ['React', 'PokeAPI', 'CSS Grid'],
                  badge: 'Reactive Web',
                },
              ].map((p, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-cyan-500/25 bg-[#0a0d20] flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-display font-bold text-white text-sm">{p.name}</h4>
                      <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 uppercase">
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-cyan-500/15">
                    <a href={p.url} target="_blank" rel="noreferrer" onClick={() => soundEngine.play('warp')}>
                      <Button size="sm" className="w-full bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black font-mono text-[11px] font-bold border border-cyan-500/30 gap-1.5 h-8">
                        <span>[COMPILAR SIMULACIÓN]</span>
                        <ExternalLink className="size-3" />
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. CREDENCIALES */}
          {activeTab === 'creds' && (
            <div className="grid sm:grid-cols-2 gap-4 font-mono">
              {[
                { name: 'Máster en Seguridad Informática', issuer: 'UNIR España', year: '2025', badge: 'MAESTRÍA' },
                { name: 'Liderazgo en Gestión de Proyectos de Software', issuer: 'Certificación Profesional', year: '2026', badge: 'LEADERSHIP' },
                { name: 'ISO 27001 Auditoría y Cumplimiento', issuer: 'Estándar Internacional', year: '2020', badge: 'NORMATIVA' },
                { name: 'Hacking Ético & Pentesting Defensivo', issuer: 'Seguridad Ofensiva', year: '2020', badge: 'PENTEST' },
                { name: 'Managed Security Systems', issuer: 'Hardening & Perimetral', year: '2020', badge: 'DEFENSE' },
              ].map((c, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-cyan-500/25 bg-[#0a0d20]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {c.badge}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{c.year}</span>
                  </div>
                  <h4 className="font-display font-bold text-white text-sm mb-1">{c.name}</h4>
                  <p className="text-xs text-muted-foreground font-sans">{c.issuer}</p>
                </div>
              ))}
            </div>
          )}

          {/* 6. TRANSMISIÓN */}
          {activeTab === 'contact' && (
            <div className="max-w-xl mx-auto space-y-4 font-mono text-center">
              <div className="p-6 rounded-lg border border-cyan-500/30 bg-[#0a0d20]">
                <Send className="size-8 text-cyan-400 mx-auto mb-3 animate-pulse" />
                <h3 className="font-display text-lg font-bold text-white mb-2">UPLINK DIRECTO DE TRANSMISIÓN</h3>
                <p className="text-xs text-muted-foreground font-sans mb-6">
                  Disponible para liderar proyectos tecnológicos de alto impacto, asesorías de arquitectura y ciberseguridad.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleCopy}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-cyan-500/30 bg-black/60 hover:bg-cyan-950/30 text-cyan-300 text-xs font-mono flex items-center justify-center gap-2"
                  >
                    {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                    <span>COPIAR CORREO</span>
                  </button>

                  <a
                    href={`mailto:${email}?subject=Contacto%20Profesional%20-%20Romulo%20Miranda`}
                    className="w-full sm:w-auto"
                  >
                    <Button className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs uppercase px-6">
                      <Mail className="size-4 mr-1.5" />
                      ENVIAR CORREO DIRECTO
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
