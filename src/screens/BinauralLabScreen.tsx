import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { dspEngine } from '../audio/dspEngine';
import { calculateBinauralFrequencies, calculateIsochronicPulse } from '../audio/binauralMath';
import { BRAINWAVE_BANDS, BrainwaveBand } from '../constants/presets';
import { EntrainmentType } from '../audio/types';
import { AppleTheme } from '../theme/colors';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { LissajousVisualizer } from '../components/LissajousVisualizer';

interface BinauralLabScreenProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const BinauralLabScreen: React.FC<BinauralLabScreenProps> = ({ isPlaying, onTogglePlay }) => {
  const [carrier, setCarrier] = useState<number>(216);
  const [selectedBand, setSelectedBand] = useState<BrainwaveBand>(BRAINWAVE_BANDS[2]); // Default Alpha (10 Hz)
  const [beatFreq, setBeatFreq] = useState<number>(10);
  const [entrainmentType, setEntrainmentType] = useState<EntrainmentType>('binaural');

  const binCalc = calculateBinauralFrequencies(carrier, beatFreq);
  const isoCalc = calculateIsochronicPulse(carrier, beatFreq);

  const handleSelectBand = (band: BrainwaveBand) => {
    setSelectedBand(band);
    setBeatFreq(band.defaultBeat);
    if (isPlaying) {
      dspEngine.updateParameters({
        carrierFrequency: carrier,
        beatFrequency: band.defaultBeat,
        entrainmentType,
      });
    }
  };

  const handleToggleEntrainmentType = (type: EntrainmentType) => {
    setEntrainmentType(type);
    if (isPlaying) {
      // Re-initialize audio graph for the new mode
      dspEngine.stop().then(() => {
        dspEngine.play({
          entrainmentEnabled: true,
          entrainmentType: type,
          carrierFrequency: carrier,
          beatFrequency: beatFreq,
        });
      });
    }
  };

  const handleStepBeat = (delta: number) => {
    const next = Number(Math.max(0.5, Math.min(50, beatFreq + delta)).toFixed(1));
    setBeatFreq(next);
    if (isPlaying) {
      dspEngine.updateParameters({
        carrierFrequency: carrier,
        beatFrequency: next,
        entrainmentType,
      });
    }
  };

