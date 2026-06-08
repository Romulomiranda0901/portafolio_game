import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, Keyboard, HelpCircle, MousePointerClick, Smartphone } from 'lucide-react'
import GameModal from './GameModal'
import { Button } from '../ui/button'

interface GamePortfolioProps {
  name: string
  avatarUrl?: string
  location?: string
}

// Interfaces internas del motor de juego
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  alpha: number
  size: number
  decay: number
}

interface InteractiveNode {
  id: 'about' | 'skills' | 'experience' | 'projects' | 'certifications' | 'contact'
  name: string
  x: number
  y: number
  radius: number
  color: string
  label: string
  description: string
}

interface SkillNode {
  name: string
  category: 'frontend' | 'backend' | 'devops' | 'security'
  x: number
  y: number
  color: string
  collected: boolean
  angle: number
  speed: number
  orbitRadius: number
}

export default function GamePortfolio({ name, avatarUrl, location }: GamePortfolioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  
  // Referencias para el bucle de juego y estado de entrada
  const keysRef = useRef<{ [key: string]: boolean }>({})
  const mouseRef = useRef<{ x: number; y: number; isDown: boolean; targetX: number | null; targetY: number | null }>({
    x: 0,
    y: 0,
    isDown: false,
    targetX: null,
    targetY: null,
  })

  // Estado del jugador
  const playerRef = useRef({
    x: 480,
    y: 270,
    vx: 0,
    vy: 0,
    speed: 3.5,
    radius: 16,
    energy: 100,
    glow: 15,
    pulseDir: 1,
    floatOffset: 0,
  })

  // Entidades del juego
  const particlesRef = useRef<Particle[]>([])
  
  // Joystick virtual para móvil
  const joystickRef = useRef<{
    active: boolean
    startX: number
    startY: number
    curX: number
    curY: number
    radius: number
  }>({
    active: false,
    startX: 0,
    startY: 0,
    curX: 0,
    curY: 0,
    radius: 40,
  })

  // Nodos interactivos del mapa
  const nodes = useRef<InteractiveNode[]>([
    {
      id: 'about',
      name: 'NÚCLEO PRINCIPAL',
      x: 480,
      y: 220,
      radius: 40,
      color: '#a855f7', // Violeta
      label: 'SOBRE MÍ',
      description: 'Consultar bitácora biográfica del desarrollador.'
    },
    {
      id: 'experience',
      name: 'RACKS DE MEMORIA',
      x: 180,
      y: 160,
      radius: 35,
      color: '#3b82f6', // Azul
      label: 'EXPERIENCIA',
      description: 'Acceder a servidores de trayectoria laboral.'
    },
    {
      id: 'projects',
      name: 'CABINAS DE SIMULACIÓN',
      x: 780,
      y: 160,
      radius: 35,
      color: '#ec4899', // Rosa/Magenta
      label: 'PROYECTOS',
      description: 'Inicializar simuladores arcade de proyectos.'
    },
    {
      id: 'certifications',
      name: 'BÓVEDA DE CREDENCIALES',
      x: 780,
      y: 380,
      radius: 35,
      color: '#eab308', // Dorado
      label: 'CREDENCIALES',
      description: 'Desencriptar certificados y maestrías.'
    },
    {
      id: 'contact',
      name: 'RECEPTOR DE TRANSMISIONES',
      x: 480,
      y: 430,
      radius: 38,
      color: '#10b981', // Esmeralda
      label: 'CONTACTAR',
      description: 'Canalizar enlace de comunicación directa.'
    },
  ])

  // Sub-nodos de Habilidades (se orbitan alrededor del mapa y se pueden recolectar)
  const skillsList = useRef<SkillNode[]>([
    { name: 'React', category: 'frontend', x: 0, y: 0, color: '#22d3ee', collected: false, angle: 0, speed: 0.02, orbitRadius: 60 },
    { name: 'TypeScript', category: 'frontend', x: 0, y: 0, color: '#3178c6', collected: false, angle: 1.2, speed: 0.015, orbitRadius: 85 },
    { name: 'Node.js', category: 'backend', x: 0, y: 0, color: '#4ade80', collected: false, angle: 2.4, speed: 0.018, orbitRadius: 65 },
    { name: 'Laravel', category: 'backend', x: 0, y: 0, color: '#f43f5e', collected: false, angle: 3.6, speed: 0.012, orbitRadius: 90 },
    { name: 'Docker', category: 'devops', x: 0, y: 0, color: '#38bdf8', collected: false, angle: 4.8, speed: 0.022, orbitRadius: 75 },
    { name: 'Security', category: 'security', x: 0, y: 0, color: '#f43f5e', collected: false, angle: 5.5, speed: 0.014, orbitRadius: 70 },
  ])

  // Estado de React
  const [activeNode, setActiveNode] = useState<InteractiveNode | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [collectedCount, setCollectedCount] = useState(0)
  const [showTutorial, setShowTutorial] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Web Audio Synth Engine
  const audioCtxRef = useRef<AudioContext | null>(null)
  const musicOscRef = useRef<OscillatorNode | null>(null)
  const musicGainRef = useRef<GainNode | null>(null)

  // Iniciar el contexto de Audio en interacción
  const initAudio = () => {
    if (audioCtxRef.current) return
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (AudioContextClass) {
      audioCtxRef.current = new AudioContextClass()
      setAudioEnabled(true)
      playSFX('powerup')
      startMusicLoop()
    }
  }

  const toggleAudio = () => {
    if (!audioCtxRef.current) {
      initAudio()
      return
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
      setAudioEnabled(true)
      playSFX('powerup')
    } else if (audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend()
      setAudioEnabled(false)
    }
  }

  // Sintetizador de efectos de sonido
  const playSFX = (type: 'beep' | 'powerup' | 'portal' | 'collect' | 'click') => {
    const ctx = audioCtxRef.current
    if (!ctx || ctx.state !== 'running') return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      const now = ctx.currentTime

      if (type === 'beep') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(600, now)
        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
        osc.start(now)
        osc.stop(now + 0.08)
      } else if (type === 'click') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(300, now)
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
        osc.start(now)
        osc.stop(now + 0.06)
      } else if (type === 'powerup') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(150, now)
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.25)
        gain.gain.setValueAtTime(0.1, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
        osc.start(now)
        osc.stop(now + 0.25)
      } else if (type === 'collect') {
        // Sonido arpegio ascendente cyberpunk
        osc.type = 'sine'
        osc.frequency.setValueAtTime(523.25, now) // C5
        osc.frequency.setValueAtTime(659.25, now + 0.06) // E5
        osc.frequency.setValueAtTime(783.99, now + 0.12) // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.18) // C6
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.setValueAtTime(0.12, now + 0.18)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
        osc.start(now)
        osc.stop(now + 0.3)
      } else if (type === 'portal') {
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(400, now)
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.35)
        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
        osc.start(now)
        osc.stop(now + 0.35)
      }
    } catch (e) {
      console.warn('Audio synthesis failed:', e)
    }
  }

  // Música de fondo generada
  const startMusicLoop = () => {
    const ctx = audioCtxRef.current
    if (!ctx) return
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(65.41, ctx.currentTime) // C2
      gain.gain.setValueAtTime(0.02, ctx.currentTime)

      // Secuencia armónica retro minimalista
      let index = 0
      const notes = [65.41, 98.00, 87.31, 77.78] // C2, G2, F2, D#2
      const interval = setInterval(() => {
        if (ctx.state === 'running' && musicGainRef.current) {
          index = (index + 1) % notes.length
          osc.frequency.setValueAtTime(notes[index], ctx.currentTime)
        }
      }, 2000)

      osc.start()

      musicOscRef.current = osc
      musicGainRef.current = gain

      return () => {
        clearInterval(interval)
        osc.stop()
      }
    } catch (e) {
      console.warn(e)
    }
  }

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Configuración de teclado y ratón
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'enter']
      if (targetKeys.includes(e.key.toLowerCase())) {
        keysRef.current[e.key.toLowerCase()] = true
        // Evitar scrolling con flechas
        if (e.key !== 'F5' && e.key !== 'F12') {
          e.preventDefault()
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown, { passive: false })
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Bucle de juego principal
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrameId: number
    let floatTime = 0

    // Asegurar tamaño físico y lógico del Canvas de forma dinámica y responsiva
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (!container) return
      const width = container.clientWidth
      const height = container.clientHeight
      
      canvas.width = width
      canvas.height = height

      // Centrar jugador si está en su posición por defecto de inicio
      if (playerRef.current.x === 480 && playerRef.current.y === 270) {
        playerRef.current.x = width / 2
        playerRef.current.y = height / 2
      }

      // Re-distribuir los nodos interactivos de forma responsiva y adaptada al dispositivo
      const isMobileSize = width < 768
      
      nodes.current = [
        {
          id: 'about',
          name: 'NÚCLEO CENTRAL',
          label: 'SOBRE MÍ',
          description: 'Trayectoria profesional, bio y formación.',
          color: '#a855f7', // Violeta
          x: width * 0.5,
          y: height * (isMobileSize ? 0.22 : 0.28),
          radius: isMobileSize ? 32 : 40,
        },
        {
          id: 'skills',
          name: 'NÚCLEO DE COMPETENCIAS',
          label: 'HABILIDADES',
          description: 'Lenguajes, frameworks y tecnologías.',
          color: '#22c55e', // Verde
          x: width * (isMobileSize ? 0.22 : 0.18),
          y: height * (isMobileSize ? 0.50 : 0.65),
          radius: isMobileSize ? 32 : 40,
        },
        {
          id: 'experience',
          name: 'REGISTROS DE TRABAJO',
          label: 'EXPERIENCIA',
          description: 'Línea de tiempo de empleos y roles.',
          color: '#3b82f6', // Azul
          x: width * (isMobileSize ? 0.22 : 0.22),
          y: height * (isMobileSize ? 0.32 : 0.35),
          radius: isMobileSize ? 32 : 40,
        },
        {
          id: 'projects',
          name: 'PROYECTOS Y REPOSITORIOS',
          label: 'PROYECTOS',
          description: 'Portafolio de código en GitHub.',
          color: '#ec4899', // Rosa
          x: width * (isMobileSize ? 0.78 : 0.78),
          y: height * (isMobileSize ? 0.32 : 0.35),
          radius: isMobileSize ? 32 : 40,
        },
        {
          id: 'certifications',
          name: 'BÓVEDA DE CREDENCIALES',
          label: 'CERTIFICADOS',
          description: 'Diplomas y certificaciones académicas.',
          color: '#eab308', // Amarillo
          x: width * (isMobileSize ? 0.78 : 0.82),
          y: height * (isMobileSize ? 0.50 : 0.65),
          radius: isMobileSize ? 32 : 40,
        },
        {
          id: 'contact',
          name: 'CANAL DE COMUNICACIÓN',
          label: 'CONTACTAR',
          description: 'Formulario y enlaces de redes sociales.',
          color: '#14b8a6', // Teal
          x: width * 0.5,
          y: height * (isMobileSize ? 0.78 : 0.82),
          radius: isMobileSize ? 32 : 40,
        },
      ]
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Crear partículas ambientales iniciales usando dimensiones reales
    particlesRef.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: `rgba(168, 85, 247, ${Math.random() * 0.3 + 0.1})`,
      alpha: Math.random(),
      size: Math.random() * 2 + 0.5,
      decay: 0.005 + Math.random() * 0.005,
    }))

    // FUNCIÓN DE ACTUALIZACIÓN DEL MOTOR
    const update = () => {
      const player = playerRef.current
      floatTime += 0.05
      player.floatOffset = Math.sin(floatTime) * 2

      // 1. INPUT DE MOVIMIENTO (Teclado)
      let dx = 0
      let dy = 0

      if (keysRef.current['w'] || keysRef.current['arrowup']) dy -= 1
      if (keysRef.current['s'] || keysRef.current['arrowdown']) dy += 1
      if (keysRef.current['a'] || keysRef.current['arrowleft']) dx -= 1
      if (keysRef.current['d'] || keysRef.current['arrowright']) dx += 1

      // 2. INPUT DE MOVIMIENTO (Joystick virtual móvil)
      const joystick = joystickRef.current
      if (joystick.active) {
        const diffX = joystick.curX - joystick.startX
        const diffY = joystick.curY - joystick.startY
        const dist = Math.hypot(diffX, diffY)
        if (dist > 5) {
          dx = diffX / dist
          dy = diffY / dist
        }
      }

      // 3. INPUT DE MOVIMIENTO (Click/Tap directo)
      const mouse = mouseRef.current
      if (mouse.targetX !== null && mouse.targetY !== null) {
        const mdx = mouse.targetX - player.x
        const mdy = mouse.targetY - player.y
        const mdist = Math.hypot(mdx, mdy)

        if (mdist > 4) {
          dx = mdx / mdist
          dy = mdy / mdist
        } else {
          // Llegó a destino
          mouse.targetX = null
          mouse.targetY = null
        }
      }

      // Si hay entrada de teclado/joystick, cancelar el click-to-move
      if ((keysRef.current['w'] || keysRef.current['s'] || keysRef.current['a'] || keysRef.current['d'] || joystick.active) && mouse.targetX !== null) {
        mouse.targetX = null
        mouse.targetY = null
      }

      // Aplicar velocidad acelerada con suavizado
      const accel = 0.3
      const targetVx = dx * player.speed
      const targetVy = dy * player.speed

      player.vx += (targetVx - player.vx) * accel
      player.vy += (targetVy - player.vy) * accel

      // Mover jugador
      player.x += player.vx
      player.y += player.vy

      // Límites del mapa y colisiones perimetrales ajustados al Canvas dinámico
      const pad = player.radius + 15
      if (player.x < pad) { player.x = pad; player.vx = 0; mouse.targetX = null }
      if (player.x > canvas.width - pad) { player.x = canvas.width - pad; player.vx = 0; mouse.targetX = null }
      if (player.y < pad) { player.y = pad; player.vy = 0; mouse.targetY = null }
      if (player.y > canvas.height - pad) { player.y = canvas.height - pad; player.vy = 0; mouse.targetY = null }

      // Pulsar brillo del jugador
      player.glow += player.pulseDir * 0.3
      if (player.glow > 22 || player.glow < 10) player.pulseDir *= -1

      // Crear partículas del propulsor del dron
      if (Math.hypot(player.vx, player.vy) > 0.5) {
        if (Math.random() < 0.4) {
          const angle = Math.atan2(player.vy, player.vx) + Math.PI // Dirección opuesta al movimiento
          const px = player.x + Math.cos(angle) * player.radius
          const py = player.y + Math.sin(angle) * player.radius
          particlesRef.current.push({
            x: px,
            y: py,
            vx: -player.vx * 0.3 + (Math.random() - 0.5) * 0.8,
            vy: -player.vy * 0.3 + (Math.random() - 0.5) * 0.8,
            color: `rgba(6, 182, 212, ${Math.random() * 0.6 + 0.4})`, // Cyan neón
            alpha: 1,
            size: Math.random() * 3 + 1.5,
            decay: 0.03 + Math.random() * 0.02,
          })
        }
      }

      // 4. ANIMACIÓN Y COLISIÓN DE HABILIDADES (Chips flotantes)
      skillsList.current.forEach((skill) => {
        if (skill.collected) return

        // Orbitar alrededor de la posición del nodo de habilidades actual
        const skillsNode = nodes.current.find(n => n.id === 'skills')
        const coreX = skillsNode ? skillsNode.x : 180
        const coreY = skillsNode ? skillsNode.y : 380
        skill.angle += skill.speed
        skill.x = coreX + Math.cos(skill.angle) * skill.orbitRadius
        skill.y = coreY + Math.sin(skill.angle) * skill.orbitRadius

        // Colisión con el jugador
        const dist = Math.hypot(player.x - skill.x, player.y - skill.y)
        if (dist < player.radius + 12) {
          skill.collected = true
          setCollectedCount((prev) => prev + 1)
          playSFX('collect')
          // Explosión de partículas
          for (let i = 0; i < 20; i++) {
            particlesRef.current.push({
              x: skill.x,
              y: skill.y,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              color: skill.color,
              alpha: 1,
              size: Math.random() * 4 + 1.5,
              decay: 0.02 + Math.random() * 0.02,
            })
          }
        }
      })

      // 5. EVENTO DE INTERACCIÓN CON NODOS
      let nearNode: InteractiveNode | null = null
      nodes.current.forEach((node) => {
        const dist = Math.hypot(player.x - node.x, player.y - node.y)
        // Si está a distancia de interacción (cerca del radio del nodo)
        if (dist < node.radius + player.radius + 20) {
          nearNode = node
        }
      })

      // Si está cerca, y presiona Enter o Barra Espaciadora o botón táctil
      if (nearNode) {
        if (keysRef.current['enter'] || keysRef.current[' ']) {
          keysRef.current['enter'] = false
          keysRef.current[' '] = false
          handleInteract(nearNode)
        }
      }

      // 6. ACTUALIZAR PARTÍCULAS
      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx
        p.y += p.vy
        p.alpha -= p.decay
        if (p.alpha <= 0) {
          particlesRef.current.splice(idx, 1)
        }
      })

      // Añadir partículas ambientales aleatorias si bajan de 30
      if (particlesRef.current.length < 30 && Math.random() < 0.1) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          color: `rgba(168, 85, 247, ${Math.random() * 0.2 + 0.05})`,
          alpha: Math.random() * 0.5 + 0.2,
          size: Math.random() * 2 + 0.5,
          decay: 0.004 + Math.random() * 0.004,
        })
      }
    }

    // FUNCIÓN DE DIBUJO DEL RENDER
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // A. FONDO CYBERPUNK - Rejilla retro neón
      ctx.fillStyle = '#05070f'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Rejilla de perspectiva electrónica en el fondo
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.05)'
      ctx.lineWidth = 1
      const gridSize = 40
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Dibujar cables que conectan dinámicamente los nodos
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      const aboutNode = nodes.current.find(n => n.id === 'about')
      if (aboutNode) {
        nodes.current.forEach(node => {
          if (node.id !== 'about') {
            ctx.moveTo(aboutNode.x, aboutNode.y)
            ctx.lineTo(node.x, node.y)
          }
        })
      }
      ctx.stroke()

      // B. ENTORNO DE HABILIDADES (Skills Core - Generador de energía)
      const skillsNode = nodes.current.find(n => n.id === 'skills')
      const coreX = skillsNode ? skillsNode.x : 180
      const coreY = skillsNode ? skillsNode.y : 380
      ctx.shadowBlur = 15
      ctx.shadowColor = '#f43f5e'
      ctx.fillStyle = 'rgba(244, 63, 94, 0.1)'
      ctx.strokeStyle = '#f43f5e'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(coreX, coreY, 30, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(coreX, coreY, 45, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.25)'
      ctx.setLineDash([6, 12])
      ctx.stroke()
      ctx.setLineDash([])
      ctx.shadowBlur = 0 // Reset de sombras

      ctx.fillStyle = '#f43f5e'
      ctx.font = 'bold 9px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('NÚCLEO HABILIDADES', coreX, coreY - 45)

      // C. DIBUJAR NODOS INTERACTIVOS (Estructuras del mapa)
      nodes.current.forEach((node) => {
        const dist = Math.hypot(playerRef.current.x - node.x, playerRef.current.y - node.y)
        const isNear = dist < node.radius + playerRef.current.radius + 20

        // Efecto de resplandor
        ctx.shadowBlur = isNear ? 25 : 12
        ctx.shadowColor = node.color

        // Dibujar círculo/base holográfica externa
        ctx.strokeStyle = node.color
        ctx.lineWidth = isNear ? 3 : 1.5
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.stroke()

        // Dibujar relleno radial sutil
        ctx.fillStyle = isNear ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.01)'
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius - 2, 0, Math.PI * 2)
        ctx.fill()

        // Dibujar anillo interno animado
        ctx.strokeStyle = `${node.color}55`
        ctx.lineWidth = 1
        ctx.beginPath()
        const rotRadius = node.radius - 8 + Math.sin(floatTime * 2) * 2
        ctx.arc(node.x, node.y, rotRadius, 0, Math.PI * 2)
        ctx.stroke()

        // Dibujar decoraciones neón específicas por tipo de nodo
        ctx.shadowBlur = 0 // Reset
        ctx.fillStyle = node.color
        ctx.font = 'bold 9px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(node.name, node.x, node.y - node.radius - 12)

        // Etiqueta del nodo en el centro
        ctx.fillStyle = '#ffffff'
        ctx.font = '10px monospace'
        ctx.fillText(node.label, node.x, node.y + 4)

        // Si está cerca, dibujar tooltip flotante para presionar Enter
        if (isNear) {
          ctx.shadowBlur = 10
          ctx.shadowColor = '#00f2ff'
          ctx.fillStyle = '#05070f'
          ctx.strokeStyle = '#00f2ff'
          ctx.lineWidth = 1
          
          const tooltipW = 200
          const tooltipH = 40
          const tx = node.x - tooltipW / 2
          const ty = node.y + node.radius + 10

          ctx.fillRect(tx, ty, tooltipW, tooltipH)
          ctx.strokeRect(tx, ty, tooltipW, tooltipH)

          ctx.fillStyle = '#00f2ff'
          ctx.font = 'bold 8px monospace'
          ctx.textAlign = 'center'
          ctx.fillText(`[ENTER / CLICK] PARA INTERFAZ`, node.x, ty + 15)

          ctx.fillStyle = '#8b9bb4'
          ctx.font = '8px sans-serif'
          ctx.fillText(node.description, node.x, ty + 28)
        }
      })

      // D. DIBUJAR CHIPS DE HABILIDAD
      skillsList.current.forEach((skill) => {
        if (skill.collected) return

        ctx.shadowBlur = 10
        ctx.shadowColor = skill.color
        ctx.fillStyle = skill.color

        // Dibujar rombo neón flotante
        ctx.beginPath()
        ctx.moveTo(skill.x, skill.y - 7)
        ctx.lineTo(skill.x + 7, skill.y)
        ctx.lineTo(skill.x, skill.y + 7)
        ctx.lineTo(skill.x - 7, skill.y)
        ctx.closePath()
        ctx.fill()

        // Texto flotante de la habilidad
        ctx.fillStyle = '#ffffff'
        ctx.font = '7px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(skill.name, skill.x, skill.y - 12)
      })

      // E. DIBUJAR PARTÍCULAS
      ctx.shadowBlur = 0
      particlesRef.current.forEach((p) => {
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1.0 // Reset de opacidad

      // F. DIBUJAR JUGADOR (Dron Cibernético Flotante)
      const player = playerRef.current
      const py = player.y + player.floatOffset

      // Resplandor del Dron
      ctx.shadowBlur = player.glow
      ctx.shadowColor = '#06b6d4' // Cyan neón

      // Cuerpo exterior
      ctx.fillStyle = 'rgba(6, 182, 212, 0.2)'
      ctx.strokeStyle = '#06b6d4'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.arc(player.x, py, player.radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Visor robótico horizontal
      ctx.fillStyle = '#ffffff'
      ctx.shadowBlur = 20
      ctx.shadowColor = '#00ffff'
      ctx.fillRect(player.x - 10, py - 3, 20, 4)

      // Pequeño reactor central
      ctx.fillStyle = '#a855f7' // Reactor violeta
      ctx.shadowBlur = 8
      ctx.shadowColor = '#a855f7'
      ctx.beginPath()
      ctx.arc(player.x, py + 8, 4, 0, Math.PI * 2)
      ctx.fill()

      // Reset final de sombras para no empañar texto general
      ctx.shadowBlur = 0

      // G. DIBUJAR PUNTERO DE DESTINO (Si el usuario hizo click para moverse)
      const mouse = mouseRef.current
      if (mouse.targetX !== null && mouse.targetY !== null) {
        ctx.strokeStyle = '#00ffff'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(mouse.targetX, mouse.targetY, 6 + Math.sin(floatTime * 3) * 2, 0, Math.PI * 2)
        ctx.stroke()
      }

      // H. DIBUJAR CONTROLES VIRTUALES PARA MÓVIL (Joystick)
      const joystick = joystickRef.current
      if (joystick.active) {
        // Base
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(joystick.startX, joystick.startY, joystick.radius, 0, Math.PI * 2)
        ctx.stroke()

        // Stick central
        ctx.fillStyle = 'rgba(6, 182, 212, 0.5)'
        ctx.beginPath()
        ctx.arc(joystick.curX, joystick.curY, 16, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // CICLO DE ANIMACIÓN
    const tick = () => {
      update()
      draw()
      animFrameId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(animFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // Evento al interactuar con un nodo
  const handleInteract = (node: InteractiveNode) => {
    playSFX('portal')
    setActiveNode(node)
    setModalOpen(true)
  }

  // Manejo de eventos de ratón/táctil en el Canvas (Click-to-Move / Joystick)
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    initAudio() // Iniciar audio en primer click

    const clientX = e.clientX - rect.left
    const clientY = e.clientY - rect.top

    // Escalar coordenadas lógicas del Canvas dinámico
    const x = (clientX / rect.width) * canvasRef.current.width
    const y = (clientY / rect.height) * canvasRef.current.height

    // Comprobar si hizo click en un nodo directamente
    let clickedNode = false
    nodes.current.forEach((node) => {
      const dist = Math.hypot(x - node.x, y - node.y)
      if (dist < node.radius + 10) {
        clickedNode = true
        handleInteract(node)
      }
    })

    if (!clickedNode) {
      mouseRef.current.targetX = x
      mouseRef.current.targetY = y
      playSFX('click')
    }
  }

  // Soporte Táctil (Joystick móvil)
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect || !canvasRef.current) return

    initAudio() // Iniciar audio en primer toque

    const touch = e.targetTouches[0]
    const clientX = touch.clientX - rect.left
    const clientY = touch.clientY - rect.top

    const x = (clientX / rect.width) * canvasRef.current.width
    const y = (clientY / rect.height) * canvasRef.current.height

    // Si toca en la mitad izquierda, activar Joystick virtual
    if (x < canvasRef.current.width * 0.4) {
      joystickRef.current = {
        active: true,
        startX: x,
        startY: y,
        curX: x,
        curY: y,
        radius: 40,
      }
    } else {
      // Si toca en la mitad derecha, comprobar si toca un nodo, o mover avatar
      let clickedNode = false
      nodes.current.forEach((node) => {
        const dist = Math.hypot(x - node.x, y - node.y)
        if (dist < node.radius + 15) {
          clickedNode = true
          handleInteract(node)
        }
      })

      if (!clickedNode) {
        mouseRef.current.targetX = x
        mouseRef.current.targetY = y
        playSFX('click')
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect || !joystickRef.current.active || !canvasRef.current) return

    const touch = e.targetTouches[0]
    const clientX = touch.clientX - rect.left
    const clientY = touch.clientY - rect.top

    const x = (clientX / rect.width) * canvasRef.current.width
    const y = (clientY / rect.height) * canvasRef.current.height

    const joystick = joystickRef.current
    const dx = x - joystick.startX
    const dy = y - joystick.startY
    const dist = Math.hypot(dx, dy)

    if (dist <= joystick.radius) {
      joystick.curX = x
      joystick.curY = y
    } else {
      // Limitar al radio del joystick
      joystick.curX = joystick.startX + (dx / dist) * joystick.radius
      joystick.curY = joystick.startY + (dy / dist) * joystick.radius
    }
  }

  const handleTouchEnd = () => {
    joystickRef.current.active = false
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-black overflow-hidden no-print">
      {/* HUD superior */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-primary/20 bg-muted/20 font-mono text-xs text-muted-foreground select-none z-20 relative shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <span className="inline-block size-2 rounded-full bg-cyan-400 animate-ping" />
            CYBER_DRON v2.0
          </span>
          <span className="hidden sm:inline border-l border-border/40 pl-3">
            SISTEMAS DECODIFICADOS: {collectedCount}/6 CHIPS
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Botón de control de Audio */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAudio}
            className="hover:bg-primary/20 hover:text-primary transition-all duration-300 text-muted-foreground h-8 w-8"
            title="Activar/Desactivar efectos y sintetizador"
          >
            {audioEnabled ? <Volume2 className="size-4 text-primary" /> : <VolumeX className="size-4" />}
          </Button>
        </div>
      </div>

      {/* Contenedor del Canvas */}
      <div className="relative flex-1 bg-[#05070f] overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full block cursor-crosshair touch-none"
        />

        {/* Tutorial superpuesto al iniciar */}
        {showTutorial && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center z-30 font-mono transition-all animate-fade-in">
            <h3 className="text-primary font-bold text-lg mb-3 tracking-widest text-glow-primary">
              CONEXIÓN INICIALIZADA: PORTAFOLIO_V2.BIN
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mb-6 leading-relaxed">
              Estás controlando un dron cibernético en la red de Romulo Miranda. Explora el mapa para interactuar con sus servidores de información y recolectar sus habilidades.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mb-6 text-left text-[11px] text-foreground">
              <div className="border border-primary/20 bg-muted/20 p-3 rounded-lg flex flex-col items-center text-center">
                <Keyboard className="size-6 text-cyan-400 mb-2" />
                <span className="font-bold">TECLADO</span>
                <span className="text-muted-foreground mt-1">Usa WASD o Flechas para moverte.</span>
              </div>
              <div className="border border-primary/20 bg-muted/20 p-3 rounded-lg flex flex-col items-center text-center">
                <MousePointerClick className="size-6 text-pink-400 mb-2" />
                <span className="font-bold">CLICK</span>
                <span className="text-muted-foreground mt-1">Haz click en el mapa para caminar.</span>
              </div>
              <div className="border border-primary/20 bg-muted/20 p-3 rounded-lg flex flex-col items-center text-center">
                <Smartphone className="size-6 text-emerald-400 mb-2" />
                <span className="font-bold">MÓVIL</span>
                <span className="text-muted-foreground mt-1">Usa el Joystick táctil izquierdo.</span>
              </div>
              <div className="border border-primary/20 bg-muted/20 p-3 rounded-lg flex flex-col items-center text-center">
                <HelpCircle className="size-6 text-amber-400 mb-2" />
                <span className="font-bold">INTERACTUAR</span>
                <span className="text-muted-foreground mt-1">Acércate a un nodo y pulsa Enter.</span>
              </div>
            </div>

            <Button
              onClick={() => {
                setShowTutorial(false)
                initAudio()
              }}
              className="px-6 py-5 bg-primary border border-primary-foreground/20 hover:scale-105 transition-all text-xs font-bold"
            >
              [INICIALIZAR INTERFAZ CYBER_DRON]
            </Button>
          </div>
        )}
      </div>

      {/* HUD Inferior - Inventario de chips */}
      <div className="px-6 py-3 border-t border-primary/20 bg-muted/20 font-mono text-[10px] text-muted-foreground flex flex-col sm:flex-row justify-between items-center gap-2 select-none">
        <div className="flex items-center gap-2">
          <span>CHIPS RECOLECTADOS:</span>
          <div className="flex gap-1.5">
            {skillsList.current.map((skill, index) => (
              <span
                key={index}
                className={`px-1.5 py-0.5 rounded border text-[8px] font-bold ${
                  skill.collected
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 animate-pulse'
                    : 'bg-muted/10 border-border/40 text-muted-foreground/40'
                }`}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span>COOPERACIÓN: CYBER_LINK EN ESPAÑOL/ENGLISH</span>
          <span className="text-primary font-bold">STATUS // LOADED</span>
        </div>
      </div>

      {/* Modal holográfico */}
      <GameModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          // Hacer focus de vuelta en el canvas
          canvasRef.current?.focus()
        }}
        type={activeNode?.id || null}
        title={activeNode?.name || ''}
        contentProps={{
          name: name,
          avatarUrl: avatarUrl,
          location: location,
        }}
      />
    </div>
  )
}
