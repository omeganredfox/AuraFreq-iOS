import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { dspEngine } from '../audio/dspEngine';
import { OscillatorWaveType } from '../audio/types';
import { AppleTheme } from '../theme/colors';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { RotaryDial } from '../components/RotaryDial';

interface ToneLabScreenProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const ToneLabScreen: React.FC<ToneLabScreenProps> = ({ isPlaying, onTogglePlay }) => {
  const [frequency, setFrequency] = useState<number>(432);
  const [waveType, setWaveType] = useState<OscillatorWaveType>('sine');
  const [volume, setVolume] = useState<number>(0.7);

  const handleFreqChange = (newFreq: number) => {
    const clamped = Math.max(20, Math.min(20000, Number(newFreq.toFixed(1))));
    setFrequency(clamped);
    if (isPlaying) {
      dspEngine.updateParameters({ toneFrequency: clamped });
    }
  };

  const handleWaveChange = (newWave: OscillatorWaveType) => {
    setWaveType(newWave);
    if (isPlaying) {
      dspEngine.updateParameters({ toneWave: newWave });
    }
  };

  const handlePlayToggle = () => {
    if (!isPlaying) {
      dspEngine.play({
        mode: 'single',
        toneEnabled: true,
        toneFrequency: frequency,
        toneWave: waveType,
        toneVolume: volume,
        entrainmentEnabled: false,
        ambienceType: 'none',
        masterVolume: volume,
      });
    } else {
      dspEngine.stop();
    }
    onTogglePlay();
  };

  const QUICK_FREQS = [174, 285, 396, 432, 528, 639, 741, 852, 963];
  const WAVE_OPTIONS: { id: OscillatorWaveType; label: string }[] = [
    { id: 'sine', label: 'Sinüs' },
    { id: 'triangle', label: 'Üçgen' },
    { id: 'sawtooth', label: 'Testere' },
    { id: 'square', label: 'Kare' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Saf Frekans Sentezi</Text>
        <Text style={styles.subtitle}>0.1 Hz Hassasiyetle Analog Kalitesinde Ton</Text>
      </View>

      {/* Real-time Waveform Display */}
      <View style={styles.visualizerCard}>
        <AudioVisualizer isPlaying={isPlaying} accentColor={AppleTheme.colors.accentBlue} height={100} />
      </View>

      {/* Dairesel Frekans Kadranı (Rotary Dial) */}
      <RotaryDial
        value={frequency}
        min={20}
        max={2000}
        step={1}
        unit="Hz"
        label="Frekans Kadranı"
        accentColor={AppleTheme.colors.accentBlue}
        size={200}
        onValueChange={handleFreqChange}
      />

      {/* Stepper Tuning Controls */}
      <View style={styles.stepperRow}>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => handleFreqChange(frequency - 10)}
        >
          <Text style={styles.stepBtnText}>-10</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => handleFreqChange(frequency - 1)}
        >
          <Text style={styles.stepBtnText}>-1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => handleFreqChange(frequency - 0.1)}
        >
          <Text style={styles.stepBtnText}>-0.1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => handleFreqChange(frequency + 0.1)}
        >
          <Text style={styles.stepBtnText}>+0.1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => handleFreqChange(frequency + 1)}
        >
          <Text style={styles.stepBtnText}>+1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => handleFreqChange(frequency + 10)}
        >
          <Text style={styles.stepBtnText}>+10</Text>
        </TouchableOpacity>
      </View>

      {/* Waveform Segmented Control */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>DALGA FORMU</Text>
      </View>
      <View style={styles.segmentedControl}>
        {WAVE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.segmentBtn, waveType === opt.id && styles.segmentBtnActive]}
            onPress={() => handleWaveChange(opt.id)}
          >
            <Text
              style={[
                styles.segmentText,
                waveType === opt.id && styles.segmentTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Presets */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>HIZLI SEÇİM (HZ)</Text>
      </View>
      <View style={styles.chipRow}>
        {QUICK_FREQS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, frequency === f && styles.chipActive]}
            onPress={() => handleFreqChange(f)}
          >
            <Text style={[styles.chipText, frequency === f && styles.chipTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Play / Stop Master Button */}
      <TouchableOpacity
        style={[styles.masterPlayBtn, isPlaying && styles.masterPlayBtnActive]}
        onPress={handlePlayToggle}
      >
        <Text style={styles.masterPlayBtnText}>
          {isPlaying ? '■ SESİ DURDUR' : '▶ SAF FREKANSI BAŞLAT'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppleTheme.colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: AppleTheme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: AppleTheme.colors.textSecondary,
    marginTop: 2,
  },
  visualizerCard: {
    marginBottom: 16,
  },
  freqHeroCard: {
    backgroundColor: AppleTheme.colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppleTheme.colors.cardBorder,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 14,
  },
  freqNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: AppleTheme.colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  freqUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: AppleTheme.colors.accentBlue,
    marginLeft: 6,
    marginTop: 16,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 6,
  },
  stepBtn: {
    flex: 1,
    height: 44,
    backgroundColor: AppleTheme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppleTheme.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    color: AppleTheme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: AppleTheme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#16161A',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  segmentBtn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: AppleTheme.colors.cardHover,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  segmentText: {
    color: AppleTheme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: AppleTheme.colors.textPrimary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    minWidth: 54,
    height: 44,
    backgroundColor: AppleTheme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppleTheme.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  chipActive: {
    borderColor: AppleTheme.colors.accentBlue,
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
  },
  chipText: {
    color: AppleTheme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextActive: {
    color: AppleTheme.colors.accentBlue,
  },
  masterPlayBtn: {
    height: 54,
    backgroundColor: AppleTheme.colors.accentBlue,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppleTheme.colors.accentBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  masterPlayBtnActive: {
    backgroundColor: AppleTheme.colors.danger,
    shadowColor: AppleTheme.colors.danger,
  },
  masterPlayBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});