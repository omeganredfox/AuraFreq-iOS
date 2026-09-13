import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { dspEngine } from '../audio/dspEngine';
import { SOLFEGGIO_PRESETS, NATURAL_PRESETS, FrequencyPreset } from '../constants/presets';
import { AmbienceType } from '../audio/types';
import { AppleTheme } from '../theme/colors';

interface PresetsScreenProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const PresetsScreen: React.FC<PresetsScreenProps> = ({ isPlaying, onTogglePlay }) => {
  const [activePresetId, setActivePresetId] = useState<string>('solf-528');
  const [ambienceType, setAmbienceType] = useState<AmbienceType>('none');
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);

  const allPresets: FrequencyPreset[] = [...NATURAL_PRESETS, ...SOLFEGGIO_PRESETS];

  const handleSelectPreset = (preset: FrequencyPreset) => {
    setActivePresetId(preset.id);
    dspEngine.play({
      mode: 'single',
      toneEnabled: true,
      toneFrequency: preset.frequency,
      toneWave: preset.waveType,
      toneVolume: 0.7,
      ambienceType,
      ambienceVolume: 0.3,
      masterVolume: 0.75,
    });
    if (!isPlaying) {
      onTogglePlay();
    }
  };

  const handleToggleAmbience = (type: AmbienceType) => {
    const nextType = ambienceType === type ? 'none' : type;
    setAmbienceType(nextType);
    if (isPlaying) {
      dspEngine.updateParameters({ ambienceType: nextType, ambienceVolume: 0.3 });
    }
  };

  const handleSetTimer = (minutes: number | null) => {
    setSleepTimerMinutes(minutes);
    if (minutes !== null) {
      setTimeout(() => {
        dspEngine.stop();
        if (isPlaying) onTogglePlay();
        setSleepTimerMinutes(null);
      }, minutes * 60 * 1000);
    }
  };

  const AMBIENCE_OPTIONS: { id: AmbienceType; label: string; desc: string }[] = [
    { id: 'rain', label: '🌧️ Yağmur', desc: 'Sakinleştirici doğal yağmur sesi' },
    { id: 'ocean', label: '🌊 Okyanus', desc: '12 sn ritmik okyanus dalgaları' },
    { id: 'pink', label: '🌸 Pembe', desc: '1/f dinlendirici gürültü' },
    { id: 'brown', label: '🍂 Kahverengi', desc: 'Derin uğultu, odaklanma' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Rezonans & Şifa Presetleri</Text>
        <Text style={styles.subtitle}>Kadim Solfeggio Frekansları & Doğa Mikseri</Text>
      </View>

      {/* Background Ambience / Noise Layer */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>ARKAPLAN DOĞA & RENKLİ GÜRÜLTÜ</Text>
      </View>
      <View style={styles.noiseRow}>
        {AMBIENCE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.noiseCard, ambienceType === opt.id && styles.noiseCardActive]}
            onPress={() => handleToggleAmbience(opt.id)}
          >
            <Text style={[styles.noiseLabel, ambienceType === opt.id && styles.noiseLabelActive]}>
              {opt.label}
            </Text>
            <Text style={styles.noiseDesc}>{opt.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sleep Timer Bar */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>UYKU ZAMANLAYICISI (FADE-OUT)</Text>
      </View>
      <View style={styles.timerRow}>
        {[15, 30, 45, 60].map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.timerBtn, sleepTimerMinutes === m && styles.timerBtnActive]}
            onPress={() => handleSetTimer(sleepTimerMinutes === m ? null : m)}
          >
            <Text style={[styles.timerBtnText, sleepTimerMinutes === m && styles.timerBtnTextActive]}>
              {m} dk
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Presets List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>FREKANS KATALOĞU</Text>
      </View>

      <View style={styles.presetList}>
        {allPresets.map((preset) => {
          const isActive = activePresetId === preset.id && isPlaying;
          return (
            <TouchableOpacity
              key={preset.id}
              style={[styles.presetCard, isActive && { borderColor: preset.color, backgroundColor: 'rgba(255,255,255,0.03)' }]}
              onPress={() => handleSelectPreset(preset)}
            >
              <View style={styles.presetCardHeader}>
                <View style={styles.presetBadge}>
                  <Text style={[styles.presetBadgeText, { color: preset.color }]}>
                    {preset.frequency} Hz
                  </Text>
                </View>
                <Text style={styles.presetName} numberOfLines={1}>
                  {preset.name.split('—')[1]?.trim() || preset.name}
                </Text>
                <View style={[styles.playIndicator, isActive && { backgroundColor: preset.color }]}>
                  <Text style={styles.playIndicatorText}>{isActive ? '■' : '▶'}</Text>
                </View>
              </View>

              <Text style={styles.presetDesc}>{preset.description}</Text>

              <View style={styles.tagRow}>
                {preset.benefits.map((b, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{b}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
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
    paddingBottom: 28,
  },
  header: {
    marginBottom: 14,
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
  sectionHeader: {
    marginBottom: 8,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: AppleTheme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  noiseRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  noiseCard: {
    width: '48%',
    backgroundColor: AppleTheme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppleTheme.colors.cardBorder,
    padding: 10,
    minHeight: 56,
    justifyContent: 'center',
  },
  noiseCardActive: {
    borderColor: AppleTheme.colors.accentGreen,
    backgroundColor: 'rgba(48, 209, 88, 0.12)',
  },
  noiseLabel: {
    color: AppleTheme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  noiseLabelActive: {
    color: AppleTheme.colors.accentGreen,
  },
  noiseDesc: {
    color: AppleTheme.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  timerRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  timerBtn: {
    flex: 1,
    height: 44,
    backgroundColor: AppleTheme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppleTheme.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerBtnActive: {
    borderColor: AppleTheme.colors.accentAmber,
    backgroundColor: 'rgba(255, 159, 10, 0.15)',
  },
  timerBtnText: {
    color: AppleTheme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  timerBtnTextActive: {
    color: AppleTheme.colors.accentAmber,
  },
  presetList: {
    gap: 10,
  },
  presetCard: {
    backgroundColor: AppleTheme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppleTheme.colors.cardBorder,
    padding: 14,
    minHeight: 80,
  },
  presetCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  presetBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  presetBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  presetName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: AppleTheme.colors.textPrimary,
  },
  playIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIndicatorText: {
    fontSize: 11,
    color: '#FFFFFF',
  },
  presetDesc: {
    fontSize: 12,
    color: AppleTheme.colors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    color: '#A0A0A5',
  },
});