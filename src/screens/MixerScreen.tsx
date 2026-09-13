import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { dspEngine } from '../audio/dspEngine';
import { AmbienceType, EntrainmentType, OscillatorWaveType } from '../audio/types';
import { AppleTheme } from '../theme/colors';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { LissajousVisualizer } from '../components/LissajousVisualizer';
import { StorageService } from '../store/storage';

interface MixerScreenProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const MixerScreen: React.FC<MixerScreenProps> = ({ isPlaying, onTogglePlay }) => {
  // Layer 1 State
  const [toneEnabled, setToneEnabled] = useState<boolean>(true);
  const [toneFreq, setToneFreq] = useState<number>(528);
  const [toneWave, setToneWave] = useState<OscillatorWaveType>('sine');
  const [toneVol, setToneVol] = useState<number>(0.6);

  // Layer 2 State
  const [entrainmentEnabled, setEntrainmentEnabled] = useState<boolean>(true);
  const [entrainmentType, setEntrainmentType] = useState<EntrainmentType>('binaural');
  const [carrierFreq, setCarrierFreq] = useState<number>(216);
  const [beatFreq, setBeatFreq] = useState<number>(10);
  const [entrainmentVol, setEntrainmentVol] = useState<number>(0.7);

  // Layer 3 State
  const [ambienceType, setAmbienceType] = useState<AmbienceType>('rain');
  const [ambienceVol, setAmbienceVol] = useState<number>(0.4);

  // Master
  const [masterVol, setMasterVol] = useState<number>(0.8);

  const applyEngineUpdate = (patch: Record<string, any>) => {
    if (isPlaying) {
      dspEngine.updateParameters(patch);
    }
  };

  const handleMasterPlayToggle = () => {
    if (!isPlaying) {
      dspEngine.play({
        mode: 'multi',
        toneEnabled,
        toneFrequency: toneFreq,
        toneWave,
        toneVolume: toneVol,
        entrainmentEnabled,
        entrainmentType,
        carrierFrequency: carrierFreq,
        beatFrequency: beatFreq,
        entrainmentVolume: entrainmentVol,
        ambienceType,
        ambienceVolume: ambienceVol,
        masterVolume: masterVol,
      });
    } else {
      dspEngine.stop();
    }
    onTogglePlay();
  };

  const handleSaveFavorite = async () => {
    try {
      const name = `Reçete ${toneFreq}Hz + ${beatFreq}Hz`;
      await StorageService.saveFavorite(name, {
        mode: 'multi',
        toneEnabled,
        toneFrequency: toneFreq,
        toneWave,
        toneVolume: toneVol,
        entrainmentEnabled,
        entrainmentType,
        carrierFrequency: carrierFreq,
        beatFrequency: beatFreq,
        entrainmentVolume: entrainmentVol,
        ambienceType,
        ambienceVolume: ambienceVol,
        masterVolume: masterVol,
      });
      alert('Favorilere eklendi!');
    } catch (e) {
      console.error(e);
      alert('Hata oluştu');
    }
  };

  const AMBIENCE_CHOICES: { id: AmbienceType; label: string; icon: string }[] = [
    { id: 'none', label: 'Kapalı', icon: '🚫' },
    { id: 'white', label: 'Beyaz', icon: '☁️' },
    { id: 'rain', label: 'Yağmur', icon: '🌧️' },
    { id: 'ocean', label: 'Okyanus', icon: '🌊' },
    { id: 'pink', label: 'Pembe', icon: '🌸' },
    { id: 'brown', label: 'Kahve', icon: '🍂' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.header}>
          <Text style={styles.title}>Çoklu Katman Mikseri</Text>
          <Text style={styles.subtitle}>Saf Ton + Beyin Dalgası + Doğa Ambiyansı</Text>
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveFavorite}>
          <Text style={styles.saveBtnText}>⭐ Kaydet</Text>
        </TouchableOpacity>
      </View>

      {/* Visualizer */}
      <View style={styles.visualizerCard}>
        <AudioVisualizer isPlaying={isPlaying} accentColor={AppleTheme.colors.accentGreen} height={85} />
      </View>

      {/* Lissajous — binaural katmanı aktifken */}
      {entrainmentEnabled && entrainmentType === 'binaural' && (
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <LissajousVisualizer
            isPlaying={isPlaying}
            leftFreq={carrierFreq}
            rightFreq={carrierFreq + beatFreq}
            accentColor={AppleTheme.colors.accentPurple}
            size={120}
          />
        </View>
      )}

