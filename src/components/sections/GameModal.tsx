/**
 * Modal Holográfico de Expediente Técnico (GameModal).
 * Implementa el sistema de diseño Cybernetic Neural HUD:
 * Marcos biselados, retículas tácticas [+], telemetría militar y expedientes técnicos de Romulo Miranda.
 */

import { useEffect, useState } from 'react'
import {
  X,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Mail,
  Briefcase,
  Award,
  Cpu,
  Layers,
  Sparkles,
  Copy,
  Check,
  Send,
  MessageSquare,
  FileDown,
  Activity,
  Server,
  Lock,
} from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { soundEngine } from '../../lib/soundEngine'

interface GameModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'about' | 'skills' | 'experience' | 'projects' | 'certifications' | 'contact' | null
  title: string
  code?: string
  contentProps?: any
}

export default function GameModal({
  isOpen,
  onClose,
  type,
  title,
  code = 'SEC_CORE // 00',
  contentProps,
}: GameModalProps) {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      soundEngine.play('click')
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Líneas de escaneo CRT holográficas */}
      <div className="absolute inset-0 pointer-events-none scanlines opacity-50 z-10" />

      {/* Caja del Modal Táctico */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-lg bg-[#060919]/95 border border-cyan-500/35 shadow-[0_0_60px_rgba(0,242,254,0.2)] overflow-hidden z-20 animate-zoom-in">
        {/* Retículas tácticas en las 4 esquinas [+] */}
        <div className="absolute top-1 left-1 font-mono text-[9px] text-cyan-500/50 pointer-events-none">
          +
        </div>
        <div className="absolute top-1 right-1 font-mono text-[9px] text-cyan-500/50 pointer-events-none">
          +
        </div>
        <div className="absolute bottom-1 left-1 font-mono text-[9px] text-cyan-500/50 pointer-events-none">
          +
        </div>
        <div className="absolute bottom-1 right-1 font-mono text-[9px] text-cyan-500/50 pointer-events-none">
          +
        </div>

        {/* Cabecera del Expediente Cuántico */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-cyan-500/25 bg-[#0a0d20]/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-7 rounded border border-cyan-500/40 bg-cyan-950/40 text-cyan-400">
              <Terminal className="size-4 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] tracking-wider text-cyan-400 font-bold uppercase">
                {code} // CLASIFICADO OMEGA-7
              </span>
              <h2 className="font-display text-base sm:text-lg font-bold tracking-tight text-white glow-text-cyan uppercase">
                {title}
              </h2>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              soundEngine.play('click')
              onClose()
            }}
            className="hover:bg-cyan-500/20 hover:text-cyan-300 text-muted-foreground border border-transparent hover:border-cyan-500/30 transition-all h-8 w-8"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Contenedor con Scrollbar Táctica */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 font-sans custom-scrollbar">
          {type === 'about' && <AboutContent {...contentProps} />}
          {type === 'skills' && <SkillsContent {...contentProps} />}
          {type === 'experience' && <ExperienceContent {...contentProps} />}
          {type === 'projects' && <ProjectsContent {...contentProps} />}
          {type === 'certifications' && <CertificationsContent {...contentProps} />}
          {type === 'contact' && <ContactContent onClose={onClose} {...contentProps} />}
        </div>

        {/* Barra de Estado Inferior del HUD */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-2.5 border-t border-cyan-500/20 bg-[#0a0d20]/80 font-mono text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
              CANAL SEGURO ACTIVO
            </span>
            <span className="hidden sm:inline-block text-muted-foreground/50">|</span>
            <span className="hidden sm:inline-block">ENCRIPTACIÓN: QUANTUM-AES-512</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              soundEngine.play('click')
              onClose()
            }}
            className="border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-[10px] h-6 px-3 bg-cyan-950/20"
          >
            [ESC] CERRAR
          </Button>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 1. NÚCLEO BIOGRÁFICO // ABOUT CONTENT
// ==========================================
function AboutContent({
  name,
  avatarUrl,
  location,
}: {
  name: string
  avatarUrl?: string
  location?: string
}) {
  return (
    <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start font-mono">
      {/* Columna Izquierda: Retrato Holográfico */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="relative size-44 rounded-lg border-2 border-cyan-500/40 p-1.5 bg-[#0a0d20] overflow-hidden group shadow-[0_0_30px_rgba(0,242,254,0.15)]">
          {/* Overlay de gradiente holográfico */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/80 via-transparent to-transparent z-10 pointer-events-none" />
          <img
            src={avatarUrl || 'https://github.com/Romulomiranda0901.png'}
            alt={name}
            className="w-full h-full object-cover rounded filter contrast-105 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute bottom-2 left-2 right-2 z-20 font-mono text-[9px] bg-black/80 text-cyan-300 px-1 py-0.5 rounded border border-cyan-500/30">
            ROMULO MIRANDA // LEAD ARCHITECT
          </div>
        </div>

        <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
          {location || 'Honduras / Nicaragua'}
        </span>

        <a
          href="Romulo_Miranda_CV_2025.pdf"
          download="Romulo_Miranda_CV_2025.pdf"
          target="_blank"
          rel="noreferrer"
          onClick={() => soundEngine.play('chirp')}
          className="w-full"
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs border-cyan-500/30 text-cyan-300 bg-cyan-950/20 hover:bg-cyan-500/20 hover:border-cyan-400"
          >
            <FileDown className="size-3.5 mr-1" />
            DESCARGAR CV
          </Button>
        </a>
      </div>

      {/* Columna Derecha: Bitácora y Métricas */}
      <div className="space-y-4">
        <div className="p-4 border border-cyan-500/25 bg-[#0a0d20]/70 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-cyan-500/20">
            <span className="text-cyan-400 font-bold text-xs">{`> WHOAMI // EXECUTIVE_DOSSIER.MD`}</span>
            <span className="text-[10px] text-emerald-400 font-bold">ESTATUS: OPERATIVO</span>
          </div>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans">
            Ingeniero de Software y Arquitecto de Sistemas de élite, especializado en la creación de plataformas web
            escalables, de alto rendimiento y con seguridad militar. Con amplia experiencia docente universitaria y
            desarrollo empresarial, diseño arquitecturas robustas y optimizo el rendimiento de extremo a extremo,
            convirtiendo problemas complejos en productos digitales excepcionales, seguros y listos para millones de usuarios.
          </p>
        </div>

        {/* Métricas Tácticas Clave */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 border border-cyan-500/20 rounded-lg bg-black/40">
            <span className="text-[10px] text-muted-foreground block mb-0.5">ROL PRINCIPAL</span>
            <span className="text-white font-semibold font-sans text-xs">Lead Full Stack</span>
          </div>
          <div className="p-3 border border-cyan-500/20 rounded-lg bg-black/40">
            <span className="text-[10px] text-muted-foreground block mb-0.5">ESPECIALIDAD</span>
            <span className="text-white font-semibold font-sans text-xs">Ciberseguridad</span>
          </div>
          <div className="p-3 border border-cyan-500/20 rounded-lg bg-black/40">
            <span className="text-[10px] text-muted-foreground block mb-0.5">TRAYECTORIA</span>
            <span className="text-white font-semibold font-sans text-xs">4+ Años Senior</span>
          </div>
          <div className="p-3 border border-cyan-500/20 rounded-lg bg-black/40">
            <span className="text-[10px] text-muted-foreground block mb-0.5">REPOSITORIOS</span>
            <span className="text-white font-semibold font-sans text-xs">50+ Proyectos</span>
          </div>
        </div>

        {/* Calibración de Competencias (Barras de Nivel) */}
        <div className="p-3.5 border border-cyan-500/20 rounded-lg bg-black/40 space-y-2">
          <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold">
            <span>CALIBRACIÓN DE ARQUITECTURA DE SISTEMAS</span>
            <span>98% // ÓPTIMO</span>
          </div>
          <div className="w-full bg-cyan-950/40 h-2 rounded overflow-hidden border border-cyan-500/30">
            <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full w-[98%] shadow-[0_0_10px_#00f2fe]" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 2. MATRIZ DE COMPETENCIAS // SKILLS CONTENT
// ==========================================
function SkillsContent() {
  const cores = [
    {
      title: 'Core 01: Frontend Cuántico',
      icon: <Cpu className="size-4 text-cyan-400" />,
      color: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300',
      skills: [
        { name: 'React 18 / 19', level: '96%' },
        { name: 'TypeScript', level: '95%' },
        { name: 'Tailwind CSS', level: '98%' },
        { name: 'HTML5 Canvas 2D', level: '90%' },
        { name: 'Web Audio API', level: '88%' },
        { name: 'Next.js', level: '92%' },
      ],
    },
    {
      title: 'Core 02: Motores de Backend',
      icon: <Server className="size-4 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300',
      skills: [
        { name: 'Node.js / Express', level: '95%' },
        { name: 'Laravel / PHP', level: '94%' },
        { name: 'Python / ROMA', level: '92%' },
        { name: 'Java / Spring', level: '85%' },
        { name: 'Microservicios', level: '92%' },
        { name: 'WebSockets', level: '90%' },
      ],
    },
    {
      title: 'Core 03: Ciberdefensa & Cloud',
      icon: <Lock className="size-4 text-rose-400" />,
      color: 'border-rose-500/30 bg-rose-950/20 text-rose-300',
      skills: [
        { name: 'ISO 27001', level: '95%' },
        { name: 'Pentesting Ético', level: '90%' },
        { name: 'Docker & Compose', level: '92%' },
        { name: 'CI/CD Pipelines', level: '90%' },
        { name: 'OWASP Security', level: '94%' },
        { name: 'AWS Cloud Infra', level: '86%' },
      ],
    },
    {
      title: 'Core 04: Datos & Persistencia',
      icon: <Layers className="size-4 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
      skills: [
        { name: 'PostgreSQL', level: '94%' },
        { name: 'MySQL Enterprise', level: '95%' },
        { name: 'MongoDB NoSQL', level: '88%' },
        { name: 'Redis Cache', level: '86%' },
        { name: 'Optimiz. Querys', level: '92%' },
        { name: 'Migraciones DB', level: '95%' },
      ],
    },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {cores.map((core, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-cyan-500/25 bg-[#0a0d20]/80 p-4 relative overflow-hidden group hover:border-cyan-400/50 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-cyan-500/15">
            <div className="flex items-center gap-2">
              {core.icon}
              <h3 className="font-display text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                {core.title}
              </h3>
            </div>
            <span className="font-mono text-[9px] text-muted-foreground/80">ONLINE</span>
          </div>

          <div className="space-y-2.5">
            {core.skills.map((s) => (
              <div key={s.name} className="space-y-1">
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="text-foreground/90">{s.name}</span>
                  <span className="text-cyan-400 font-semibold">{s.level}</span>
                </div>
                <div className="w-full bg-black/60 h-1.5 rounded overflow-hidden border border-cyan-500/15">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded"
                    style={{ width: s.level }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ==========================================
// 3. REGISTROS TEMPORALES // EXPERIENCE
// ==========================================
function ExperienceContent() {
  const items = [
    {
      company: 'Credifac Honduras',
      role: 'Lead Full Stack Architect & Developer',
      period: 'Abril 2026 — Actualidad',
      tag: 'FINTECH // SECURITY ARCHITECTURE',
      details:
        'Liderazgo técnico en la arquitectura de microservicios y refactorización del core financiero. Implementación de estándares de ciberseguridad corporativos y optimización de base de datos MySQL distribuidas.',
    },
    {
      company: 'UNAN-León',
      role: 'Catedrático Universitario de Ingeniería de Sistemas',
      period: 'Marzo 2025 — Actualidad',
      tag: 'ACADEMIA // ALTO RENDIMIENTO',
      details:
        'Profesor titular impartiendo asignaturas avanzadas de diseño de software, seguridad de la información y arquitecturas web para nuevas generaciones de ingenieros.',
    },
    {
      company: 'Universidad Padre Gaspar García Laviana',
      role: 'Catedrático Universitario de Ingeniería de Sistemas',
      period: 'Marzo 2023 — Junio 2024',
      tag: 'DOCENCIA // SISTEMAS',
      details:
        'Docencia e impartición de cátedras sobre lenguajes de programación, ingeniería de requisitos y bases de datos relacionales.',
    },
    {
      company: 'UNAN-León',
      role: 'Full Stack Tech Lead & Coordinador Tecnológico',
      period: '2021 — 2024',
      tag: 'DEV LEAD // CI/CD',
      details:
        'Dirección del equipo de desarrollo, implementación de sistemas académicos internos y automatización de despliegues continuos (CI/CD) para alta concurrencia.',
    },
    {
      company: 'Universidad Padre Gaspar García Laviana',
      role: 'Arquitecto de Sistemas & Coordinador de TI',
      period: '2022 — 2024',
      tag: 'INFRAESTRUCTURA // SEGURIDAD',
      details:
        'Diseño e integración de la infraestructura del campus universitario, administración de servidores locales y políticas de seguridad perimetral.',
    },
    {
      company: 'Alcaldía Municipal de León',
      role: 'Senior Full Stack Developer',
      period: '2020 — 2021',
      tag: 'GOBIERNO // WEB PORTALS',
      details:
        'Desarrollo de módulos de catastro municipal y portales web ciudadanos utilizando Laravel, React y PostgreSQL con altos estándares de resiliencia.',
    },
  ]

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {items.map((it, idx) => (
        <div
          key={idx}
          className="relative flex gap-4 p-4 rounded-lg border border-cyan-500/20 bg-[#0a0d20]/80 hover:border-cyan-400/50 transition-all duration-300 group"
        >
          {/* Indicador de Línea Temporal */}
          <div className="flex flex-col items-center">
            <div className="size-8 rounded border border-cyan-500/40 bg-cyan-950/30 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(0,242,254,0.2)]">
              <Briefcase className="size-4" />
            </div>
            {idx < items.length - 1 && (
              <div className="w-0.5 flex-1 bg-gradient-to-b from-cyan-500/30 to-transparent my-1" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
              <h3 className="font-display font-bold text-sm text-white glow-text-cyan">{it.role}</h3>
              <span className="font-mono text-[10px] text-cyan-300/80 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {it.period}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-purple-300 font-semibold">
              <span>{it.company}</span>
              <span className="text-[9px] text-muted-foreground/60 border-l border-border/40 pl-2">
                {it.tag}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">{it.details}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ==========================================
// 4. SIMULADORES ARCADE // PROJECTS
// ==========================================
function ProjectsContent() {
  const projects = [
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
  ]

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {projects.map((p, index) => (
        <article
          key={index}
          className="group flex flex-col justify-between rounded-lg border border-cyan-500/25 bg-[#0a0d20]/80 p-4 hover:border-cyan-400/60 transition-all duration-300 relative overflow-hidden"
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-display font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">
                {p.name}
              </h4>
              <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shrink-0 uppercase">
                {p.badge}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4 font-sans">{p.desc}</p>
          </div>

          <div className="mt-auto pt-3 border-t border-cyan-500/15">
            <div className="flex flex-wrap gap-1 mb-3">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/50 border border-cyan-500/20 text-cyan-200/80"
                >
                  {t}
                </span>
              ))}
            </div>

            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => soundEngine.play('warp')}
              className="block w-full"
            >
              <Button
                size="sm"
                className="w-full bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black font-mono text-[11px] font-bold border border-cyan-500/40 transition-all duration-300 h-8 gap-1.5"
              >
                <span>[COMPILAR SIMULACIÓN]</span>
                <ExternalLink className="size-3" />
              </Button>
            </a>
          </div>
        </article>
      ))}
    </div>
  )
}

// ==========================================
// 5. BÓVEDA CRIPTOGRÁFICA // CERTIFICACIONES
// ==========================================
function CertificationsContent() {
  const items = [
    {
      name: 'Máster en Seguridad Informática',
      issuer: 'Universidad Internacional de La Rioja (UNIR España)',
      year: '2025',
      hash: '0xUNIR_SEC_2025_9FA1',
      badge: 'GRADO DE MAESTRÍA',
    },
    {
      name: 'Liderazgo en la Gestión de Proyectos de Software',
      issuer: 'Certificación Profesional Ejecutiva',
      year: '2026',
      hash: '0xLEAD_MGMT_2026_C482',
      badge: 'TECH LEADERSHIP',
    },
    {
      name: 'ISO 27001 (Auditoría y Cumplimiento de Seguridad)',
      issuer: 'Estándar Internacional de Seguridad de la Información',
      year: '2020',
      hash: '0xISO_27001_AUDIT_771B',
      badge: 'NORMATIVA GLOBAL',
    },
    {
      name: 'Hacking Ético & Pentesting',
      issuer: 'Seguridad Ofensiva y Detección de Vulnerabilidades',
      year: '2020',
      hash: '0xETH_HACK_PENTEST_E993',
      badge: 'OFFENSIVE SECURITY',
    },
    {
      name: 'Managed Security Systems',
      issuer: 'Administración y Hardening de Servidores Críticos',
      year: '2020',
      hash: '0xMNG_SEC_SYS_3022_AA01',
      badge: 'PERIMETRAL DEFENSE',
    },
  ]

  return (
    <div className="grid sm:grid-cols-2 gap-3 max-w-4xl mx-auto font-mono">
      {items.map((c, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-cyan-500/25 bg-[#0a0d20]/80 p-4 hover:border-amber-400/50 transition-all duration-300 group relative"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded border border-amber-500/40 bg-amber-950/30 text-amber-400 shrink-0">
              <Award className="size-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                  {c.badge}
                </span>
                <span className="text-[10px] text-muted-foreground">{c.year}</span>
              </div>
              <h4 className="font-display font-bold text-sm text-white mb-1 leading-snug">
                {c.name}
              </h4>
              <p className="text-xs text-muted-foreground mb-2 font-sans">{c.issuer}</p>
              <div className="text-[9px] text-cyan-400/80 bg-black/60 px-2 py-0.5 rounded border border-cyan-500/20 truncate">
                HASH VERIFICADO: {c.hash}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ==========================================
// 6. TERMINAL DE ENLACE // CONTACT CONTENT
// ==========================================
function ContactContent({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const [senderName, setSenderName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [senderMessage, setSenderMessage] = useState('')
  const [transmitting, setTransmitting] = useState(false)

  const email = 'romulomiranda20092009@gmail.com'

  const handleCopy = () => {
    soundEngine.play('chirp')
    navigator.clipboard.writeText(email)
    setCopied(true)
    toast.success('Dirección de correo copiada al portapapeles cuántico.')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    soundEngine.play('laser')
    setTransmitting(true)

    setTimeout(() => {
      soundEngine.play('success')
      setTransmitting(false)
      toast.success('Transmisión cifrada enviada con éxito.', {
        description: 'Se ha abierto tu cliente de enlace para confirmar el envío.',
      })

      // Abrir enlace mailto directo con el mensaje
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
        `Contacto Profesional de ${senderName}`,
      )}&body=${encodeURIComponent(
        `Nombre: ${senderName}\nCorreo: ${senderEmail}\n\nMensaje:\n${senderMessage}`,
      )}`
      window.open(mailtoUrl, '_blank')

      onClose()
    }, 800)
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 font-mono">
      {/* Botones de Uplink Rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleCopy}
          className="p-3 rounded-lg border border-cyan-500/30 bg-[#0a0d20] hover:border-cyan-400 hover:bg-cyan-950/20 text-left transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] text-cyan-400 block font-bold">CORREO CUÁNTICO</span>
            <span className="text-xs text-white truncate max-w-[190px] block">{email}</span>
          </div>
          <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
          </div>
        </button>

        <a
          href="https://wa.me/50588888888"
          target="_blank"
          rel="noreferrer"
          onClick={() => soundEngine.play('chirp')}
          className="p-3 rounded-lg border border-emerald-500/30 bg-[#0a0d20] hover:border-emerald-400 hover:bg-emerald-950/20 text-left transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] text-emerald-400 block font-bold">WHATSAPP / TELEGRAM</span>
            <span className="text-xs text-white">Canal Inmediato</span>
          </div>
          <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <MessageSquare className="size-4" />
          </div>
        </a>
      </div>

      {/* Formulario de Transmisión */}
      <div className="p-5 border border-cyan-500/25 bg-[#0a0d20]/80 rounded-lg relative">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-4 pb-2 border-b border-cyan-500/20">
          <Send className="size-3.5 animate-pulse" />
          <span>{`> DESPACHAR_TRANSMISION_ENCRIPTADA.SH`}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-muted-foreground uppercase mb-1">
              Nombre o Entidad del Remitente
            </label>
            <input
              type="text"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full bg-black/60 border border-cyan-500/30 rounded px-3 py-2 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] font-sans"
              placeholder="Ej. Reclutador de Élite / Empresa"
            />
          </div>

          <div>
            <label className="block text-[10px] text-muted-foreground uppercase mb-1">
              Frecuencia / Correo de Retorno
            </label>
            <input
              type="email"
              required
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              className="w-full bg-black/60 border border-cyan-500/30 rounded px-3 py-2 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] font-sans"
              placeholder="contacto@empresa.com"
            />
          </div>

          <div>
            <label className="block text-[10px] text-muted-foreground uppercase mb-1">
              Cuerpo de la Propuesta / Transmisión
            </label>
            <textarea
              required
              rows={4}
              value={senderMessage}
              onChange={(e) => setSenderMessage(e.target.value)}
              className="w-full bg-black/60 border border-cyan-500/30 rounded px-3 py-2 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] font-sans resize-none"
              placeholder="Describe los requerimientos del proyecto o la oferta laboral..."
            />
          </div>

          <Button
            type="submit"
            disabled={transmitting}
            className="w-full py-5 bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(0,242,254,0.4)]"
          >
            {transmitting ? '[ TRANSMITIENDO PAQUETE... ]' : '[ TRANSMITIR MENSAJE CIFRADO ]'}
          </Button>
        </form>
      </div>
    </div>
  )
}
