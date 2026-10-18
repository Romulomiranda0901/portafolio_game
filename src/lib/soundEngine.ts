/**
 * Motor de Audio Espacial Sintetizado (Web Audio API nativo).
 * Provee efectos de sonido de interfaz y sintetizador ambiental sin dependencias externas.
 */

class SoundEngine {
  private ctx: AudioContext | null = null
  private ambientOsc: OscillatorNode | null = null
  private ambientGain: GainNode | null = null
  private lfo: OscillatorNode | null = null
  private enabled: boolean = false
  private listeners: ((enabled: boolean) => void)[] = []

  public isEnabled(): boolean {
    return this.enabled && this.ctx !== null && this.ctx.state === 'running'
  }

  public subscribe(fn: (enabled: boolean) => void): () => void {
    this.listeners.push(fn)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn)
    }
  }

  private notify() {
    const state = this.isEnabled()
    this.listeners.forEach((l) => l(state))
  }

  public init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume()
      }
      this.enabled = true
      this.startAmbientDrone()
      this.notify()
      return
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtxClass) return
      this.ctx = new AudioCtxClass()
      this.enabled = true
      this.startAmbientDrone()
      this.play('success')
      this.notify()
    } catch (e) {
      console.warn('Web Audio no disponible:', e)
    }
  }

  public toggle(): boolean {
    if (!this.ctx) {
      this.init()
      return this.isEnabled()
    }

    if (this.ctx.state === 'running') {
      this.ctx.suspend()
      this.enabled = false
      this.notify()
      return false
    } else {
      this.ctx.resume()
      this.enabled = true
      this.startAmbientDrone()
      this.play('click')
      this.notify()
      return true
    }
  }

  public startAmbientDrone() {
    if (!this.ctx || this.ambientOsc || this.ctx.state !== 'running') return
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const filter = this.ctx.createBiquadFilter()

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(140, this.ctx.currentTime)

      // LFO para modular sutilmente el tono y dar vida cósmica
      const lfo = this.ctx.createOscillator()
      const lfoGain = this.ctx.createGain()
      lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime) // 0.2Hz respiración lenta
      lfoGain.gain.setValueAtTime(3, this.ctx.currentTime)
      lfo.connect(osc.frequency)

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(55, this.ctx.currentTime) // Nota A1 profunda

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime) // Volumen ambiental muy bajo

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      lfo.start()
      osc.start()

      this.ambientOsc = osc
      this.ambientGain = gain
      this.lfo = lfo
    } catch (e) {
      console.warn('No se pudo iniciar dron ambiental:', e)
    }
  }

  public stopAmbientDrone() {
    try {
      if (this.ambientOsc) {
        this.ambientOsc.stop()
        this.ambientOsc.disconnect()
        this.ambientOsc = null
      }
      if (this.lfo) {
        this.lfo.stop()
        this.lfo.disconnect()
        this.lfo = null
      }
    } catch {}
  }

  public play(
    type: 'warp' | 'laser' | 'collect' | 'portal' | 'click' | 'success' | 'chirp' | 'denied',
  ) {
    if (!this.ctx || this.ctx.state !== 'running') return
    const now = this.ctx.currentTime

    try {
      if (type === 'click') {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.type = 'sine'
        osc.frequency.setValueAtTime(1200, now)
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04)
        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

        osc.start(now)
        osc.stop(now + 0.04)
      } else if (type === 'chirp') {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(1800, now)
        osc.frequency.linearRampToValueAtTime(2400, now + 0.06)
        gain.gain.setValueAtTime(0.06, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

        osc.start(now)
        osc.stop(now + 0.06)
      } else if (type === 'collect') {
        // Arpegio de cristal cuántico
        const notes = [587.33, 739.99, 880.0, 1174.66] // D5, F#5, A5, D6
        notes.forEach((freq, idx) => {
          if (!this.ctx) return
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.connect(gain)
          gain.connect(this.ctx.destination)

          const t = now + idx * 0.05
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, t)
          gain.gain.setValueAtTime(0.09, t)
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15)

          osc.start(t)
          osc.stop(t + 0.15)
        })
      } else if (type === 'warp') {
        // Salto hiperespacial
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(100, now)
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.3)
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.6)

        gain.gain.setValueAtTime(0.02, now)
        gain.gain.linearRampToValueAtTime(0.12, now + 0.25)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

        osc.start(now)
        osc.stop(now + 0.6)
      } else if (type === 'portal') {
        // Apertura de compuerta holográfica
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.type = 'sine'
        osc.frequency.setValueAtTime(320, now)
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.4)
        gain.gain.setValueAtTime(0.1, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

        osc.start(now)
        osc.stop(now + 0.4)
      } else if (type === 'laser') {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(800, now)
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.12)
        gain.gain.setValueAtTime(0.07, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

        osc.start(now)
        osc.stop(now + 0.12)
      } else if (type === 'success') {
        const osc1 = this.ctx.createOscillator()
        const osc2 = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc1.connect(gain)
        osc2.connect(gain)
        gain.connect(this.ctx.destination)

        osc1.type = 'sine'
        osc2.type = 'sine'
        osc1.frequency.setValueAtTime(523.25, now) // C5
        osc2.frequency.setValueAtTime(659.25, now) // E5
        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)

        osc1.start(now)
        osc2.start(now)
        osc1.stop(now + 0.28)
        osc2.stop(now + 0.28)
      } else if (type === 'denied') {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.type = 'square'
        osc.frequency.setValueAtTime(150, now)
        gain.gain.setValueAtTime(0.07, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

        osc.start(now)
        osc.stop(now + 0.18)
      }
    } catch (e) {
      console.warn('Audio play error:', e)
    }
  }
}

export const soundEngine = new SoundEngine()
