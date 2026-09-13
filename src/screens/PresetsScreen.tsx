import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { dspEngine } from '../audio/dspEngine';
import { SOLFEGGIO_PRESETS, NATURAL_PRESETS, FrequencyPreset } from '../constants/presets';
import { AmbienceType } from '../audio/types';
import { AppleTheme } from '../theme/colors';
import { useSleepTimer } from '../hooks/useSleepTimer';
import { StorageService, FavoriteRecipe } from '../store/storage';

interface PresetsScreenProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const PresetsScreen: React.FC<PresetsScreenProps> = ({ isPlaying, onTogglePlay }) => {
  const [activePresetId, setActivePresetId] = useState<string>('solf-528');
  const [ambienceType, setAmbienceType] = useState<AmbienceType>('none');
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  
  const { minutesLeft, startTimer, clearTimer } = useSleepTimer(() => {
    if (isPlaying) onTogglePlay();
  });

  const allPresets: FrequencyPreset[] = [...NATURAL_PRESETS, ...SOLFEGGIO_PRESETS];

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await StorageService.getFavorites();
    setFavorites(favs);
  };

  const handleDeleteFavorite = async (id: string) => {
    await StorageService.removeFavorite(id);
    loadFavorites();
  };

  const handleSelectPreset = (preset: FrequencyPreset) => {
    setActivePresetId(preset.id);
    dspEngine.play({
      mode: 'single',
      toneEnabled: true,
      toneFrequency: preset.frequency,
      toneWave: preset.waveType,
      toneVolume: 0.7,
      entrainmentEnabled: false,
      ambienceType,
      ambienceVolume: 0.3,
      masterVolume: 0.75,
    });
    if (!isPlaying) {
      onTogglePlay();
    }
  };

  const handleSelectFavorite = (fav: FavoriteRecipe) => {
    setActivePresetId(fav.id);
    dspEngine.play(fav.config);
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

  const AMBIENCE_OPTIONS: { id: AmbienceType; label: string; desc: string }[] = [
    { id: 'rain', label: '🌧️ Yağmur', desc: 'Sakinleştirici doğal yağmur sesi' },
    { id: 'ocean', label: '🌊 Okyanus', desc: '12 sn ritmik okyanus dalgaları' },
    { id: 'pink', label: '🌸 Pembe', desc: '1/f dinlendirici gürültü' },
    { id: 'brown', label: '🍂 Kahve', desc: 'Derin uğultu, odaklanma' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Şifa & Reçeteler</Text>
        <Text style={styles.subtitle}>Hazır frekanslar ve favori miksleriniz</Text>
      </View>

      {/* Uyku Zamanlayıcısı */}
      <View style={styles.timerCard}>
        <Text style={styles.sectionTitle}>UYKU ZAMANLAYICISI</Text>
        <Text style={styles.timerDesc}>Süre bitiminde ses yavaşça kapanır (Gate 3 Envelope)</Text>
        
        {minutesLeft !== null ? (
          <View style={styles.timerActiveRow}>
            <Text style={styles.timerCountdown}>Kapanmasına: {minutesLeft} dk</Text>
            <TouchableOpacity style={styles.timerCancelBtn} onPress={clearTimer}>
              <Text style={styles.timerCancelBtnText}>İptal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.timerOptionsRow}>
            {[15, 30, 60].map(mins => (
              <TouchableOpacity key={mins} style={styles.timerBtn} onPress={() => startTimer(mins)}>
                <Text style={styles.timerBtnText}>{mins} dk</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Favorilerim */}
      {favorites.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>KAYDEDİLEN REÇETELER</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.favScroll}>
            {favorites.map(fav => (
              <TouchableOpacity
                key={fav.id}
                style={[styles.favCard, activePresetId === fav.id && styles.favCardActive]}
                onPress={() => handleSelectFavorite(fav)}
              >
                <Text style={styles.favName}>{fav.name}</Text>
                <TouchableOpacity style={styles.favDeleteBtn} onPress={() => handleDeleteFavorite(fav.id)}>
                  <Text style={styles.favDeleteText}>Sil</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Ambiyans Katmanı */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ARKA PLAN AMBİYANSI Ekle</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ambienceScroll}>
          {AMBIENCE_OPTIONS.map((amb) => (
            <TouchableOpacity
              key={amb.id}
              style={[styles.ambienceCard, ambienceType === amb.id && styles.ambienceCardActive]}
              onPress={() => handleToggleAmbience(amb.id)}
            >
              <Text style={styles.ambienceIcon}>{amb.label.split(' ')[0]}</Text>
              <Text style={styles.ambienceLabel}>{amb.label.split(' ')[1]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Saf Frekanslar (Solfeggio vb) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DOĞAL & SOLFEGGIO FREKANSLARI</Text>
        <View style={styles.presetList}>
          {allPresets.map((preset) => (
            <TouchableOpacity
              key={preset.id}
              style={[styles.presetCard, activePresetId === preset.id && styles.presetCardActive]}
              onPress={() => handleSelectPreset(preset)}
            >
              <View style={{ width: 6, backgroundColor: preset.color }} />
              <View style={styles.presetInfo}>
                <Text style={styles.presetName}>{preset.name}</Text>
                <Text style={styles.presetFreq}>{preset.frequency} Hz</Text>
                <Text style={styles.presetDesc}>{preset.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppleTheme.colors.background },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: AppleTheme.colors.textPrimary },
  subtitle: { fontSize: 14, color: AppleTheme.colors.textSecondary, marginTop: 4 },
  
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: AppleTheme.colors.textSecondary, letterSpacing: 0.5, marginBottom: 12, textTransform: 'uppercase' },
  
  timerCard: { backgroundColor: AppleTheme.colors.card, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: AppleTheme.colors.cardBorder },
  timerDesc: { fontSize: 12, color: AppleTheme.colors.textSecondary, marginBottom: 16 },
  timerOptionsRow: { flexDirection: 'row', gap: 12 },
  timerBtn: { flex: 1, height: 44, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  timerBtnText: { color: AppleTheme.colors.textPrimary, fontSize: 15, fontWeight: '600' },
  timerActiveRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(48, 209, 88, 0.1)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(48, 209, 88, 0.3)' },
  timerCountdown: { color: AppleTheme.colors.accentGreen, fontSize: 16, fontWeight: '700' },
  timerCancelBtn: { backgroundColor: AppleTheme.colors.card, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  timerCancelBtnText: { color: AppleTheme.colors.danger, fontSize: 13, fontWeight: '700' },

  favScroll: { gap: 12, paddingRight: 16 },
  favCard: { width: 160, height: 80, backgroundColor: AppleTheme.colors.card, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: AppleTheme.colors.cardBorder, justifyContent: 'space-between' },
  favCardActive: { borderColor: '#FFD60A', backgroundColor: 'rgba(255, 214, 10, 0.05)' },
  favName: { color: '#FFD60A', fontSize: 14, fontWeight: '700' },
  favDeleteBtn: { alignSelf: 'flex-end', backgroundColor: 'rgba(255, 69, 58, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  favDeleteText: { color: AppleTheme.colors.danger, fontSize: 11, fontWeight: '600' },

  ambienceScroll: { gap: 12 },
  ambienceCard: { width: 100, height: 100, backgroundColor: AppleTheme.colors.card, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: AppleTheme.colors.cardBorder },
  ambienceCardActive: { borderColor: AppleTheme.colors.accentBlue, backgroundColor: 'rgba(10, 132, 255, 0.1)' },
  ambienceIcon: { fontSize: 32, marginBottom: 8 },
  ambienceLabel: { color: AppleTheme.colors.textPrimary, fontSize: 13, fontWeight: '600' },

  presetList: { gap: 12 },
  presetCard: { flexDirection: 'row', backgroundColor: AppleTheme.colors.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: AppleTheme.colors.cardBorder },
  presetCardActive: { borderColor: AppleTheme.colors.accentPurple, backgroundColor: 'rgba(191, 90, 242, 0.05)' },
  presetInfo: { flex: 1, padding: 16 },
  presetName: { fontSize: 16, fontWeight: '700', color: AppleTheme.colors.textPrimary },
  presetFreq: { fontSize: 14, fontWeight: '600', color: AppleTheme.colors.textSecondary, marginTop: 4 },
  presetDesc: { fontSize: 12, color: AppleTheme.colors.textSecondary, marginTop: 8, lineHeight: 18 },
});