import * as THREE from 'three'

export class EnvironmentManager {
  public group: THREE.Group
  private gridMesh: THREE.Mesh
  private gridOriginalVertices: Float32Array
  private starfield: THREE.Points
  private time: number = 0

  constructor() {
    this.group = new THREE.Group()

    // 1. ILUMINACIÓN ESPACIAL DE ALTO CONTRASTE
    const ambientLight = new THREE.AmbientLight(0x0a1026, 1.8)
    this.group.add(ambientLight)

    const cyanKeyLight = new THREE.DirectionalLight(0x00f2fe, 2.5)
    cyanKeyLight.position.set(100, 150, 80)
    this.group.add(cyanKeyLight)

    const purpleRimLight = new THREE.DirectionalLight(0xa855f7, 2.0)
    purpleRimLight.position.set(-100, -50, -80)
    this.group.add(purpleRimLight)

    // 2. REJILLA ONDULANTE HIPERDIMENSIONAL (Neon Wave Grid)
    const gridGeo = new THREE.PlaneGeometry(700, 700, 70, 70)
    gridGeo.rotateX(-Math.PI / 2)

    this.gridOriginalVertices = gridGeo.attributes.position.array.slice() as Float32Array

    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    })
    this.gridMesh = new THREE.Mesh(gridGeo, gridMat)
    this.gridMesh.position.y = -35
    this.group.add(this.gridMesh)

    // 3. CAMPO ESTELAR PROFUNDO (Volumetric Starfield)
    const starCount = 1400
    const starGeo = new THREE.BufferGeometry()
    const starPositions = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)

    const colorPalette = [
      new THREE.Color(0x00f2fe), // Cyan
      new THREE.Color(0xa855f7), // Violeta
      new THREE.Color(0xffffff), // Blanco
      new THREE.Color(0x38bdf8), // Azul celeste
      new THREE.Color(0xf43f5e), // Rosa
    ]

    for (let i = 0; i < starCount; i++) {
      // Distribuir en una esfera inmensa
      const r = 350 + Math.random() * 250
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      starPositions[i * 3 + 2] = r * Math.cos(phi)

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      starColors[i * 3] = color.r
      starColors[i * 3 + 1] = color.g
      starColors[i * 3 + 2] = color.b
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))

    const starMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    })
    this.starfield = new THREE.Points(starGeo, starMat)
    this.group.add(this.starfield)

    // 4. POLVO ESPACIAL CIBERNÉTICO (Floating Micro-Particles)
    const dustCount = 300
    const dustGeo = new THREE.BufferGeometry()
    const dustPositions = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 400
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 120 + 20
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 400
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
    const dustMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.6,
      transparent: true,
      opacity: 0.4,
    })
    const dustPoints = new THREE.Points(dustGeo, dustMat)
    this.group.add(dustPoints)
  }

  public update(delta: number) {
    this.time += delta * 1.5

    // Animación de ondas en la rejilla inferior
    const pos = this.gridMesh.geometry.attributes.position
    const array = pos.array as Float32Array

    for (let i = 0; i < array.length; i += 3) {
      const origX = this.gridOriginalVertices[i]
      const origZ = this.gridOriginalVertices[i + 2]

      // Ondulación senoidal y cosenoidal combinada
      array[i + 1] =
        Math.sin(origX * 0.04 + this.time) * 3.5 +
        Math.cos(origZ * 0.04 + this.time * 0.8) * 3.5
    }
    pos.needsUpdate = true

    // Rotación sutil del campo estelar
    this.starfield.rotation.y += 0.02 * delta
    this.starfield.rotation.x += 0.01 * delta
  }
}
