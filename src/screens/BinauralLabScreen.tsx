import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { dspEngine } from '../audio/dspEngine';
import { calculateBinauralFrequencies } from '../audio/binauralMath';
import { BRAINWAVE_BANDS, BrainwaveBand } from '../constants/presets';
import { AppleTheme } from '../theme/colors';
import { AudioVisualizer } from '../components/AudioVisualizer';

interface BinauralLabScreenProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const BinauralLabScreen: React.FC<BinauralLabScreenProps> = ({ isPlaying, onTogglePlay }) => {
  const [carrier, setCarrier] = useState<number>(216);
  const [selectedBand, setSelectedBand] = useState<BrainwaveBand>(BRAINWAVE_BANDS[2]); // Default Alpha (10 Hz)
  const [beatFreq, setBeatFreq] = useState<number>(10);

  const calc = calculateBinauralFrequencies(carrier, beatFreq);

  const handleSelectBand = (band: BrainwaveBand) => {
    setSelectedBand(band);
    setBeatFreq(band.defaultBeat);
    if (isPlaying) {
      dspEngine.updateParameters({
        mode: 'binaural',
        carrierFrequency: carrier,
        beatFrequency: band.defaultBeat,
      });
    }
  };

  const handleStepBeat = (delta: number) => {
    const next = Number(Math.max(0.5, Math.min(50, beatFreq + delta)).toFixed(1));
    setBeatFreq(next);
    if (isPlaying) {
      dspEngine.updateParameters({
        mode: 'binaural',
        carrierFrequency: carrier,
        beatFrequency: next,
      });
    }
  };

