import {
  MultiLayerMixerConfig,
  OscillatorWaveType,
  AmbienceType,
  EntrainmentType,
  AudioQualityGateMetrics,
} from './types';
import {
  calculateBinauralFrequencies,
  calculateIsochronicPulse,
  calculateEnvelopeRamp,
} from './binauralMath';

export class AuraDspEngine {
  private audioCtx: AudioContext | null = null;
  private isRunning: boolean = false;

  // Master Nodes
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Layer 1: Saf Ton Nodes
  private toneOsc: OscillatorNode | null = null;
  private toneGain: GainNode | null = null;

  // Layer 2: Entrainment Nodes (Binaural or Isochronic)
  private entrainmentGain: GainNode | null = null;
  // Binaural Nodes
  private binOscL: OscillatorNode | null = null;
  private binOscR: OscillatorNode | null = null;
  private binGainL: GainNode | null = null;
  private binGainR: GainNode | null = null;
  private binMerger: ChannelMergerNode | null = null;
  // Isochronic Nodes
  private isoCarrierOsc: OscillatorNode | null = null;
  private isoModGain: GainNode | null = null;
  private isoLFO: OscillatorNode | null = null;
  private isoLFOGain: GainNode | null = null;

  // Layer 3: Ambience / Nature Nodes
  private ambSource: AudioBufferSourceNode | null = null;
  private ambGain: GainNode | null = null;
  private ambFilter: BiquadFilterNode | null = null;
  private ambLFO: OscillatorNode | null = null;

  private currentConfig: MultiLayerMixerConfig = {
    mode: 'multi',
    toneEnabled: true,
    toneFrequency: 432,
    toneWave: 'sine',
    toneVolume: 0.6,
    entrainmentEnabled: true,
    entrainmentType: 'binaural',
    carrierFrequency: 216,
    beatFrequency: 10,
    entrainmentVolume: 0.7,
    ambienceType: 'none',
    ambienceVolume: 0.3,
    masterVolume: 0.75,
  };

  constructor() {}

  private initAudioContext(): AudioContext {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioCtxClass =
        (typeof window !== 'undefined' &&
          (window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)) ||
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

  public getConfig(): MultiLayerMixerConfig {
    return { ...this.currentConfig };
  }

  /**
   * Starts playback with multi-layer synthesis and 30ms anti-pop ramp (Gate 3)
   */
  public async play(config?: Partial<MultiLayerMixerConfig>): Promise<void> {
    if (config) {
      this.currentConfig = { ...this.currentConfig, ...config };
    }

    if (this.isRunning) {
      // Rebuild entire audio graph to support structural changes cleanly (e.g. enabling/disabling layers)
      await this.stop();
    }

    const ctx = this.initAudioContext();
    const now = ctx.currentTime;

    // 1. Setup Master Bus: Compressor -> Master Gain -> Analyser -> Destination
    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-6.0, now);
    this.compressor.knee.setValueAtTime(12.0, now);
    this.compressor.ratio.setValueAtTime(12.0, now);
    this.compressor.attack.setValueAtTime(0.003, now);
    this.compressor.release.setValueAtTime(0.25, now);

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, now);
    const targetGain = Math.max(0.0001, Math.min(1.0, this.currentConfig.masterVolume));
    this.masterGain.gain.linearRampToValueAtTime(targetGain, now + 0.03); // Gate 3: 30ms

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;

    this.compressor.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(ctx.destination);

    // 2. Setup Layer 1: Pure Tone
    if (this.currentConfig.toneEnabled) {
      this.setupToneLayer(now);
    }

    // 3. Setup Layer 2: Entrainment (Binaural or Isochronic)
    if (this.currentConfig.entrainmentEnabled) {
      this.setupEntrainmentLayer(now);
    }

    // 4. Setup Layer 3: Ambience / Nature
    if (this.currentConfig.ambienceType !== 'none') {
      this.setupAmbienceLayer(this.currentConfig.ambienceType);
    }

