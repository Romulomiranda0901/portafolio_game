import * as THREE from 'three'
import { CollectibleData } from './types'

export class CollectibleManager {
  public group: THREE.Group
  public collectibles: { data: CollectibleData; mesh: THREE.Mesh }[] = []
  private floatTime: number = 0

  constructor() {
    this.group = new THREE.Group()
    this.initCollectibles()
  }

  private initCollectibles() {
    const items: { name: string; category: string; pos: [number, number, number]; color: number }[] = [
      { name: 'TypeScript', category: 'frontend', pos: [-40, 10, -90], color: 0x00f2fe },
      { name: 'React 19', category: 'frontend', pos: [60, 18, -100], color: 0x38bdf8 },
      { name: 'Node.js', category: 'backend', pos: [-110, 15, 20], color: 0x4ade80 },
      { name: 'Laravel', category: 'backend', pos: [-60, 5, 80], color: 0xf43f5e },
      { name: 'Docker', category: 'devops', pos: [100, 20, 10], color: 0xc084fc },
      { name: 'ISO 27001', category: 'security', pos: [80, 5, 70], color: 0xfbbf24 },
      { name: 'Python ROMA', category: 'backend', pos: [0, 22, -60], color: 0x00ffff },
      { name: 'PostgreSQL', category: 'data', pos: [-20, 12, 110], color: 0x3b82f6 },
    ]

    items.forEach((item, index) => {
      const data: CollectibleData = {
        id: `shard-${index}`,
        name: item.name,
        category: item.category,
        position: new THREE.Vector3(...item.pos),
        color: `#${item.color.toString(16).padStart(6, '0')}`,
        collected: false,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 2 + 1,
          y: (Math.random() - 0.5) * 2 + 1.5,
          z: (Math.random() - 0.5) * 2 + 1,
        },
      }

      // Geometría del cristal octaédrico
      const shardGeo = new THREE.OctahedronGeometry(2.0, 0)
      const shardMat = new THREE.MeshStandardMaterial({
        color: item.color,
        emissive: item.color,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.9,
      })
      const mesh = new THREE.Mesh(shardGeo, shardMat)
      mesh.position.copy(data.position)

      // Halo de energía exterior
      const haloGeo = new THREE.TorusGeometry(3.0, 0.05, 6, 24)
      const haloMat = new THREE.MeshBasicMaterial({ color: item.color, wireframe: true })
      const halo = new THREE.Mesh(haloGeo, haloMat)
      mesh.add(halo)

      this.group.add(mesh)
      this.collectibles.push({ data, mesh })
    })
  }

  public update(delta: number, playerPos: THREE.Vector3): CollectibleData | null {
    this.floatTime += delta * 2.5
    let newlyCollected: CollectibleData | null = null

    this.collectibles.forEach((c) => {
      if (c.data.collected) return

      // Rotación y levitación flotante
      c.mesh.rotation.x += c.data.rotationSpeed.x * delta
      c.mesh.rotation.y += c.data.rotationSpeed.y * delta
      c.mesh.position.y = c.data.position.y + Math.sin(this.floatTime + c.mesh.position.x) * 1.5

      // Detección de colisión con el dron
      const dist = playerPos.distanceTo(c.mesh.position)
      if (dist < 6.5) {
        c.data.collected = true
        c.mesh.visible = false
        newlyCollected = c.data
      }
    })

    return newlyCollected
  }

  public getCollectedCount(): number {
    return this.collectibles.filter((c) => c.data.collected).length
  }

  public getTotalCount(): number {
    return this.collectibles.length
  }
}
