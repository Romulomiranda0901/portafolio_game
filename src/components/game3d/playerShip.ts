import * as THREE from 'three'
import { FlightInput } from './types'

export class PlayerShip {
  public group: THREE.Group
  public velocity: THREE.Vector3 = new THREE.Vector3()
  public speed: number = 0
  public maxSpeed: number = 55
  public boostMultiplier: number = 2.0
  public acceleration: number = 45
  public damping: number = 0.96

  // Rotaciones y física de banqueo (banking)
  public yawSpeed: number = 1.8
  public pitchSpeed: number = 1.4
  public rollAngle: number = 0
  public maxRoll: number = 0.65

  // Componentes visuales
  private hull: THREE.Mesh
  private gyroRing1: THREE.Mesh
  private gyroRing2: THREE.Mesh
  private quantumCore: THREE.Mesh
  private leftEngineFlame: THREE.Mesh
  private rightEngineFlame: THREE.Mesh
  private headlight: THREE.SpotLight

  // Partículas de estela de motor
  private trailParticles: THREE.Points
  private trailGeo: THREE.BufferGeometry
  private trailPositions: Float32Array
  private trailAlphas: Float32Array
  private trailCount: number = 80
  private trailIndex: number = 0

  constructor() {
    this.group = new THREE.Group()

    // 1. FUSELAJE PRINCIPAL (Cuerpo central afilado)
    const hullGeo = new THREE.ConeGeometry(1.6, 5.2, 5)
    hullGeo.rotateX(Math.PI / 2) // Orientar hacia adelante en el eje -Z
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x070b19,
      roughness: 0.25,
      metalness: 0.9,
      flatShading: true,
    })
    this.hull = new THREE.Mesh(hullGeo, hullMat)
    this.group.add(this.hull)

    // Alas Delta estilizadas
    const wingShape = new THREE.Shape()
    wingShape.moveTo(0, 0)
    wingShape.lineTo(4.2, -1.8)
    wingShape.lineTo(4.4, -2.4)
    wingShape.lineTo(0.8, -2.0)
    wingShape.lineTo(-0.8, -2.0)
    wingShape.lineTo(-4.4, -2.4)
    wingShape.lineTo(-4.2, -1.8)
    wingShape.closePath()

    const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.08, bevelThickness: 0.08 }
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings)
    wingGeo.rotateX(Math.PI / 2)
    wingGeo.translate(0, 0, 0.4)
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x0c1228,
      roughness: 0.3,
      metalness: 0.85,
    })
    const wings = new THREE.Mesh(wingGeo, wingMat)
    this.group.add(wings)

    // Tiras de neón en los bordes de las alas (Emissive Lines)
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe })
    const leftEdgeGeo = new THREE.BoxGeometry(0.08, 0.08, 3.2)
    leftEdgeGeo.rotateY(0.4)
    const leftEdge = new THREE.Mesh(leftEdgeGeo, edgeMat)
    leftEdge.position.set(-2.6, 0, -0.6)
    this.group.add(leftEdge)

    const rightEdgeGeo = new THREE.BoxGeometry(0.08, 0.08, 3.2)
    rightEdgeGeo.rotateY(-0.4)
    const rightEdge = new THREE.Mesh(rightEdgeGeo, edgeMat)
    rightEdge.position.set(2.6, 0, -0.6)
    this.group.add(rightEdge)

    // 2. CABINA HOLOGRÁFICA (Cockpit)
    const cockpitGeo = new THREE.SphereGeometry(0.7, 12, 10)
    cockpitGeo.scale(0.8, 0.5, 1.8)
    const cockpitMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f2fe,
      emissive: 0x0088aa,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.8,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.6,
    })
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat)
    cockpit.position.set(0, 0.45, -0.6)
    this.group.add(cockpit)

    // 3. ANILLOS GIROSCÓPICOS CUÁNTICOS (Gyro-Rings)
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true })
    const ringGeo1 = new THREE.TorusGeometry(2.2, 0.04, 8, 32)
    this.gyroRing1 = new THREE.Mesh(ringGeo1, ringMat1)
    this.group.add(this.gyroRing1)

    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true })
    const ringGeo2 = new THREE.TorusGeometry(2.5, 0.04, 8, 32)
    this.gyroRing2 = new THREE.Mesh(ringGeo2, ringMat2)
    this.group.add(this.gyroRing2)

    // 4. NÚCLEO CUÁNTICO CENTRAL (Reactor)
    const coreGeo = new THREE.IcosahedronGeometry(0.5, 2)
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true })
    this.quantumCore = new THREE.Mesh(coreGeo, coreMat)
    this.quantumCore.position.set(0, 0, 0.2)
    this.group.add(this.quantumCore)

    // 5. TOBERAS DE PROPULSIÓN Y FLAMAS DE PLASMA
    const flameGeo = new THREE.ConeGeometry(0.35, 1.8, 8)
    flameGeo.rotateX(-Math.PI / 2) // Apuntar hacia atrás (+Z)
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.85,
    })

    this.leftEngineFlame = new THREE.Mesh(flameGeo, flameMat)
    this.leftEngineFlame.position.set(-0.85, 0, 2.0)
    this.group.add(this.leftEngineFlame)

    this.rightEngineFlame = new THREE.Mesh(flameGeo, flameMat.clone())
    this.rightEngineFlame.position.set(0.85, 0, 2.0)
    this.group.add(this.rightEngineFlame)

    // 6. FAROS DE ILUMINACIÓN HOLOGRÁFICA DIRECCIONAL
    this.headlight = new THREE.SpotLight(0x00f2fe, 5, 120, Math.PI / 4, 0.4, 1.2)
    this.headlight.position.set(0, 0.5, -2)
    const targetObj = new THREE.Object3D()
    targetObj.position.set(0, 0, -40)
    this.group.add(targetObj)
    this.headlight.target = targetObj
    this.group.add(this.headlight)

    // 7. SISTEMA DE PARTÍCULAS PARA ESTELA DE MOTOR (Engine Trails)
    this.trailPositions = new Float32Array(this.trailCount * 3)
    this.trailAlphas = new Float32Array(this.trailCount)

    this.trailGeo = new THREE.BufferGeometry()
    this.trailGeo.setAttribute('position', new THREE.BufferAttribute(this.trailPositions, 3))

    const trailMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.8,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    })
    this.trailParticles = new THREE.Points(this.trailGeo, trailMat)
    // El sistema de partículas de estela se añade a la escena global o al mundo
  }

  public update(delta: number, input: FlightInput) {
    // 1. ANIMACIÓN DE GIROSCÓPIOS Y REACTOR
    this.gyroRing1.rotation.z += 1.8 * delta
    this.gyroRing1.rotation.x += 1.2 * delta

    this.gyroRing2.rotation.y += 2.2 * delta
    this.gyroRing2.rotation.z -= 1.5 * delta

    this.quantumCore.rotation.x += 3.0 * delta
    this.quantumCore.rotation.y += 2.5 * delta

    // 2. CÁLCULO DE PROPULSIÓN Y VELOCIDAD
    const isBoosting = input.boost
    const currentMaxSpeed = isBoosting ? this.maxSpeed * this.boostMultiplier : this.maxSpeed

    let targetSpeed = 0
    if (input.forward > 0) targetSpeed = currentMaxSpeed * input.forward
    if (input.backward > 0) targetSpeed = -currentMaxSpeed * 0.4 * input.backward

    // Aceleración suave
    this.speed = THREE.MathUtils.lerp(this.speed, targetSpeed, 2.5 * delta)

    // 3. GIRO EN YAW (Izquierda / Derecha)
    const turnVal = input.turnRight - input.turnLeft
    this.group.rotation.y -= turnVal * this.yawSpeed * delta

    // 4. CABECEO EN PITCH (Subir / Bajar)
    const pitchVal = input.pitchDown - input.pitchUp
    this.group.rotation.x = THREE.MathUtils.lerp(this.group.rotation.x, pitchVal * 0.45, 3.5 * delta)

    // 5. BANQUEO EN ROLL (Inclinación dinámica de alas al girar)
    const targetRoll = -turnVal * this.maxRoll
    this.rollAngle = THREE.MathUtils.lerp(this.rollAngle, targetRoll, 4.0 * delta)
    this.group.rotation.z = this.rollAngle

    // 6. TRASLACIÓN HACIA ADELANTE EN EL ESPACIO 3D LOCAL (-Z)
    const forwardVector = new THREE.Vector3(0, 0, -1)
    forwardVector.applyQuaternion(this.group.quaternion)

    this.velocity.copy(forwardVector).multiplyScalar(this.speed * delta)
    this.group.position.add(this.velocity)

    // Amortiguación perimetral (no perderse en el vacío infinito: límite suave a radio 400)
    const distFromOrigin = this.group.position.length()
    if (distFromOrigin > 380) {
      const pull = this.group.position.clone().negate().normalize().multiplyScalar((distFromOrigin - 380) * 0.05)
      this.group.position.add(pull)
    }

    // 7. ESCALADO DE FLAMAS DE MOTOR SEGÚN VELOCIDAD
    const flameScale = Math.max(0.2, (Math.abs(this.speed) / this.maxSpeed) * (isBoosting ? 2.5 : 1.4))
    this.leftEngineFlame.scale.set(1, 1, flameScale)
    this.rightEngineFlame.scale.set(1, 1, flameScale)

    // Color de las flamas si está en modo Boost
    const flameColor = isBoosting ? 0xf43f5e : 0x00f2fe
    ;(this.leftEngineFlame.material as THREE.MeshBasicMaterial).color.setHex(flameColor)
    ;(this.rightEngineFlame.material as THREE.MeshBasicMaterial).color.setHex(flameColor)
  }

  public setPosition(x: number, y: number, z: number) {
    this.group.position.set(x, y, z)
  }
}