    this.isRunning = true;
  }

  private setupToneLayer(now: number): void {
    if (!this.audioCtx || !this.compressor) return;
    const ctx = this.audioCtx;

    this.toneOsc = ctx.createOscillator();
    this.toneOsc.type = this.currentConfig.toneWave;
    this.toneOsc.frequency.setValueAtTime(this.currentConfig.toneFrequency, now);

    this.toneGain = ctx.createGain();
    this.toneGain.gain.setValueAtTime(this.currentConfig.toneVolume * 0.5, now);

    this.toneOsc.connect(this.toneGain);
    this.toneGain.connect(this.compressor);
    this.toneOsc.start(now);
  }

  private setupEntrainmentLayer(now: number): void {
    if (!this.audioCtx || !this.compressor) return;
    const ctx = this.audioCtx;

    this.entrainmentGain = ctx.createGain();
    this.entrainmentGain.gain.setValueAtTime(this.currentConfig.entrainmentVolume * 0.5, now);
    this.entrainmentGain.connect(this.compressor);

    if (this.currentConfig.entrainmentType === 'binaural') {
      // Binaural Stereo Separation
      const calc = calculateBinauralFrequencies(
        this.currentConfig.carrierFrequency,
        this.currentConfig.beatFrequency
      );

      this.binMerger = ctx.createChannelMerger(2);

      this.binOscL = ctx.createOscillator();
      this.binOscL.type = 'sine';
      this.binOscL.frequency.setValueAtTime(calc.leftFrequency, now);

      this.binGainL = ctx.createGain();
      this.binGainL.gain.setValueAtTime(0.5, now);
      this.binOscL.connect(this.binGainL);
      this.binGainL.connect(this.binMerger, 0, 0); // Left channel

      this.binOscR = ctx.createOscillator();
      this.binOscR.type = 'sine';
      this.binOscR.frequency.setValueAtTime(calc.rightFrequency, now);

      this.binGainR = ctx.createGain();
      this.binGainR.gain.setValueAtTime(0.5, now);
      this.binOscR.connect(this.binGainR);
      this.binGainR.connect(this.binMerger, 0, 1); // Right channel

      this.binMerger.connect(this.entrainmentGain);
      this.binOscL.start(now);
      this.binOscR.start(now);
    } else {
      // Isochronic Pulse Amplitude Modulation (Headphones not required)
      this.isoCarrierOsc = ctx.createOscillator();
      this.isoCarrierOsc.type = 'sine';
      this.isoCarrierOsc.frequency.setValueAtTime(this.currentConfig.carrierFrequency, now);

      this.isoModGain = ctx.createGain();
      this.isoModGain.gain.setValueAtTime(0.5, now);

      // LFO for pulse modulation
      this.isoLFO = ctx.createOscillator();
      this.isoLFO.type = 'sine';
      this.isoLFO.frequency.setValueAtTime(this.currentConfig.beatFrequency, now);

      this.isoLFOGain = ctx.createGain();
      this.isoLFOGain.gain.setValueAtTime(0.5, now);

      this.isoLFO.connect(this.isoLFOGain);
      this.isoLFOGain.connect(this.isoModGain.gain);

      this.isoCarrierOsc.connect(this.isoModGain);
      this.isoModGain.connect(this.entrainmentGain);

      this.isoCarrierOsc.start(now);
      this.isoLFO.start(now);
    }
  }

  private setupAmbienceLayer(type: AmbienceType): void {
    if (!this.audioCtx || !this.compressor || type === 'none') return;
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 2; // 2 seconds seamless loop
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink' || type === 'rain') {
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
    } else if (type === 'brown' || type === 'ocean') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    }

    this.ambSource = ctx.createBufferSource();
    this.ambSource.buffer = buffer;
    this.ambSource.loop = true;

    this.ambGain = ctx.createGain();
    this.ambGain.gain.setValueAtTime(this.currentConfig.ambienceVolume * 0.35, now);

    if (type === 'rain') {
      // Filter pink noise for rainfall acoustics (high-pass at 800Hz)
      this.ambFilter = ctx.createBiquadFilter();
      this.ambFilter.type = 'highpass';
      this.ambFilter.frequency.setValueAtTime(800, now);
      this.ambSource.connect(this.ambFilter);
      this.ambFilter.connect(this.ambGain);
    } else if (type === 'ocean') {
      // Filter brown noise with slow LFO for rhythmic crashing waves
      this.ambFilter = ctx.createBiquadFilter();
      this.ambFilter.type = 'lowpass';
      this.ambFilter.frequency.setValueAtTime(450, now);

      this.ambLFO = ctx.createOscillator();
      this.ambLFO.frequency.setValueAtTime(0.08, now); // ~12-second wave rhythm

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(250, now);
      this.ambLFO.connect(lfoGain);
      lfoGain.connect(this.ambFilter.frequency);
      this.ambLFO.start(now);

      this.ambSource.connect(this.ambFilter);
      this.ambFilter.connect(this.ambGain);
    } else {
      this.ambSource.connect(this.ambGain);
    }

    this.ambGain.connect(this.compressor);
    this.ambSource.start(now);
  }

  /**
   * Updates multi-layer parameters dynamically with zero clicks (30ms target time constant)
   */
  public updateParameters(newConfig?: Partial<MultiLayerMixerConfig>): void {
    if (newConfig) {
      this.currentConfig = { ...this.currentConfig, ...newConfig };
    }
    if (!this.isRunning || !this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // 1. Update Master Gain
    if (this.masterGain) {
      const targetGain = Math.max(0.0001, Math.min(1.0, this.currentConfig.masterVolume));
      this.masterGain.gain.setTargetAtTime(targetGain, now, 0.03);
    }

    // 2. Update Layer 1 (Tone)
    if (this.toneGain) {
      const g = this.currentConfig.toneEnabled ? this.currentConfig.toneVolume * 0.5 : 0.0001;
      this.toneGain.gain.setTargetAtTime(g, now, 0.03);
    }
    if (this.toneOsc) {
      this.toneOsc.type = this.currentConfig.toneWave;
      this.toneOsc.frequency.setTargetAtTime(this.currentConfig.toneFrequency, now, 0.03);
    }

    // 3. Update Layer 2 (Entrainment)
    if (this.entrainmentGain) {
      const g = this.currentConfig.entrainmentEnabled ? this.currentConfig.entrainmentVolume * 0.5 : 0.0001;
      this.entrainmentGain.gain.setTargetAtTime(g, now, 0.03);
    }
    if (this.currentConfig.entrainmentType === 'binaural') {
      const calc = calculateBinauralFrequencies(
        this.currentConfig.carrierFrequency,
        this.currentConfig.beatFrequency
      );
      if (this.binOscL) this.binOscL.frequency.setTargetAtTime(calc.leftFrequency, now, 0.03);
      if (this.binOscR) this.binOscR.frequency.setTargetAtTime(calc.rightFrequency, now, 0.03);
    } else {
      if (this.isoCarrierOsc) {
        this.isoCarrierOsc.frequency.setTargetAtTime(this.currentConfig.carrierFrequency, now, 0.03);
      }
      if (this.isoLFO) {
        this.isoLFO.frequency.setTargetAtTime(this.currentConfig.beatFrequency, now, 0.03);
      }
    }

    // 4. Update Layer 3 (Ambience)
    if (this.ambGain) {
      const g = this.currentConfig.ambienceType !== 'none' ? this.currentConfig.ambienceVolume * 0.35 : 0.0001;
      this.ambGain.gain.setTargetAtTime(g, now, 0.03);
    }
  }

  /**
   * Stops all active nodes with smooth anti-pop release ramp (Gate 3)
   */
  public async stop(): Promise<void> {
    if (!this.isRunning || !this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const rampDuration = 0.03;

    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + rampDuration);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          if (this.toneOsc) { this.toneOsc.stop(); this.toneOsc.disconnect(); this.toneOsc = null; }
          if (this.toneGain) { this.toneGain.disconnect(); this.toneGain = null; }

          if (this.binOscL) { this.binOscL.stop(); this.binOscL.disconnect(); this.binOscL = null; }
          if (this.binOscR) { this.binOscR.stop(); this.binOscR.disconnect(); this.binOscR = null; }
          if (this.binGainL) { this.binGainL.disconnect(); this.binGainL = null; }
          if (this.binGainR) { this.binGainR.disconnect(); this.binGainR = null; }
          if (this.binMerger) { this.binMerger.disconnect(); this.binMerger = null; }

          if (this.isoCarrierOsc) { this.isoCarrierOsc.stop(); this.isoCarrierOsc.disconnect(); this.isoCarrierOsc = null; }
          if (this.isoLFO) { this.isoLFO.stop(); this.isoLFO.disconnect(); this.isoLFO = null; }
          if (this.isoLFOGain) { this.isoLFOGain.disconnect(); this.isoLFOGain = null; }
          if (this.isoModGain) { this.isoModGain.disconnect(); this.isoModGain = null; }
          if (this.entrainmentGain) { this.entrainmentGain.disconnect(); this.entrainmentGain = null; }

          if (this.ambSource) { this.ambSource.stop(); this.ambSource.disconnect(); this.ambSource = null; }
          if (this.ambLFO) { this.ambLFO.stop(); this.ambLFO.disconnect(); this.ambLFO = null; }
          if (this.ambFilter) { this.ambFilter.disconnect(); this.ambFilter = null; }
          if (this.ambGain) { this.ambGain.disconnect(); this.ambGain = null; }

          if (this.compressor) { this.compressor.disconnect(); this.compressor = null; }
          if (this.analyser) { this.analyser.disconnect(); this.analyser = null; }
          if (this.masterGain) { this.masterGain.disconnect(); this.masterGain = null; }
        } catch {
          // ignore cleanup errors
        }
        this.isRunning = false;
        resolve();
      }, (rampDuration + 0.01) * 1000);
    });
  }

  public getWaveformData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(64).fill(128);
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(dataArray);
    return dataArray;
  }

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

export const dspEngine = new AuraDspEngine();