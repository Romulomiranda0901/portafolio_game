import * as THREE from 'three'

export type CameraMode = 'chase' | 'cockpit' | 'orbit'

export interface StationData {
  id: 'about' | 'skills' | 'experience' | 'projects' | 'certifications' | 'contact'
  name: string
  label: string
  code: string
  description: string
  position: THREE.Vector3
  color: string
  subColor: string
  radius: number
}

export interface CollectibleData {
  id: string
  name: string
  category: string
  position: THREE.Vector3
  color: string
  collected: boolean
  rotationSpeed: { x: number; y: number; z: number }
}

export interface FlightInput {
  forward: number // 0 to 1
  backward: number // 0 to 1
  turnLeft: number // 0 to 1
  turnRight: number // 0 to 1
  pitchUp: number // 0 to 1
  pitchDown: number // 0 to 1
  boost: boolean
}
