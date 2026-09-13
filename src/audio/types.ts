export type OscillatorWaveType = 'sine' | 'triangle' | 'sawtooth' | 'square';
export type AudioPlayMode = 'single' | 'binaural' | 'preset';
export type NoiseType = 'none' | 'pink' | 'brown' | 'white';

export interface AudioEngineConfig {
  mode: AudioPlayMode;
  carrierFrequency: number;
  beatFrequency: number; // for binaural
  leftFrequency: number;
  rightFrequency: number;
  waveType: OscillatorWaveType;
  masterVolume: number; // 0.0 to 1.0
  noiseType: NoiseType;
  noiseVolume: number; // 0.0 to 1.0
}

export interface AudioEngineStatus {
  isPlaying: boolean;
  config: AudioEngineConfig;
  activePresetId?: string;
  sleepTimerRemainingSeconds: number | null;
}

export interface AudioQualityGateMetrics {
  frequencyAccuracyPassed: boolean;
  stereoIsolationPassed: boolean;
  antiPopEnvelopePassed: boolean;
  hearingSafetyPassed: boolean;
  testedFrequency: number;
  leftFreq: number;
  rightFreq: number;
  calculatedBeat: number;
  rampDurationMs: number;
}