      {/* LAYER 1: SAF TON / SOLFEGGIO */}
      <View style={styles.channelStrip}>
        <View style={styles.stripHeader}>
          <View style={styles.stripTitleGroup}>
            <View style={[styles.statusPill, toneEnabled ? styles.pillActive : styles.pillInactive]} />
            <Text style={styles.stripTitle}>KATMAN 1: SAF TON</Text>
          </View>
          <TouchableOpacity
            style={[styles.toggleBtn, toneEnabled && styles.toggleBtnActive]}
            onPress={() => {
              const next = !toneEnabled;
              setToneEnabled(next);
              applyEngineUpdate({ toneEnabled: next });
            }}
          >
            <Text style={styles.toggleBtnText}>{toneEnabled ? 'AÇIK' : 'KAPALI'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stripControlsRow}>
          <Text style={styles.freqBadgeText}>{toneFreq} Hz ({toneWave})</Text>
          <View style={styles.faderControls}>
            <Text style={styles.faderLabel}>Ses: {Math.round(toneVol * 100)}%</Text>
            <View style={styles.stepBtnGroup}>
              <TouchableOpacity
                style={styles.volStepBtn}
                onPress={() => {
                  const next = Math.max(0, Number((toneVol - 0.1).toFixed(1)));
                  setToneVol(next);
                  applyEngineUpdate({ toneVolume: next });
                }}
              >
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.volStepBtn}
                onPress={() => {
                  const next = Math.min(1, Number((toneVol + 0.1).toFixed(1)));
                  setToneVol(next);
                  applyEngineUpdate({ toneVolume: next });
                }}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* LAYER 2: BEYİN DALGASI (BINAURAL / İZOKRONİK) */}
      <View style={styles.channelStrip}>
        <View style={styles.stripHeader}>
          <View style={styles.stripTitleGroup}>
            <View style={[styles.statusPill, entrainmentEnabled ? styles.pillActive : styles.pillInactive]} />
            <Text style={styles.stripTitle}>KATMAN 2: BEYİN UYARIMI</Text>
          </View>
          <TouchableOpacity
            style={[styles.toggleBtn, entrainmentEnabled && styles.toggleBtnActive]}
            onPress={() => {
              const next = !entrainmentEnabled;
              setEntrainmentEnabled(next);
              applyEngineUpdate({ entrainmentEnabled: next });
            }}
          >
            <Text style={styles.toggleBtnText}>{entrainmentEnabled ? 'AÇIK' : 'KAPALI'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.typeSelectorRow}>
          <TouchableOpacity
            style={[styles.typeMiniBtn, entrainmentType === 'binaural' && styles.typeMiniBtnActive]}
            onPress={() => {
              setEntrainmentType('binaural');
              if (isPlaying) {
                dspEngine.stop().then(() => {
                  dspEngine.play({ entrainmentType: 'binaural' });
                });
              }
            }}
          >
            <Text style={[styles.typeMiniText, entrainmentType === 'binaural' && styles.typeMiniTextActive]}>
              🎧 Binaural
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeMiniBtn, entrainmentType === 'isochronic' && styles.typeMiniBtnActive]}
            onPress={() => {
              setEntrainmentType('isochronic');
              if (isPlaying) {
                dspEngine.stop().then(() => {
                  dspEngine.play({ entrainmentType: 'isochronic' });
                });
              }
            }}
          >
            <Text style={[styles.typeMiniText, entrainmentType === 'isochronic' && styles.typeMiniTextActive]}>
              🔊 İzokronik
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stripControlsRow}>
          <Text style={styles.freqBadgeText}>+{beatFreq} Hz Ritim</Text>
          <View style={styles.faderControls}>
            <Text style={styles.faderLabel}>Ses: {Math.round(entrainmentVol * 100)}%</Text>
            <View style={styles.stepBtnGroup}>
              <TouchableOpacity
                style={styles.volStepBtn}
                onPress={() => {
                  const next = Math.max(0, Number((entrainmentVol - 0.1).toFixed(1)));
                  setEntrainmentVol(next);
                  applyEngineUpdate({ entrainmentVolume: next });
                }}
              >
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.volStepBtn}
                onPress={() => {
                  const next = Math.min(1, Number((entrainmentVol + 0.1).toFixed(1)));
                  setEntrainmentVol(next);
                  applyEngineUpdate({ entrainmentVolume: next });
                }}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* LAYER 3: DOĞAL AMBİYANS & YAĞMUR/OKYANUS */}
      <View style={styles.channelStrip}>
        <View style={styles.stripHeader}>
          <View style={styles.stripTitleGroup}>
            <View style={[styles.statusPill, ambienceType !== 'none' ? styles.pillActive : styles.pillInactive]} />
            <Text style={styles.stripTitle}>KATMAN 3: DOĞA & AMBİYANS</Text>
          </View>
        </View>

        <View style={styles.ambienceChoiceGrid}>
          {AMBIENCE_CHOICES.map((choice) => (
            <TouchableOpacity
              key={choice.id}
              style={[styles.ambChoiceBtn, ambienceType === choice.id && styles.ambChoiceBtnActive]}
              onPress={() => {
                setAmbienceType(choice.id);
                if (isPlaying) {
                  dspEngine.stop().then(() => {
                    dspEngine.play({ ambienceType: choice.id });
                  });
                }
              }}
            >
              <Text style={styles.ambIcon}>{choice.icon}</Text>
              <Text style={[styles.ambText, ambienceType === choice.id && styles.ambTextActive]}>
                {choice.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {ambienceType !== 'none' && (
          <View style={styles.stripControlsRow}>
            <Text style={styles.freqBadgeText}>Sentetik DSP</Text>
            <View style={styles.faderControls}>
              <Text style={styles.faderLabel}>Ses: {Math.round(ambienceVol * 100)}%</Text>
              <View style={styles.stepBtnGroup}>
                <TouchableOpacity
                  style={styles.volStepBtn}
                  onPress={() => {
                    const next = Math.max(0, Number((ambienceVol - 0.1).toFixed(1)));
                    setAmbienceVol(next);
                    applyEngineUpdate({ ambienceVolume: next });
                  }}
                >
                  <Text style={styles.stepBtnText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.volStepBtn}
                  onPress={() => {
                    const next = Math.min(1, Number((ambienceVol + 0.1).toFixed(1)));
                    setAmbienceVol(next);
                    applyEngineUpdate({ ambienceVolume: next });
                  }}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* MASTER PLAY / STOP */}
      <TouchableOpacity
        style={[styles.masterPlayBtn, isPlaying && styles.masterPlayBtnActive]}
        onPress={handleMasterPlayToggle}
      >
        <Text style={styles.masterPlayBtnText}>
          {isPlaying ? '■ MİKSERİ DURDUR' : '▶ 3 KATMANLI REZONANSI BAŞLAT'}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  header: {
    flex: 1,
  },
  saveBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#FFD60A',
    fontSize: 12,
    fontWeight: '700',
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
    marginBottom: 12,
  },
  channelStrip: {
    backgroundColor: AppleTheme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppleTheme.colors.cardBorder,
    padding: 12,
    marginBottom: 10,
  },
  stripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stripTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pillActive: {
    backgroundColor: AppleTheme.colors.accentGreen,
  },
  pillInactive: {
    backgroundColor: AppleTheme.colors.textTertiary,
  },
  stripTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: AppleTheme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  toggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(48, 209, 88, 0.2)',
  },
  toggleBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppleTheme.colors.textPrimary,
  },
  stripControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  freqBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppleTheme.colors.textPrimary,
  },
  faderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  faderLabel: {
    fontSize: 12,
    color: AppleTheme.colors.textSecondary,
    fontWeight: '600',
  },
  stepBtnGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  volStepBtn: {
    width: 32,
    height: 32, // Gate 4: compact in cluster, accessible
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  typeSelectorRow: {
    flexDirection: 'row',
    backgroundColor: '#18181C',
    borderRadius: 10,
    padding: 3,
    marginBottom: 6,
    gap: 4,
  },
  typeMiniBtn: {
    flex: 1,
    height: 32,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeMiniBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  typeMiniText: {
    color: AppleTheme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  typeMiniTextActive: {
    color: AppleTheme.colors.textPrimary,
    fontWeight: '700',
  },
  ambienceChoiceGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  ambChoiceBtn: {
    flex: 1,
    height: 44, // Gate 4: 44pt
    backgroundColor: '#18181D',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  ambChoiceBtnActive: {
    borderColor: AppleTheme.colors.accentGreen,
    backgroundColor: 'rgba(48, 209, 88, 0.12)',
  },
  ambIcon: {
    fontSize: 14,
  },
  ambText: {
    fontSize: 10,
    fontWeight: '600',
    color: AppleTheme.colors.textSecondary,
    marginTop: 2,
  },
  ambTextActive: {
    color: AppleTheme.colors.accentGreen,
  },
  masterPlayBtn: {
    height: 54, // Gate 4: 44pt+
    backgroundColor: AppleTheme.colors.accentGreen,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: AppleTheme.colors.accentGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
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
});