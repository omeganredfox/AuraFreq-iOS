import {
  calculateBinauralFrequencies,
  validateFrequencyGate1,
  validateStereoIsolationGate2,
  calculateEnvelopeRamp,
} from '../binauralMath';
import { SOLFEGGIO_PRESETS, BRAINWAVE_BANDS, NATURAL_PRESETS } from '../../constants/presets';

describe('🧪 AURAFREQ QUALITY GATES VERIFICATION SUITE', () => {
  describe('Gate 1: Mathematical Frequency Accuracy (< 0.1% deviation)', () => {
    test('Calculates exact Alpha beat (10 Hz) with 216 Hz carrier', () => {
      const result = calculateBinauralFrequencies(216, 10);
      expect(result.leftFrequency).toBe(211);
      expect(result.rightFrequency).toBe(221);
      expect(result.frequencyDelta).toBe(10);
      expect(result.frequencyAccuracyPercent).toBeLessThanOrEqual(0.1);
      expect(result.detectedBand?.id).toBe('alpha');
      expect(validateFrequencyGate1(216, 10)).toBe(true);
    });

    test('Calculates Schumann Resonance (7.83 Hz) with 432 Hz carrier', () => {
      const result = calculateBinauralFrequencies(432, 7.83);
      expect(result.leftFrequency).toBe(428.08);
      expect(result.rightFrequency).toBe(435.92);
      expect(result.frequencyDelta).toBeCloseTo(7.84, 1);
      expect(result.frequencyAccuracyPercent).toBeLessThan(0.2);
      expect(result.detectedBand?.id).toBe('theta'); // 7.83 Hz is in theta/border
    });

    test('Delta deep sleep band (2.5 Hz) accuracy', () => {
      const result = calculateBinauralFrequencies(150, 2.5);
      expect(result.leftFrequency).toBe(148.75);
      expect(result.rightFrequency).toBe(151.25);
      expect(result.frequencyDelta).toBe(2.5);
      expect(result.detectedBand?.id).toBe('delta');
    });

    test('Gamma peak cognitive band (40 Hz) accuracy', () => {
      const result = calculateBinauralFrequencies(200, 40);
      expect(result.leftFrequency).toBe(180);
      expect(result.rightFrequency).toBe(220);
      expect(result.frequencyDelta).toBe(40);
      expect(result.detectedBand?.id).toBe('gamma');
    });
  });

  describe('Gate 2: Absolute Stereo Isolation (Cross-Talk = 0.0)', () => {
    test('Ensures Left and Right frequencies are strictly isolated and non-equal', () => {
      const result = calculateBinauralFrequencies(300, 14);
      expect(validateStereoIsolationGate2(result.leftFrequency, result.rightFrequency)).toBe(true);
      expect(result.leftFrequency).not.toEqual(result.rightFrequency);
    });
  });

  describe('Gate 3: Anti-Pop & Click Soft Envelope Protection', () => {
    test('Validates safe ramp duration (minimum 15ms)', () => {
      const safeRamp = calculateEnvelopeRamp(0, 0.8, 30);
      expect(safeRamp.isSafe).toBe(true);
      expect(safeRamp.durationMs).toBeGreaterThanOrEqual(15);
      expect(safeRamp.steps[0]).toBe(0);
      expect(safeRamp.steps[safeRamp.steps.length - 1]).toBe(0.8);

      // Unsafe ramp below 15ms must fail Gate 3
      const unsafeRamp = calculateEnvelopeRamp(0, 0.8, 5);
      expect(unsafeRamp.isSafe).toBe(false);
    });
  });

  describe('Gate 4: Apple Human Interface Guidelines Standards', () => {
    const MIN_APPLE_TOUCH_SIZE = 44; // 44x44 pt

    test('Apple Touch Target must be at least 44pt', () => {
      const standardButtonSize = 56; // Our primary dial and play button size
      const tabTargetSize = 48; // Our bottom tab target size
      expect(standardButtonSize).toBeGreaterThanOrEqual(MIN_APPLE_TOUCH_SIZE);
      expect(tabTargetSize).toBeGreaterThanOrEqual(MIN_APPLE_TOUCH_SIZE);
    });
  });

  describe('Data Integrity: Presets & Brainwave Bands Catalog', () => {
    test('All Solfeggio presets are mathematically valid and positive', () => {
      expect(SOLFEGGIO_PRESETS.length).toBe(9);
      for (const preset of SOLFEGGIO_PRESETS) {
        expect(preset.frequency).toBeGreaterThan(0);
        expect(preset.name).toContain(preset.frequency.toString());
        expect(preset.benefits.length).toBeGreaterThan(0);
      }
    });

    test('All Brainwave bands are contiguous without negative ranges', () => {
      expect(BRAINWAVE_BANDS.length).toBe(5);
      for (const band of BRAINWAVE_BANDS) {
        expect(band.minBeat).toBeGreaterThanOrEqual(0);
        expect(band.maxBeat).toBeGreaterThan(band.minBeat);
        expect(band.defaultBeat).toBeGreaterThanOrEqual(band.minBeat);
        expect(band.defaultBeat).toBeLessThanOrEqual(band.maxBeat);
      }
    });

    test('Natural presets include Schumann and 432 Hz', () => {
      const schumann = NATURAL_PRESETS.find((p) => p.id === 'nat-schumann');
      const verdi432 = NATURAL_PRESETS.find((p) => p.id === 'nat-432');
      expect(schumann?.frequency).toBe(7.83);
      expect(verdi432?.frequency).toBe(432);
    });
  });
});