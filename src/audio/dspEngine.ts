import { AudioEngineConfig, AudioQualityGateMetrics, OscillatorWaveType, NoiseType } from './types';
import { calculateBinauralFrequencies, calculateEnvelopeRamp } from './binauralMath';

export class AuraDspEngine {
  private audioCtx: AudioContext | null = null;
  private oscL: OscillatorNode | null = null;
  private oscR: OscillatorNode | null = null;
  private gainL: GainNode | null = null;
  private gainR: GainNode | null = null;
  private mergerNode: ChannelMergerNode | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Noise generator nodes
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;

  private isRunning: boolean = false;
  private currentConfig: AudioEngineConfig = {
    mode: 'binaural',
    carrierFrequency: 216,
    beatFrequency: 10,
    leftFrequency: 211,
    rightFrequency: 221,
    waveType: 'sine',
    masterVolume: 0.7,
    noiseType: 'none',
    noiseVolume: 0.3,
  };

  constructor() {
    // Lazy initialized on user gesture
  }

  private initAudioContext(): AudioContext {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioCtxClass =
        (typeof window !== 'undefined' &&
          (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)) ||
        null;

      if (!AudioCtxClass) {
        throw new Error('Web Audio API is not supported in this environment.');
      }
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public isAudioRunning(): boolean {
    return this.isRunning;
  }

  public getConfig(): AudioEngineConfig {
    return { ...this.currentConfig };
  }

  /**
   * Starts playback with smooth anti-pop envelope (Gate 3)
   */
  public async play(config?: Partial<AudioEngineConfig>): Promise<void> {
    if (config) {
      this.currentConfig = { ...this.currentConfig, ...config };
    }

    const ctx = this.initAudioContext();
    if (this.isRunning) {
      this.updateParameters();
      return;
    }

    const now = ctx.currentTime;

    // 1. Create Analyser for UI visualizer
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;

    // 2. Create Dynamics Compressor (Safety Soft-Limiter)
    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-6.0, now);
    this.compressor.knee.setValueAtTime(12.0, now);
    this.compressor.ratio.setValueAtTime(12.0, now);
    this.compressor.attack.setValueAtTime(0.003, now);
    this.compressor.release.setValueAtTime(0.25, now);

    // 3. Create Master Gain Node with soft-attack ramp (Gate 3)
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, now);
    const targetGain = Math.max(0.0001, Math.min(1.0, this.currentConfig.masterVolume));
    this.masterGain.gain.linearRampToValueAtTime(targetGain, now + 0.03); // 30ms soft ramp

    // 4. Create Channel Merger for Absolute Stereo Separation (Gate 2)
    this.mergerNode = ctx.createChannelMerger(2);

    // 5. Calculate Left and Right frequencies
    let fL = this.currentConfig.leftFrequency;
    let fR = this.currentConfig.rightFrequency;

    if (this.currentConfig.mode === 'binaural') {
      const calc = calculateBinauralFrequencies(
        this.currentConfig.carrierFrequency,
        this.currentConfig.beatFrequency
      );
      fL = calc.leftFrequency;
      fR = calc.rightFrequency;
      this.currentConfig.leftFrequency = fL;
      this.currentConfig.rightFrequency = fR;
    } else {
      // Single frequency / Mono mode
      fL = this.currentConfig.carrierFrequency;
      fR = this.currentConfig.carrierFrequency;
    }

    // 6. Left Channel Oscillator & Gain
    this.oscL = ctx.createOscillator();
    this.oscL.type = this.currentConfig.waveType;
    this.oscL.frequency.setValueAtTime(fL, now);

    this.gainL = ctx.createGain();
    this.gainL.gain.setValueAtTime(0.5, now);
    this.oscL.connect(this.gainL);
    this.gainL.connect(this.mergerNode, 0, 0); // Connect to Left Output Channel (Input 0)

    // 7. Right Channel Oscillator & Gain
    this.oscR = ctx.createOscillator();
    this.oscR.type = this.currentConfig.waveType;
    this.oscR.frequency.setValueAtTime(fR, now);

    this.gainR = ctx.createGain();
    this.gainR.gain.setValueAtTime(0.5, now);
    this.oscR.connect(this.gainR);
    this.gainR.connect(this.mergerNode, 0, 1); // Connect to Right Output Channel (Input 1)

    // 8. Connect Merger -> Compressor -> Master Gain -> Analyser -> Destination
    this.mergerNode.connect(this.compressor);
    this.compressor.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(ctx.destination);

    // 9. Start Oscillators
    this.oscL.start(now);
    this.oscR.start(now);

    // 10. Start Noise generator if enabled
    if (this.currentConfig.noiseType !== 'none') {
      this.startNoise(this.currentConfig.noiseType, this.currentConfig.noiseVolume);
    }

