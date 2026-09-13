export type OscillatorWaveType = 'sine' | 'triangle' | 'sawtooth' | 'square';
export type AudioPlayMode = 'single' | 'binaural' | 'isochronic' | 'multi';
export type AmbienceType = 'none' | 'pink' | 'brown' | 'white' | 'rain' | 'ocean';
export type NoiseType = AmbienceType; // Backwards compatible alias
export type EntrainmentType = 'binaural' | 'isochronic';

export interface MultiLayerMixerConfig {
  mode: AudioPlayMode;
  
  // Layer 1: Solfeggio / Saf Ton Katmanı
  toneEnabled: boolean;
  toneFrequency: number;
  toneWave: OscillatorWaveType;
  toneVolume: number; // 0.0 - 1.0

  // Layer 2: Beyin Dalgası Uyarımı (Binaural veya İzokronik)
  entrainmentEnabled: boolean;
  entrainmentType: EntrainmentType;
  carrierFrequency: number;
  beatFrequency: number;
  entrainmentVolume: number; // 0.0 - 1.0

  // Layer 3: Doğal Ambiyans & Renkli Gürültü
  ambienceType: AmbienceType;
  ambienceVolume: number; // 0.0 - 1.0

  // Ana Çıkış
  masterVolume: number; // 0.0 - 1.0
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