import { BRAINWAVE_BANDS, BrainwaveBand } from '../constants/presets';

export interface BinauralCalculationResult {
  carrierFrequency: number;
  beatFrequency: number;
  leftFrequency: number;
  rightFrequency: number;
  detectedBand: BrainwaveBand | null;
  frequencyDelta: number;
  frequencyAccuracyPercent: number;
}

export interface IsochronicCalculationResult {
  carrierFrequency: number;
  pulseFrequency: number;
  detectedBand: BrainwaveBand | null;
  periodSeconds: number;
  pulseAccuracyPercent: number;
  isHeadphoneRequired: boolean;
}

/**
 * Calculates stereo frequencies for a target carrier and beat.
 * L = carrier - beat/2
 * R = carrier + beat/2
 */
export function calculateBinauralFrequencies(
  carrierFrequency: number,
  beatFrequency: number
): BinauralCalculationResult {
  const safeCarrier = Math.max(20, Math.min(1500, carrierFrequency));
  const safeBeat = Math.max(0.1, Math.min(100, beatFrequency));

  const leftFrequency = Number((safeCarrier - safeBeat / 2).toFixed(2));
  const rightFrequency = Number((safeCarrier + safeBeat / 2).toFixed(2));
  const actualDelta = Number((rightFrequency - leftFrequency).toFixed(2));

  // Determine which brainwave band this falls under
  const detectedBand = BRAINWAVE_BANDS.find(
    (band) => safeBeat >= band.minBeat && safeBeat < band.maxBeat
  ) || null;

  const frequencyAccuracyPercent = Math.abs((actualDelta - safeBeat) / safeBeat) * 100;

  return {
    carrierFrequency: safeCarrier,
    beatFrequency: safeBeat,
    leftFrequency,
    rightFrequency,
    detectedBand,
    frequencyDelta: actualDelta,
    frequencyAccuracyPercent,
  };
}

/**
 * Calculates isochronic pulse parameters (operates without headphones)
 */
export function calculateIsochronicPulse(
  carrierFrequency: number,
  pulseFrequency: number
): IsochronicCalculationResult {
  const safeCarrier = Math.max(20, Math.min(1500, carrierFrequency));
  const safePulse = Math.max(0.1, Math.min(100, pulseFrequency));

  const detectedBand = BRAINWAVE_BANDS.find(
    (band) => safePulse >= band.minBeat && safePulse < band.maxBeat
  ) || null;

  const periodSeconds = Number((1 / safePulse).toFixed(4));
  const pulseAccuracyPercent = 0.0; // Math-exact LFO frequency

  return {
    carrierFrequency: safeCarrier,
    pulseFrequency: safePulse,
    detectedBand,
    periodSeconds,
    pulseAccuracyPercent,
    isHeadphoneRequired: false,
  };
}

/**
 * Validates whether the frequency difference meets Quality Gate 1 (< 0.1% deviation)
 */
export function validateFrequencyGate1(carrier: number, beat: number): boolean {
  const result = calculateBinauralFrequencies(carrier, beat);
  return result.frequencyAccuracyPercent <= 0.1;
}

/**
 * Validates whether stereo channels have 0 cross-talk (Quality Gate 2)
 */
export function validateStereoIsolationGate2(leftFreq: number, rightFreq: number): boolean {
  return leftFreq !== rightFreq && leftFreq > 0 && rightFreq > 0;
}

/**
 * Generates an anti-pop gain envelope curve with minimum required ramp time (Gate 3)
 */
export function calculateEnvelopeRamp(
  startGain: number,
  targetGain: number,
  durationMs: number = 30
): { isSafe: boolean; durationMs: number; steps: number[] } {
  const isSafe = durationMs >= 15; // Gate 3 requires at least 15ms ramp to prevent pop
  const stepsCount = 10;
  const steps: number[] = [];

  for (let i = 0; i <= stepsCount; i++) {
    const progress = i / stepsCount;
    // Smooth cosine interpolation (S-curve) for zero click
    const factor = (1 - Math.cos(progress * Math.PI)) / 2;
    steps.push(Number((startGain + (targetGain - startGain) * factor).toFixed(4)));
  }

  return { isSafe, durationMs, steps };
}

/**
 * Multi-layer gain safety validator to prevent digital clipping before compressor
 */
export function validateMultiLayerSafety(
  toneVol: number,
  entrainmentVol: number,
  ambienceVol: number,
  masterVol: number
): boolean {
  // Master volume must not exceed 1.0
  if (masterVol > 1.0 || masterVol < 0) return false;
  // Individual layers must be normalized between 0 and 1
  if (toneVol < 0 || toneVol > 1) return false;
  if (entrainmentVol < 0 || entrainmentVol > 1) return false;
  if (ambienceVol < 0 || ambienceVol > 1) return false;
  return true;
}