  const handlePlayToggle = () => {
    if (!isPlaying) {
      dspEngine.play({
        mode: 'binaural',
        carrierFrequency: carrier,
        beatFrequency: beatFreq,
        waveType: 'sine',
        masterVolume: 0.7,
      });
    } else {
      dspEngine.stop();
    }
    onTogglePlay();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Binaural Beyin Dalgaları</Text>
        <Text style={styles.subtitle}>İki Kulak Arası Frekans Farkıyla Zihin Terapisi</Text>
      </View>

      {/* Headphone Advisory Notice (Apple HIG Callout) */}
      <View style={styles.headphoneNotice}>
        <Text style={styles.headphoneIcon}>🎧</Text>
        <Text style={styles.headphoneText}>
          Binaural etki için <Text style={styles.boldText}>Stereo Kulaklık</Text> şarttır. Sol ve sağ kanallar farklı frekans iletir.
        </Text>
      </View>

      {/* Visualizer */}
      <View style={styles.visualizerCard}>
        <AudioVisualizer isPlaying={isPlaying} accentColor={selectedBand.color} height={95} />
      </View>

      {/* Live Stereo Split Display */}
      <View style={styles.stereoSplitRow}>
        <View style={styles.channelCard}>
          <Text style={styles.channelTag}>SOL KULAK (L)</Text>
          <Text style={styles.channelFreq}>{calc.leftFrequency}</Text>
          <Text style={styles.channelUnit}>Hz</Text>
        </View>

        <View style={styles.beatDifferenceBadge}>
          <Text style={styles.beatDiffTitle}>BEYİN FARKI</Text>
          <Text style={[styles.beatDiffNumber, { color: selectedBand.color }]}>
            +{calc.frequencyDelta} Hz
          </Text>
          <Text style={styles.beatDiffName}>{selectedBand.name}</Text>
        </View>

        <View style={styles.channelCard}>
          <Text style={styles.channelTag}>SAĞ KULAK (R)</Text>
          <Text style={styles.channelFreq}>{calc.rightFrequency}</Text>
          <Text style={styles.channelUnit}>Hz</Text>
        </View>
      </View>

      {/* Fine-Tuning Controls for Beat */}
      <View style={styles.beatTuneRow}>
        <TouchableOpacity style={styles.tuneBtn} onPress={() => handleStepBeat(-1)}>
          <Text style={styles.tuneBtnText}>-1.0 Hz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tuneBtn} onPress={() => handleStepBeat(-0.1)}>
          <Text style={styles.tuneBtnText}>-0.1 Hz</Text>
        </TouchableOpacity>
        <View style={styles.currentBeatBox}>
          <Text style={styles.currentBeatText}>{beatFreq} Hz</Text>
        </View>
        <TouchableOpacity style={styles.tuneBtn} onPress={() => handleStepBeat(0.1)}>
          <Text style={styles.tuneBtnText}>+0.1 Hz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tuneBtn} onPress={() => handleStepBeat(1)}>
          <Text style={styles.tuneBtnText}>+1.0 Hz</Text>
        </TouchableOpacity>
      </View>

      {/* Brainwave Bands Selection Cards */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>BEYİN DALGASI BANTLARI</Text>
      </View>

      <View style={styles.bandCardsList}>
        {BRAINWAVE_BANDS.map((band) => {
          const isSelected = selectedBand.id === band.id;
          return (
            <TouchableOpacity
              key={band.id}
              style={[
                styles.bandCard,
                isSelected && { borderColor: band.color, backgroundColor: 'rgba(255,255,255,0.04)' },
              ]}
              onPress={() => handleSelectBand(band)}
            >
              <View style={styles.bandCardTop}>
                <View style={[styles.bandDot, { backgroundColor: band.color }]} />
                <Text style={styles.bandName}>{band.name} ({band.symbol})</Text>
                <Text style={styles.bandRange}>{band.minBeat} - {band.maxBeat} Hz</Text>
              </View>
              <Text style={styles.bandBenefits}>{band.benefits}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Play / Stop Master Button */}
      <TouchableOpacity
        style={[
          styles.masterPlayBtn,
          isPlaying && styles.masterPlayBtnActive,
          { backgroundColor: isPlaying ? AppleTheme.colors.danger : selectedBand.color },
        ]}
        onPress={handlePlayToggle}
      >
        <Text style={styles.masterPlayBtnText}>
          {isPlaying ? '■ BİNAURAL SEANSI DURDUR' : `▶ ${selectedBand.name.toUpperCase()} SEANSINI BAŞLAT`}
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
    marginBottom: 10,
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
  headphoneNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(10, 132, 255, 0.25)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    gap: 8,
  },
  headphoneIcon: {
    fontSize: 20,
  },
  headphoneText: {
    flex: 1,
    color: '#D0D8F0',
    fontSize: 12,
    lineHeight: 16,
  },
  boldText: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  visualizerCard: {
    marginBottom: 14,
  },
  stereoSplitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  channelCard: {
    flex: 1,
    backgroundColor: AppleTheme.colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppleTheme.colors.cardBorder,
    padding: 10,
    alignItems: 'center',
  },
  channelTag: {
    fontSize: 10,
    fontWeight: '700',
    color: AppleTheme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  channelFreq: {
    fontSize: 20,
    fontWeight: '700',
    color: AppleTheme.colors.textPrimary,
    marginTop: 4,
  },
  channelUnit: {
    fontSize: 11,
    color: AppleTheme.colors.textSecondary,
  },
  beatDifferenceBadge: {
    backgroundColor: '#18181D',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  beatDiffTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: AppleTheme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  beatDiffNumber: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  beatDiffName: {
    fontSize: 10,
    fontWeight: '600',
    color: AppleTheme.colors.textSecondary,
  },
  beatTuneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    gap: 6,
  },
  tuneBtn: {
    flex: 1,
    height: 44, // Gate 4: 44pt minimum
    backgroundColor: AppleTheme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppleTheme.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tuneBtnText: {
    color: AppleTheme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  currentBeatBox: {
    paddingHorizontal: 10,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentBeatText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
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
  bandCardsList: {
    gap: 8,
    marginBottom: 20,
  },
  bandCard: {
    backgroundColor: AppleTheme.colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppleTheme.colors.cardBorder,
    padding: 12,
    minHeight: 56, // Gate 4
  },
  bandCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  bandName: {
    fontSize: 14,
    fontWeight: '700',
    color: AppleTheme.colors.textPrimary,
    flex: 1,
  },
  bandRange: {
    fontSize: 12,
    color: AppleTheme.colors.textSecondary,
    fontWeight: '500',
  },
  bandBenefits: {
    fontSize: 12,
    color: AppleTheme.colors.textSecondary,
    lineHeight: 16,
    marginLeft: 16,
  },
  masterPlayBtn: {
    height: 54, // Gate 4: 44pt+
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});