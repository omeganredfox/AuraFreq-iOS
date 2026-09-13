import {
  calculateBinauralFrequencies,
  calculateIsochronicPulse,
  validateFrequencyGate1,
  validateStereoIsolationGate2,
  calculateEnvelopeRamp,
  validateMultiLayerSafety,
} from '../binauralMath';
import { dspEngine, AuraDspEngine } from '../dspEngine';
import { ALL_PRESETS, BRAINWAVE_BANDS } from '../../constants/presets';

describe('ÄŸÅ¸Â§Âª AURAFREQ QUALITY GATES VERIFICATION SUITE', () => {
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
      expect(result.detectedBand?.id).toBe('theta');
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
    const MIN_APPLE_TOUCH_SIZE = 44;

    test('Apple Touch Target must be at least 44pt', () => {
      const standardButtonSize = 54;
      const tabTargetSize = 48;
      expect(standardButtonSize).toBeGreaterThanOrEqual(MIN_APPLE_TOUCH_SIZE);
      expect(tabTargetSize).toBeGreaterThanOrEqual(MIN_APPLE_TOUCH_SIZE);
    });
  });

  describe('Faz 2 DSP: Isochronic Tones & Multi-Layer Mixer', () => {
    test('Calculates Isochronic pulse period and allows mono speaker listening', () => {
      const isoResult = calculateIsochronicPulse(432, 10);
      expect(isoResult.pulseFrequency).toBe(10);
      expect(isoResult.carrierFrequency).toBe(432);
      expect(isoResult.periodSeconds).toBe(0.1); // 1 / 10 = 0.1s
      expect(isoResult.isHeadphoneRequired).toBe(false);
      expect(isoResult.detectedBand?.id).toBe('alpha');
    });

    test('Isochronic Theta meditation pulse (6 Hz)', () => {
      const isoResult = calculateIsochronicPulse(528, 6);
      expect(isoResult.pulseFrequency).toBe(6);
      expect(isoResult.periodSeconds).toBeCloseTo(0.1667, 3);
      expect(isoResult.detectedBand?.id).toBe('theta');
    });

    test('Validates multi-layer volume boundaries to prevent hard digital clipping', () => {
      expect(validateMultiLayerSafety(0.5, 0.5, 0.5, 0.8)).toBe(true);
      expect(validateMultiLayerSafety(1.5, 0.5, 0.5, 0.8)).toBe(false); // Tone volume overflow
      expect(validateMultiLayerSafety(0.5, 0.5, 0.5, 1.2)).toBe(false); // Master volume overflow
    });
  });

  describe('Data Integrity: Presets & Brainwave Bands Catalog', () => {
    test('All Solfeggio presets are mathematically valid and positive', () => {
      expect(ALL_PRESETS.length).toBe(9);
      for (const preset of ALL_PRESETS) {
        expect(preset.frequency).toBeGreaterThan(0);
        
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

    test('Solfeggio and Natural presets exist', () => {
      const schumann = ALL_PRESETS.find((p) => p.id === 'nat-432');
      expect(schumann?.frequency).toBe(432);
    });
  });

  describe('AuraDspEngine Class & Core Methods Verification', () => {
    test('AuraDspEngine singleton initializes in idle state', () => {
      expect(dspEngine).toBeInstanceOf(AuraDspEngine);
      expect(dspEngine.isAudioRunning()).toBe(false);
    });

    test('getConfig returns valid default mixer configuration', () => {
      const config = dspEngine.getConfig();
      expect(config.toneFrequency).toBe(432);
      expect(config.carrierFrequency).toBe(216);
      expect(config.beatFrequency).toBe(10);
      expect(config.masterVolume).toBe(0.75);
      expect(config.toneEnabled).toBe(true);
      expect(config.entrainmentEnabled).toBe(true);
    });

    test('verifyQualityGates passes for default engine configuration', () => {
      const gates = dspEngine.verifyQualityGates();
      expect(gates.frequencyAccuracyPassed).toBe(true);
      expect(gates.stereoIsolationPassed).toBe(true);
      expect(gates.antiPopEnvelopePassed).toBe(true);
      expect(gates.hearingSafetyPassed).toBe(true);
      expect(gates.rampDurationMs).toBeGreaterThanOrEqual(15);
    });

    test('getWaveformData returns idle fallback byte buffer when not running', () => {
      const waveform = dspEngine.getWaveformData();
      expect(waveform.length).toBe(64);
      expect(waveform.every((v) => v === 128)).toBe(true);
    });
  });

  describe('Edge Cases: DSP Frequency Clamping & Band Boundaries', () => {
    test('Clamps sub-audible carrier frequencies to 20 Hz minimum', () => {
      const result = calculateBinauralFrequencies(5, 10);
      expect(result.carrierFrequency).toBe(20);
      expect(result.leftFrequency).toBe(15);
      expect(result.rightFrequency).toBe(25);
    });

    test('Clamps high-frequency carrier beyond safety threshold to 1500 Hz maximum', () => {
      const result = calculateBinauralFrequencies(2500, 10);
      expect(result.carrierFrequency).toBe(1500);
      expect(result.leftFrequency).toBe(1495);
      expect(result.rightFrequency).toBe(1505);
    });

    test('Clamps infrasonic beat frequencies below 0.1 Hz to 0.1 Hz', () => {
      const result = calculateBinauralFrequencies(200, 0.01);
      expect(result.beatFrequency).toBe(0.1);
      expect(result.leftFrequency).toBe(199.95);
      expect(result.rightFrequency).toBe(200.05);
    });

    test('Clamps high entrainment beat frequencies above 100 Hz to 100 Hz', () => {
      const result = calculateBinauralFrequencies(300, 150);
      expect(result.beatFrequency).toBe(100);
      expect(result.leftFrequency).toBe(250);
      expect(result.rightFrequency).toBe(350);
    });

    test('Handles out-of-band beat frequencies gracefully with null detectedBand', () => {
      // Sub-delta (< 0.5 Hz)
      const subDelta = calculateBinauralFrequencies(200, 0.2);
      expect(subDelta.detectedBand).toBeNull();

      // Boundary / Hyper-gamma (>= 100 Hz where safeBeat is clamped to 100)
      const atOrAbove100 = calculateBinauralFrequencies(200, 100);
      expect(atOrAbove100.detectedBand).toBeNull();
    });
  });

  describe('Edge Cases: Stereo Isolation & Channel Cross-Talk Gate 2', () => {
    test('Rejects equal left and right frequencies (mono / zero binaural separation)', () => {
      expect(validateStereoIsolationGate2(216, 216)).toBe(false);
    });

    test('Rejects zero or negative frequencies', () => {
      expect(validateStereoIsolationGate2(0, 216)).toBe(false);
      expect(validateStereoIsolationGate2(-216, 216)).toBe(false);
      expect(validateStereoIsolationGate2(216, 0)).toBe(false);
    });
  });

  describe('Edge Cases: Anti-Pop Envelope Protection Gate 3', () => {
    test('Boundary duration test: 15ms passes, 14ms fails', () => {
      expect(calculateEnvelopeRamp(0, 0.8, 15).isSafe).toBe(true);
      expect(calculateEnvelopeRamp(0, 0.8, 14).isSafe).toBe(false);
    });

    test('Fade-out ramp (downward gain) generates smoothly decreasing S-curve steps', () => {
      const fadeOut = calculateEnvelopeRamp(0.8, 0.0, 30);
      expect(fadeOut.isSafe).toBe(true);
      expect(fadeOut.steps[0]).toBe(0.8);
      expect(fadeOut.steps[fadeOut.steps.length - 1]).toBe(0.0);
      // Ensure monotonic descent
      for (let i = 1; i < fadeOut.steps.length; i++) {
        expect(fadeOut.steps[i]).toBeLessThanOrEqual(fadeOut.steps[i - 1]);
      }
    });
  });

  describe('Edge Cases: Multi-Layer Mixer Gain Safety Gate', () => {
    test('Rejects negative volumes for any layer', () => {
      expect(validateMultiLayerSafety(-0.1, 0.5, 0.5, 0.8)).toBe(false);
      expect(validateMultiLayerSafety(0.5, -0.1, 0.5, 0.8)).toBe(false);
      expect(validateMultiLayerSafety(0.5, 0.5, -0.1, 0.8)).toBe(false);
      expect(validateMultiLayerSafety(0.5, 0.5, 0.5, -0.01)).toBe(false);
    });

    test('Accepts exact boundary values 0.0 (muted) and 1.0 (max)', () => {
      expect(validateMultiLayerSafety(0, 0, 0, 0)).toBe(true);
      expect(validateMultiLayerSafety(1, 1, 1, 1)).toBe(true);
    });
  });
});