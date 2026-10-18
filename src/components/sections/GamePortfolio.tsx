/**
 * Motor de Juego 3D (GamePortfolio).
 * Simulación de Vuelo Espacial Hiperdimensional desarrollada con Three.js:
 * Pilota un dron cuántico en un espacio cibernético 3D, explora monolitos holográficos,
 * recolecta fragmentos de datos y experimenta saltos hiperespaciales en tiempo real.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import {
  Keyboard,
  MousePointerClick,
  Smartphone,
  HelpCircle,
  Zap,
  Target,
  Camera,
  Compass,
  Radar,
  Radio,
  Eye,
  Maximize2,
} from 'lucide-react'
import { Button } from '../ui/button'
import GameModal from './GameModal'
import { PlayerShip } from '../game3d/playerShip'
import { StationManager } from '../game3d/stations'
import { CollectibleManager } from '../game3d/collectibles'
import { EnvironmentManager } from '../game3d/environment'
import { CameraMode, FlightInput, StationData } from '../game3d/types'
import { soundEngine } from '../../lib/soundEngine'

interface GamePortfolioProps {
  name: string
  avatarUrl?: string
  location?: string
}

export default function GamePortfolio({ name, avatarUrl, location }: GamePortfolioProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null)

  // Referencias a los componentes de Three.js
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)

  // Entidades 3D
  const playerRef = useRef<PlayerShip | null>(null)
  const stationsRef = useRef<StationManager | null>(null)
  const collectiblesRef = useRef<CollectibleManager | null>(null)
  const envRef = useRef<EnvironmentManager | null>(null)

  // Entrada de controles
  const inputRef = useRef<FlightInput>({
    forward: 0,
    backward: 0,
    turnLeft: 0,
    turnRight: 0,
    pitchUp: 0,
    pitchDown: 0,
    boost: false,
  })

  const keysDown = useRef<{ [key: string]: boolean }>({})

  // Estado del Joystick virtual móvil
  const touchJoystick = useRef<{
    active: boolean
    identifier: number | null
    startX: number
    startY: number
    curX: number
    curY: number
    radius: number
  }>({
    active: false,
    identifier: null,
    startX: 0,
    startY: 0,
    curX: 0,
    curY: 0,
    radius: 45,
  })

  // Estado de React
  const [cameraMode, setCameraMode] = useState<CameraMode>('chase')
  const [activeModalStation, setActiveModalStation] = useState<StationData | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [collectedCount, setCollectedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(8)
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [isBoosting, setIsBoosting] = useState(false)
  const [nearestStationInfo, setNearestStationInfo] = useState<{ station: StationData; distance: number } | null>(null)
  const [showTutorial, setShowTutorial] = useState(true)
  const [warpActive, setWarpActive] = useState(false)

  // Salto Hiperespacial Cuántico hacia una estación
  const handleWarpToStation = useCallback((stationId: string) => {
    if (!stationsRef.current || !playerRef.current) return
    const targetStation = stationsRef.current.getStationById(stationId)
    if (!targetStation) return

    soundEngine.play('warp')
    setWarpActive(true)

    const player = playerRef.current
    const startPos = player.group.position.clone()

    // Posicionarse a 25 unidades frente a la estación
    const targetOffset = new THREE.Vector3(0, 0, 24)
    const endPos = targetStation.position.clone().add(targetOffset)

    let step = 0
    const totalSteps = 28

    const warpInterval = setInterval(() => {
      step++
      const progress = step / totalSteps
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2 // Cosine easing

      player.group.position.lerpVectors(startPos, endPos, ease)
      player.group.lookAt(targetStation.position)

      if (step >= totalSteps) {
        clearInterval(warpInterval)
        setWarpActive(false)
        player.speed = 0
        // Desplegar automáticamente la compuerta del expediente
        soundEngine.play('portal')
        setActiveModalStation(targetStation)
        setModalOpen(true)
      }
    }, 16)
  }, [])

  // Inicializar Motor 3D Three.js
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. ESCENA, CÁMARA Y RENDERIZADOR
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x030712)
    scene.fog = new THREE.FogExp2(0x030712, 0.0022) // Niebla espacial para profundidad
    sceneRef.current = scene

    const width = container.clientWidth
    const height = container.clientHeight

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000)
    camera.position.set(0, 15, 30)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    rendererRef.current = renderer

    container.appendChild(renderer.domElement)

    // 2. CREACIÓN DE ENTIDADES
    const env = new EnvironmentManager()
    scene.add(env.group)
    envRef.current = env

    const stations = new StationManager()
    scene.add(stations.group)
    stationsRef.current = stations

    const collectibles = new CollectibleManager()
    scene.add(collectibles.group)
    collectiblesRef.current = collectibles
    setTotalCount(collectibles.getTotalCount())

    const player = new PlayerShip()
    player.setPosition(0, 10, 0)
    scene.add(player.group)
    playerRef.current = player

    // 3. EVENTOS DE REDIMENSIONADO
    const handleResize = () => {
      if (!container || !renderer || !camera) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // 4. BUCLE DE ANIMACIÓN 60 FPS
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const delta = Math.min(clock.getDelta(), 0.1)

      // Actualizar entorno y estaciones
      env.update(delta)
      stations.update(delta)

      // Actualizar entrada de controles
      const input = inputRef.current
      // Procesar teclado
      input.forward = keysDown.current['w'] || keysDown.current['arrowup'] ? 1 : 0
      input.backward = keysDown.current['s'] || keysDown.current['arrowdown'] ? 1 : 0
      input.turnLeft = keysDown.current['a'] || keysDown.current['arrowleft'] ? 1 : 0
      input.turnRight = keysDown.current['d'] || keysDown.current['arrowright'] ? 1 : 0
      input.pitchUp = keysDown.current[' '] ? 1 : 0
      input.pitchDown = keysDown.current['c'] || keysDown.current['control'] ? 1 : 0
      input.boost = !!keysDown.current['shift'] || isBoosting

      // Si el joystick táctil está activo, sobreescribir entradas
      const joy = touchJoystick.current
      if (joy.active) {
        const dx = joy.curX - joy.startX
        const dy = joy.curY - joy.startY
        const dist = Math.hypot(dx, dy)

        if (dist > 8) {
          const normX = dx / joy.radius
          const normY = dy / joy.radius

          if (normY < -0.2) input.forward = Math.min(1, -normY)
          if (normY > 0.2) input.backward = Math.min(1, normY)
          if (normX < -0.2) input.turnLeft = Math.min(1, -normX)
          if (normX > 0.2) input.turnRight = Math.min(1, normX)
        }
      }

      // Actualizar nave del jugador
      player.update(delta, input)
      setCurrentSpeed(Math.round(Math.abs(player.speed) * 3))

      // Comprobar recolección de fragmentos cuánticos
      const collectedShard = collectibles.update(delta, player.group.position)
      if (collectedShard) {
        soundEngine.play('collect')
        setCollectedCount(collectibles.getCollectedCount())
      }

      // Detección de proximidad a estaciones
      const nearest = stations.getNearestStation(player.group.position)
      if (nearest) {
        setNearestStationInfo(nearest)

        // Si está a distancia de interacción y pulsa Enter
        if (nearest.distance < nearest.station.radius && keysDown.current['enter']) {
          keysDown.current['enter'] = false
          soundEngine.play('portal')
          setActiveModalStation(nearest.station)
          setModalOpen(true)
        }
      }

      // 5. CÁMARA DINÁMICA
      if (cameraMode === 'chase') {
        // Cámara en tercera persona cinemática detrás de la nave
        const offset = new THREE.Vector3(0, 5.5, 14)
        offset.applyQuaternion(player.group.quaternion)
        const targetCamPos = player.group.position.clone().add(offset)
        camera.position.lerp(targetCamPos, 8.0 * delta)

        const lookTarget = player.group.position.clone().add(new THREE.Vector3(0, 1.2, -6).applyQuaternion(player.group.quaternion))
        camera.lookAt(lookTarget)

        // Efecto FOV de velocidad/Warp
        const targetFov = input.boost ? 78 : 65
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 4 * delta)
        camera.updateProjectionMatrix()
      } else if (cameraMode === 'cockpit') {
        // Cámara en primera persona desde el interior de la cabina
        const cockpitPos = player.group.position.clone().add(new THREE.Vector3(0, 0.7, -1.2).applyQuaternion(player.group.quaternion))
        camera.position.copy(cockpitPos)

        const lookAtPoint = player.group.position.clone().add(new THREE.Vector3(0, 0.7, -50).applyQuaternion(player.group.quaternion))
        camera.lookAt(lookAtPoint)
      }

      // Renderizar
      renderer.render(scene, camera)

      // Actualizar radar minimap 2D
      drawRadar()
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [cameraMode, isBoosting])

  // Dibujar Minimap Radar
  const drawRadar = () => {
    const radar = radarCanvasRef.current
    if (!radar || !playerRef.current || !stationsRef.current) return
    const ctx = radar.getContext('2d')
    if (!ctx) return

    const w = radar.width
    const h = radar.height
    const cx = w / 2
    const cy = h / 2
    const scale = 0.28 // Escala de visualización del radar

    ctx.clearRect(0, 0, w, h)

    // Base del radar
    ctx.fillStyle = 'rgba(6, 9, 25, 0.85)'
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(cx, cy, cx - 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Círculos concéntricos de rango
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(cx, cy, (cx - 2) * 0.5, 0, Math.PI * 2)
    ctx.arc(cx, cy, (cx - 2) * 0.8, 0, Math.PI * 2)
    ctx.stroke()

    const playerPos = playerRef.current.group.position
    const playerRot = playerRef.current.group.rotation.y

    // Dibujar estaciones en el radar relativas al jugador
    stationsRef.current.stations.forEach((st) => {
      const dx = (st.data.position.x - playerPos.x) * scale
      const dz = (st.data.position.z - playerPos.z) * scale

      // Rotar según la orientación del jugador para que el frente siempre sea arriba
      const rx = dx * Math.cos(-playerRot) - dz * Math.sin(-playerRot)
      const ry = dx * Math.sin(-playerRot) + dz * Math.cos(-playerRot)

      const drawX = cx + rx
      const drawY = cy + ry

      if (Math.hypot(rx, ry) < cx - 6) {
        ctx.fillStyle = st.data.color
        ctx.beginPath()
        ctx.arc(drawX, drawY, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Jugador en el centro
    ctx.fillStyle = '#00f2fe'
    ctx.beginPath()
    ctx.moveTo(cx, cy - 5)
    ctx.lineTo(cx - 4, cy + 4)
    ctx.lineTo(cx + 4, cy + 4)
    ctx.closePath()
    ctx.fill()
  }

  // Manejo de eventos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      keysDown.current[key] = true

      // Cambiar de cámara con la tecla C
      if (key === 'c') {
        soundEngine.play('click')
        setCameraMode((prev) => (prev === 'chase' ? 'cockpit' : 'chase'))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      keysDown.current[key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Eventos táctiles para el joystick
  const handleTouchStart = (e: React.TouchEvent) => {
    soundEngine.init()
    const touch = e.changedTouches[0]
    if (touch.clientX < window.innerWidth * 0.45) {
      touchJoystick.current = {
        active: true,
        identifier: touch.identifier,
        startX: touch.clientX,
        startY: touch.clientY,
        curX: touch.clientX,
        curY: touch.clientY,
        radius: 45,
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchJoystick.current.active) return
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      if (touch.identifier === touchJoystick.current.identifier) {
        touchJoystick.current.curX = touch.clientX
        touchJoystick.current.curY = touch.clientY
      }
    }
  }

  const handleTouchEnd = () => {
    touchJoystick.current.active = false
  }

  return (
    <div
      className="relative w-full h-full flex flex-col bg-[#030712] overflow-hidden select-none font-mono"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* HUD Telemetría Superior */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2 border-b border-cyan-500/20 bg-[#060919]/90 text-[11px] text-muted-foreground z-20 relative shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <span className="inline-block size-2 rounded-full bg-cyan-400 animate-ping" />
            SIMULADOR 3D // 60 FPS
          </span>
          <span className="hidden sm:inline-block border-l border-cyan-500/20 pl-3 text-cyan-200/80">
            VELOCIDAD: <span className="text-cyan-300 font-bold">{currentSpeed} KTS</span>
          </span>
          <span className="hidden md:inline-block border-l border-cyan-500/20 pl-3 text-purple-300/80">
            SHARDS: <span className="text-purple-300 font-bold">{collectedCount}/{totalCount}</span>
          </span>
        </div>

        {/* Controles de Cámara y Ayuda */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              soundEngine.play('click')
              setCameraMode((prev) => (prev === 'chase' ? 'cockpit' : 'chase'))
            }}
            className="h-7 px-2.5 text-[10px] border border-cyan-500/30 text-cyan-300 bg-cyan-950/20 hover:bg-cyan-500/20"
          >
            <Camera className="size-3 mr-1" />
            <span>CAM: {cameraMode.toUpperCase()}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              soundEngine.play('chirp')
              setShowTutorial(true)
            }}
            className="h-7 px-2 text-[10px] text-muted-foreground hover:text-cyan-400"
          >
            <HelpCircle className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Contenedor del Lienzo 3D WebGL */}
      <div ref={containerRef} className="relative flex-1 w-full h-full cursor-crosshair overflow-hidden">
        {/* Retícula Táctica Central del Piloto */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-70">
          <div className="relative size-12 border border-cyan-400/40 rounded-full flex items-center justify-center">
            <div className="size-1 rounded-full bg-cyan-400" />
            <div className="absolute top-0 w-0.5 h-2 bg-cyan-400/60" />
            <div className="absolute bottom-0 w-0.5 h-2 bg-cyan-400/60" />
            <div className="absolute left-0 h-0.5 w-2 bg-cyan-400/60" />
            <div className="absolute right-0 h-0.5 w-2 bg-cyan-400/60" />
          </div>
        </div>

        {/* Alerta Holográfica de Proximidad a Estación */}
        {nearestStationInfo && nearestStationInfo.distance < nearestStationInfo.station.radius + 15 && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-fade-in pointer-events-auto">
            <div className="px-5 py-3 rounded-lg border border-cyan-400 bg-[#060919]/90 shadow-[0_0_30px_rgba(0,242,254,0.3)] backdrop-blur-md text-center max-w-sm">
              <span className="text-[10px] text-cyan-400 font-bold block mb-0.5">
                {nearestStationInfo.station.code} // DETECTADO
              </span>
              <h3 className="font-display text-sm font-bold text-white mb-1">
                {nearestStationInfo.station.name}
              </h3>
              <p className="text-[10px] text-muted-foreground mb-3">
                DISTANCIA: {Math.round(nearestStationInfo.distance)}m
              </p>

              <Button
                onClick={() => {
                  soundEngine.play('portal')
                  setActiveModalStation(nearestStationInfo.station)
                  setModalOpen(true)
                }}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs uppercase h-8 shadow-[0_0_15px_rgba(0,242,254,0.4)]"
              >
                [ PULSA ENTER O CLICK PARA ACCEDER ]
              </Button>
            </div>
          </div>
        )}

        {/* Radar Minimap 2D en Esquina Inferior Derecha */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-1.5 pointer-events-none">
          <span className="text-[9px] text-cyan-400 font-bold tracking-wider">RADAR CUÁNTICO 3D</span>
          <canvas
            ref={radarCanvasRef}
            width={120}
            height={120}
            className="rounded-full shadow-[0_0_20px_rgba(0,242,254,0.2)] border border-cyan-500/40"
          />
        </div>

        {/* Botón de Boost para móvil */}
        <div className="absolute bottom-5 left-5 z-20 sm:hidden">
          <Button
            onMouseDown={() => setIsBoosting(true)}
            onMouseUp={() => setIsBoosting(false)}
            onTouchStart={() => setIsBoosting(true)}
            onTouchEnd={() => setIsBoosting(false)}
            className="size-14 rounded-full bg-purple-500/30 border border-purple-400 text-purple-200 text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          >
            BOOST
          </Button>
        </div>

        {/* Tutorial / Guía de Inicio 3D */}
        {showTutorial && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 font-mono transition-all animate-fade-in">
            <div className="max-w-2xl w-full border border-cyan-500/30 bg-[#060919]/95 p-6 sm:p-8 rounded-xl shadow-[0_0_60px_rgba(0,242,254,0.2)] relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-3">
                <Radar className="size-3.5 animate-spin" />
                ENTORNO INTERACTIVO 3D // SISTEMAS & CÓDIGO
              </div>

              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide mb-2 glow-text-cyan">
                PORTAFOLIO INTERACTIVO 3D: ROMULO MIRANDA
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed font-sans max-w-lg mx-auto">
                Explora el espacio tridimensional de arquitectura de software. Navega hacia las estaciones interactivas, consulta proyectos de código y accede a las credenciales profesionales.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-left text-[11px] text-foreground">
                <div className="border border-cyan-500/20 bg-cyan-950/20 p-3 rounded-lg flex flex-col items-center text-center">
                  <Keyboard className="size-5 text-cyan-400 mb-1.5" />
                  <span className="font-bold text-white">MOVIMIENTO 3D</span>
                  <span className="text-muted-foreground text-[10px] mt-0.5">WASD o Flechas</span>
                </div>
                <div className="border border-cyan-500/20 bg-cyan-950/20 p-3 rounded-lg flex flex-col items-center text-center">
                  <Zap className="size-5 text-purple-400 mb-1.5" />
                  <span className="font-bold text-white">VELOCIDAD</span>
                  <span className="text-muted-foreground text-[10px] mt-0.5">Mantén Shift</span>
                </div>
                <div className="border border-cyan-500/20 bg-cyan-950/20 p-3 rounded-lg flex flex-col items-center text-center">
                  <Camera className="size-5 text-emerald-400 mb-1.5" />
                  <span className="font-bold text-white">CÁMARA</span>
                  <span className="text-muted-foreground text-[10px] mt-0.5">Tecla [C]</span>
                </div>
                <div className="border border-cyan-500/20 bg-cyan-950/20 p-3 rounded-lg flex flex-col items-center text-center">
                  <Compass className="size-5 text-rose-400 mb-1.5" />
                  <span className="font-bold text-white">ACCESO DIRECTO</span>
                  <span className="text-muted-foreground text-[10px] mt-0.5">Muelle inferior</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  soundEngine.init()
                  soundEngine.play('warp')
                  setShowTutorial(false)
                }}
                className="w-full sm:w-auto px-8 py-5 bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(0,242,254,0.4)]"
              >
                [ INICIAR EXPERIENCIA 3D ]
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Muelle Táctico Inferior: SALTO 3D DIRECTO */}
      <div className="px-3 sm:px-6 py-2.5 border-t border-cyan-500/20 bg-[#060919]/95 font-mono text-[11px] flex flex-col md:flex-row items-center justify-between gap-2.5 z-20 shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
          <Radio className="size-3 text-cyan-400 animate-pulse" />
          <span className="font-bold text-cyan-300">ACCESO RÁPIDO 3D:</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {[
            { id: 'about', label: 'SOBRE MÍ', color: '#00f2fe' },
            { id: 'experience', label: 'EXPERIENCIA', color: '#38bdf8' },
            { id: 'projects', label: 'PROYECTOS', color: '#f43f5e' },
            { id: 'skills', label: 'HABILIDADES', color: '#10b981' },
            { id: 'certifications', label: 'CREDENCIALES', color: '#f59e0b' },
            { id: 'contact', label: 'CONTACTAR', color: '#14b8a6' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleWarpToStation(item.id)}
              className="px-2.5 py-1 rounded border border-cyan-500/20 bg-black/40 text-muted-foreground hover:text-white hover:border-cyan-400/60 hover:bg-cyan-950/40 text-[10px] font-semibold transition-all duration-200 flex items-center gap-1"
            >
              <span className="size-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[10px] text-muted-foreground/80">
          <span>FRAGMENTS:</span>
          <span className="text-cyan-400 font-bold">{collectedCount}/{totalCount}</span>
        </div>
      </div>

      {/* Modal Holográfico Cuántico */}
      <GameModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={activeModalStation?.id || null}
        title={activeModalStation?.name || ''}
        code={activeModalStation?.code || ''}
        contentProps={{
          name: name,
          avatarUrl: avatarUrl,
          location: location,
        }}
      />
    </div>
  )
}