  const handlePlayToggle = () => {
    if (!isPlaying) {
      dspEngine.play({
        mode: 'multi',
        entrainmentEnabled: true,
        entrainmentType,
        carrierFrequency: carrier,
        beatFrequency: beatFreq,
        toneEnabled: false,
        ambienceType: 'none',
        masterVolume: 0.75,
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
        <Text style={styles.title}>Beyin Dalgaları Laboratuvarı</Text>
        <Text style={styles.subtitle}>Binaural Stereo ve İzokronik Nabız Terapisi</Text>
      </View>

      {/* Mode Selector: Binaural vs Isochronic */}
      <View style={styles.modeToggleRow}>
        <TouchableOpacity
          style={[styles.modeToggleBtn, entrainmentType === 'binaural' && styles.modeToggleBtnActive]}
          onPress={() => handleToggleEntrainmentType('binaural')}
        >
          <Text style={[styles.modeToggleText, entrainmentType === 'binaural' && styles.modeToggleTextActive]}>
            🎧 BİNAURAL (STEREO)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeToggleBtn, entrainmentType === 'isochronic' && styles.modeToggleBtnActive]}
          onPress={() => handleToggleEntrainmentType('isochronic')}
        >
          <Text style={[styles.modeToggleText, entrainmentType === 'isochronic' && styles.modeToggleTextActive]}>
            🔊 İZOKRONİK (KULAKLIKSIZ)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Advisory Notice */}
      {entrainmentType === 'binaural' ? (
        <View style={styles.headphoneNotice}>
          <Text style={styles.headphoneIcon}>🎧</Text>
          <Text style={styles.headphoneText}>
            Binaural mod için <Text style={styles.boldText}>Stereo Kulaklık</Text> şarttır. Sol ve sağ kanallar farklı frekans iletir.
          </Text>
        </View>
      ) : (
        <View style={[styles.headphoneNotice, styles.isoNotice]}>
          <Text style={styles.headphoneIcon}>🔊</Text>
          <Text style={styles.headphoneText}>
            İzokronik mod <Text style={styles.boldText}>Kulaklık Gerektirmez</Text>. Hoparlörden ritmik genlik vuruşları yayılır.
          </Text>
        </View>
      )}

      {/* Visualizer */}
      <View style={styles.visualizerCard}>
        <AudioVisualizer isPlaying={isPlaying} accentColor={selectedBand.color} height={95} />
      </View>

      {/* Lissajous Rezonans Görselleştiricisi */}
      {entrainmentType === 'binaural' && (
        <View style={styles.lissajousCard}>
          <Text style={styles.lissajousTitle}>Lissajous Rezonans</Text>
          <LissajousVisualizer
            isPlaying={isPlaying}
            leftFreq={binCalc.leftFrequency}
            rightFreq={binCalc.rightFrequency}
            accentColor={selectedBand.color}
            size={160}
          />
          <Text style={styles.lissajousCaption}>
            Sol / Sağ faz farkı geometrisi
          </Text>
        </View>
      )}
      {/* Channel / Pulse Display */}
      {entrainmentType === 'binaural' ? (
        <View style={styles.stereoSplitRow}>
          <View style={styles.channelCard}>
            <Text style={styles.channelTag}>SOL KULAK (L)</Text>
            <Text style={styles.channelFreq}>{binCalc.leftFrequency}</Text>
            <Text style={styles.channelUnit}>Hz</Text>
          </View>

          <View style={styles.beatDifferenceBadge}>
            <Text style={styles.beatDiffTitle}>BEYİN FARKI</Text>
            <Text style={[styles.beatDiffNumber, { color: selectedBand.color }]}>
              +{binCalc.frequencyDelta} Hz
            </Text>
            <Text style={styles.beatDiffName}>{selectedBand.name}</Text>
          </View>

          <View style={styles.channelCard}>
            <Text style={styles.channelTag}>SAĞ KULAK (R)</Text>
            <Text style={styles.channelFreq}>{binCalc.rightFrequency}</Text>
            <Text style={styles.channelUnit}>Hz</Text>
          </View>
        </View>
      ) : (
        <View style={styles.stereoSplitRow}>
          <View style={styles.channelCard}>
            <Text style={styles.channelTag}>TAŞIYICI TON</Text>
            <Text style={styles.channelFreq}>{carrier}</Text>
            <Text style={styles.channelUnit}>Hz</Text>
          </View>

          <View style={styles.beatDifferenceBadge}>
            <Text style={styles.beatDiffTitle}>İZOKRONİK RİTİM</Text>
            <Text style={[styles.beatDiffNumber, { color: selectedBand.color }]}>
              {beatFreq} Hz
            </Text>
            <Text style={styles.beatDiffName}>Periyot: {isoCalc.periodSeconds}s</Text>
          </View>

          <View style={styles.channelCard}>
            <Text style={styles.channelTag}>MODÜLASYON</Text>
            <Text style={styles.channelFreq}>%50</Text>
            <Text style={styles.channelUnit}>Pulse S-Curve</Text>
          </View>
        </View>
      )}

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
          {isPlaying ? '■ SEANSI DURDUR' : `▶ ${entrainmentType.toUpperCase()} ${selectedBand.name.toUpperCase()} BAŞLAT`}
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
  modeToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#16161A',
    borderRadius: 12,
    padding: 3,
    marginBottom: 10,
    gap: 4,
  },
  modeToggleBtn: {
    flex: 1,
    height: 38,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeToggleBtnActive: {
    backgroundColor: AppleTheme.colors.cardHover,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  modeToggleText: {
    color: AppleTheme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  modeToggleTextActive: {
    color: AppleTheme.colors.textPrimary,
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
  isoNotice: {
    backgroundColor: 'rgba(48, 209, 88, 0.1)',
    borderColor: 'rgba(48, 209, 88, 0.25)',
  },
  headphoneIcon: {
    fontSize: 18,
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
    fontSize: 9,
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
    fontSize: 10,
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
    paddingHorizontal: 8,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentBeatText: {
    color: '#FFFFFF',
    fontSize: 14,
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
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  lissajousCard: {
    backgroundColor: AppleTheme.colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppleTheme.colors.divider,
  },
  lissajousTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: AppleTheme.colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  lissajousCaption: {
    fontSize: 10,
    color: AppleTheme.colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
});