    this.isRunning = true;
  }

  /**
   * Updates frequency or volume parameters smoothly without stopping audio
   */
  public updateParameters(newConfig?: Partial<AudioEngineConfig>): void {
    if (newConfig) {
      this.currentConfig = { ...this.currentConfig, ...newConfig };
    }
    if (!this.isRunning || !this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    let fL = this.currentConfig.carrierFrequency;
    let fR = this.currentConfig.carrierFrequency;

    if (this.currentConfig.mode === 'binaural') {
      const calc = calculateBinauralFrequencies(
        this.currentConfig.carrierFrequency,
        this.currentConfig.beatFrequency
      );
      fL = calc.leftFrequency;
      fR = calc.rightFrequency;
      this.currentConfig.leftFrequency = fL;
      this.currentConfig.rightFrequency = fR;
    }

    if (this.oscL) {
      this.oscL.type = this.currentConfig.waveType;
      this.oscL.frequency.setTargetAtTime(fL, now, 0.03);
    }
    if (this.oscR) {
      this.oscR.type = this.currentConfig.waveType;
      this.oscR.frequency.setTargetAtTime(fR, now, 0.03);
    }

    if (this.masterGain) {
      const targetGain = Math.max(0.0001, Math.min(1.0, this.currentConfig.masterVolume));
      this.masterGain.gain.setTargetAtTime(targetGain, now, 0.03);
    }

    // Handle noise update
    if (this.currentConfig.noiseType === 'none') {
      this.stopNoise();
    } else {
      this.startNoise(this.currentConfig.noiseType, this.currentConfig.noiseVolume);
    }
  }

  /**
   * Stops playback with smooth anti-pop release ramp (Gate 3)
   */
  public async stop(): Promise<void> {
    if (!this.isRunning || !this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const rampDuration = 0.03; // 30ms soft fade-out

    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + rampDuration);
    }

    this.stopNoise();

    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          if (this.oscL) {
            this.oscL.stop();
            this.oscL.disconnect();
            this.oscL = null;
          }
          if (this.oscR) {
            this.oscR.stop();
            this.oscR.disconnect();
            this.oscR = null;
          }
          if (this.gainL) this.gainL.disconnect();
          if (this.gainR) this.gainR.disconnect();
          if (this.mergerNode) this.mergerNode.disconnect();
          if (this.masterGain) this.masterGain.disconnect();
          if (this.compressor) this.compressor.disconnect();
          if (this.analyser) this.analyser.disconnect();
        } catch {
          // ignore cleanup errors
        }
        this.isRunning = false;
        resolve();
      }, (rampDuration + 0.01) * 1000);
    });
  }

  /**
   * Creates synthetic Pink, Brown, or White noise loop
   */
  private startNoise(type: NoiseType, volume: number): void {
    if (!this.audioCtx || type === 'none') return;
    this.stopNoise();

    const ctx = this.audioCtx;
    const bufferSize = ctx.sampleRate * 2; // 2-second repeating buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      // Paul Kellet's filter method
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain boost for deep low frequencies
      }
    }

    this.noiseSource = ctx.createBufferSource();
    this.noiseSource.buffer = buffer;
    this.noiseSource.loop = true;

    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);

    this.noiseSource.connect(this.noiseGain);
    if (this.masterGain) {
      this.noiseGain.connect(this.masterGain);
    }
    this.noiseSource.start();
  }

  private stopNoise(): void {
    if (this.noiseSource) {
      try {
        this.noiseSource.stop();
        this.noiseSource.disconnect();
      } catch {
        // ignore
      }
      this.noiseSource = null;
    }
    if (this.noiseGain) {
      this.noiseGain.disconnect();
      this.noiseGain = null;
    }
  }

  /**
   * Reads real-time waveform data for the UI visualizer
   */
  public getWaveformData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(64).fill(128);
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  /**
   * Automated verification against Quality Gates
   */
  public verifyQualityGates(): AudioQualityGateMetrics {
    const calc = calculateBinauralFrequencies(
      this.currentConfig.carrierFrequency,
      this.currentConfig.beatFrequency
    );
    const ramp = calculateEnvelopeRamp(0, this.currentConfig.masterVolume, 30);

    return {
      frequencyAccuracyPassed: calc.frequencyAccuracyPercent <= 0.1,
      stereoIsolationPassed: calc.leftFrequency !== calc.rightFrequency,
      antiPopEnvelopePassed: ramp.isSafe,
      hearingSafetyPassed: this.currentConfig.masterVolume <= 1.0,
      testedFrequency: this.currentConfig.carrierFrequency,
      leftFreq: calc.leftFrequency,
      rightFreq: calc.rightFrequency,
      calculatedBeat: calc.frequencyDelta,
      rampDurationMs: ramp.durationMs,
    };
  }
}

// Global Singleton for instant access across components
export const dspEngine = new AuraDspEngine();