import * as THREE from 'three'
import { StationData } from './types'

export class StationManager {
  public group: THREE.Group
  public stations: { data: StationData; meshGroup: THREE.Group; beaconBeam?: THREE.Mesh; coreMesh?: THREE.Mesh }[] = []

  constructor() {
    this.group = new THREE.Group()
    this.initStations()
  }

  private initStations() {
    const rawStations: StationData[] = [
      {
        id: 'about',
        name: 'NÚCLEO BIOGRÁFICO',
        label: 'SOBRE MÍ',
        code: 'SEC_BIO // 01',
        description: 'Bitácora de arquitectura, perfil y visión técnica.',
        position: new THREE.Vector3(0, 15, -170),
        color: '#00f2fe',
        subColor: '#a855f7',
        radius: 35,
      },
      {
        id: 'skills',
        name: 'MATRIZ DE COMPETENCIAS',
        label: 'HABILIDADES',
        code: 'SEC_SKL // 04',
        description: 'Stacks de backend, frontend, cloud y pentesting.',
        position: new THREE.Vector3(-150, 20, -60),
        color: '#10b981',
        subColor: '#00f2fe',
        radius: 35,
      },
      {
        id: 'experience',
        name: 'REGISTROS TEMPORALES',
        label: 'EXPERIENCIA',
        code: 'SEC_XP // 02',
        description: 'Línea de tiempo de trayectoria y liderazgo de sistemas.',
        position: new THREE.Vector3(-120, -10, 130),
        color: '#38bdf8',
        subColor: '#a855f7',
        radius: 35,
      },
      {
        id: 'projects',
        name: 'SIMULADORES ARCADE',
        label: 'PROYECTOS',
        code: 'SEC_PRJ // 03',
        description: 'Sistemas desarrollados, IA y repositorios de código.',
        position: new THREE.Vector3(150, 25, -60),
        color: '#f43f5e',
        subColor: '#ec4899',
        radius: 35,
      },
      {
        id: 'certifications',
        name: 'BÓVEDA CRIPTOGRÁFICA',
        label: 'CREDENCIALES',
        code: 'SEC_CRT // 05',
        description: 'Maestrías, ISO 27001 y certificaciones auditadas.',
        position: new THREE.Vector3(140, -10, 120),
        color: '#f59e0b',
        subColor: '#fbbf24',
        radius: 35,
      },
      {
        id: 'contact',
        name: 'TERMINAL DE ENLACE',
        label: 'CONTACTAR',
        code: 'SEC_COM // 06',
        description: 'Uplink directo, transmisión cifrada y correo.',
        position: new THREE.Vector3(0, 25, 170),
        color: '#14b8a6',
        subColor: '#00f2fe',
        radius: 35,
      },
    ]

    rawStations.forEach((data) => {
      const stationGroup = new THREE.Group()
      stationGroup.position.copy(data.position)

      let coreMesh: THREE.Mesh | undefined
      let beaconBeam: THREE.Mesh | undefined

      const colorHex = new THREE.Color(data.color).getHex()
      const subColorHex = new THREE.Color(data.subColor).getHex()

      // 1. ANILLO PERIMETRAL EN EL SUELO (Zona de interacción)
      const ringGeo = new THREE.RingGeometry(data.radius - 0.5, data.radius + 0.5, 48)
      ringGeo.rotateX(-Math.PI / 2)
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      })
      const perimeterRing = new THREE.Mesh(ringGeo, ringMat)
      perimeterRing.position.y = -data.position.y // Pegado al plano Y=0
      stationGroup.add(perimeterRing)

      // 2. MONOLITO ESPECÍFICO SEGÚN TIPO
      if (data.id === 'about') {
        // Obelisco de Cristal Cuántico
        const obeliskGeo = new THREE.CylinderGeometry(1.5, 3.5, 18, 6)
        const obeliskMat = new THREE.MeshStandardMaterial({
          color: 0x050a1e,
          emissive: colorHex,
          emissiveIntensity: 0.3,
          roughness: 0.2,
          metalness: 0.9,
          wireframe: false,
        })
        coreMesh = new THREE.Mesh(obeliskGeo, obeliskMat)
        stationGroup.add(coreMesh)

        // Anillos orbitales flotantes
        const haloGeo = new THREE.TorusGeometry(8, 0.15, 8, 36)
        const haloMat = new THREE.MeshBasicMaterial({ color: colorHex, wireframe: true })
        const halo1 = new THREE.Mesh(haloGeo, haloMat)
        halo1.rotation.x = Math.PI / 2
        stationGroup.add(halo1)
      } else if (data.id === 'skills') {
        // Tesseract / Cubo Hiperdimensional
        const outerCubeGeo = new THREE.BoxGeometry(10, 10, 10)
        const outerCubeMat = new THREE.MeshBasicMaterial({ color: colorHex, wireframe: true })
        coreMesh = new THREE.Mesh(outerCubeGeo, outerCubeMat)
        stationGroup.add(coreMesh)

        const innerGeo = new THREE.IcosahedronGeometry(4, 1)
        const innerMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 0.5,
          roughness: 0.3,
          metalness: 0.8,
        })
        const innerMesh = new THREE.Mesh(innerGeo, innerMat)
        coreMesh.add(innerMesh)
      } else if (data.id === 'experience') {
        // Racks de Servidores Temporales
        const serverGroup = new THREE.Group()
        for (let i = -2; i <= 2; i++) {
          const rackGeo = new THREE.BoxGeometry(3.2, 14 + Math.abs(i) * 2, 3.2)
          const rackMat = new THREE.MeshStandardMaterial({
            color: 0x070d1e,
            emissive: colorHex,
            emissiveIntensity: 0.25,
            metalness: 0.85,
          })
          const rack = new THREE.Mesh(rackGeo, rackMat)
          rack.position.x = i * 4.2
          serverGroup.add(rack)
        }
        coreMesh = serverGroup as unknown as THREE.Mesh
        stationGroup.add(serverGroup)
      } else if (data.id === 'projects') {
        // Portal Cyber-Arcade (Vórtice)
        const portalGeo = new THREE.TorusGeometry(8.5, 1.2, 16, 40)
        const portalMat = new THREE.MeshStandardMaterial({
          color: 0x14051a,
          emissive: colorHex,
          emissiveIntensity: 0.8,
          metalness: 0.9,
        })
        coreMesh = new THREE.Mesh(portalGeo, portalMat)
        stationGroup.add(coreMesh)

        // Disco de energía interior
        const diskGeo = new THREE.CircleGeometry(7.2, 32)
        const diskMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.35,
        })
        const disk = new THREE.Mesh(diskGeo, diskMat)
        coreMesh.add(disk)
      } else if (data.id === 'certifications') {
        // Bóveda Octaédrica Dorada
        const octaGeo = new THREE.OctahedronGeometry(7, 0)
        const octaMat = new THREE.MeshStandardMaterial({
          color: 0x1a1505,
          emissive: colorHex,
          emissiveIntensity: 0.7,
          roughness: 0.15,
          metalness: 0.95,
        })
        coreMesh = new THREE.Mesh(octaGeo, octaMat)
        stationGroup.add(coreMesh)

        const shieldGeo = new THREE.TorusGeometry(10, 0.12, 6, 32)
        const shieldMat = new THREE.MeshBasicMaterial({ color: subColorHex })
        const shield = new THREE.Mesh(shieldGeo, shieldMat)
        shield.rotation.x = Math.PI / 4
        stationGroup.add(shield)
      } else if (data.id === 'contact') {
        // Antena Satelital con Haz de Luz Cósmico (Beacon Light Pillar)
        const beamGeo = new THREE.CylinderGeometry(0.8, 1.6, 300, 16, 1, true)
        const beamMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        })
        beaconBeam = new THREE.Mesh(beamGeo, beamMat)
        beaconBeam.position.y = 150
        stationGroup.add(beaconBeam)

        const dishGeo = new THREE.ConeGeometry(6, 3, 16, 1, true)
        dishGeo.rotateX(Math.PI)
        const dishMat = new THREE.MeshStandardMaterial({
          color: 0x051a18,
          emissive: colorHex,
          emissiveIntensity: 0.5,
          metalness: 0.9,
        })
        coreMesh = new THREE.Mesh(dishGeo, dishMat)
        stationGroup.add(coreMesh)
      }

      // Luz puntual local de cada estación
      const light = new THREE.PointLight(colorHex, 4, 70, 1.5)
      light.position.set(0, 5, 0)
      stationGroup.add(light)

      this.group.add(stationGroup)
      this.stations.push({ data, meshGroup: stationGroup, coreMesh, beaconBeam })
    })
  }

  public update(delta: number) {
    this.stations.forEach((st) => {
      if (st.coreMesh) {
        st.coreMesh.rotation.y += 0.5 * delta
        st.coreMesh.rotation.x += 0.2 * delta
      }
      if (st.beaconBeam) {
        st.beaconBeam.rotation.y += 0.3 * delta
      }
    })
  }

  public getNearestStation(pos: THREE.Vector3): { station: StationData; distance: number } | null {
    let nearest: StationData | null = null
    let minDist = Infinity

    this.stations.forEach((st) => {
      const dist = pos.distanceTo(st.data.position)
      if (dist < minDist) {
        minDist = dist
        nearest = st.data
      }
    })

    if (!nearest) return null
    return { station: nearest, distance: minDist }
  }

  public getStationById(id: string): StationData | undefined {
    return this.stations.find((s) => s.data.id === id)?.data
  }
}
