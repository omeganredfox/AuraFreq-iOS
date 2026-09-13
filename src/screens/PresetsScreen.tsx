import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppleTheme } from '../theme/colors';
import { ALL_PRESETS, FrequencyPreset, PresetCategory } from '../constants/presets';
import { AmbienceType } from '../audio/types';
import { dspEngine } from '../audio/dspEngine';
import { StorageService, FavoriteRecipe } from '../store/storage';
import { useSleepTimer } from '../hooks/useSleepTimer';

interface PresetsScreenProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const PresetsScreen: React.FC<PresetsScreenProps> = ({ isPlaying, onTogglePlay }) => {
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [ambienceType, setAmbienceType] = useState<AmbienceType>('none');
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);

  const { minutesLeft, startTimer, clearTimer } = useSleepTimer(() => {
    // When timer expires
    if (isPlaying) onTogglePlay();
    dspEngine.stop();
  });

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await StorageService.getFavorites();
    setFavorites(favs);
  };

  const handleSelectPreset = (preset: FrequencyPreset) => {
    setActivePresetId(preset.id);
    dspEngine.play({
      mode: 'single',
      toneEnabled: true,
      toneFrequency: preset.frequency,
      toneWave: preset.waveType,
      toneVolume: 0.9,
      entrainmentEnabled: false,
      ambienceType,
      ambienceVolume: 0.5,
      masterVolume: 0.9,
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
      dspEngine.play({ ambienceType: nextType, ambienceVolume: 0.5 });
    }
  };

  const AMBIENCE_OPTIONS: { id: AmbienceType; label: string; icon: keyof typeof Feather.glyphMap }[] = [
    { id: 'white', label: 'Beyaz Gürültü', icon: 'wind' },
    { id: 'rain', label: 'Yağmur', icon: 'cloud-drizzle' },
    { id: 'ocean', label: 'Okyanus', icon: 'droplet' },
    { id: 'pink', label: 'Pembe Gürültü', icon: 'radio' },
    { id: 'brown', label: 'Kahve Gürültü', icon: 'coffee' },
  ];

  const renderPresetList = (category: PresetCategory, title: string) => {
    const presets = ALL_PRESETS.filter(p => p.category === category);
    if (presets.length === 0) return null;

    return (
      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {presets.map((preset) => (
            <TouchableOpacity
              key={preset.id}
              style={[styles.presetCard, activePresetId === preset.id && styles.presetCardActive]}
              onPress={() => handleSelectPreset(preset)}
            >
              <View style={styles.cardIconBox}>
                <Feather name={preset.iconName as keyof typeof Feather.glyphMap} size={32} color={activePresetId === preset.id ? AppleTheme.colors.textPrimary : AppleTheme.colors.textSecondary} />
              </View>
              <Text style={[styles.cardTitle, activePresetId === preset.id && { color: AppleTheme.colors.textPrimary }]}>{preset.name}</Text>
              <Text style={styles.cardSub}>{preset.frequency} Hz</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Uyku Zamanlayıcısı */}
      <View style={styles.timerSection}>
        <Text style={styles.sectionTitle}>Uyku Zamanlayıcısı</Text>
        {minutesLeft !== null ? (
          <View style={styles.timerActiveCard}>
            <View style={styles.timerActiveLeft}>
              <Feather name="clock" size={24} color={AppleTheme.colors.accentBlue} />
              <Text style={styles.timerCountdown}>{minutesLeft} dk kaldı</Text>
            </View>
            <TouchableOpacity style={styles.timerCancelBtn} onPress={clearTimer}>
              <Text style={styles.timerCancelText}>İptal Et</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.timerRow}>
            {[15, 30, 60].map(mins => (
              <TouchableOpacity key={mins} style={styles.timerBtn} onPress={() => startTimer(mins)}>
                <Text style={styles.timerBtnText}>{mins} dk</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Soundscapes (Doğa & Ambiyans) */}
      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>Soundscapes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {AMBIENCE_OPTIONS.map((amb) => (
            <TouchableOpacity
              key={amb.id}
              style={[styles.ambienceCard, ambienceType === amb.id && styles.ambienceCardActive]}
              onPress={() => handleToggleAmbience(amb.id)}
            >
              <View style={styles.cardIconBox}>
                <Feather name={amb.icon} size={28} color={ambienceType === amb.id ? AppleTheme.colors.textPrimary : AppleTheme.colors.textSecondary} />
              </View>
              <Text style={[styles.cardTitle, ambienceType === amb.id && { color: AppleTheme.colors.textPrimary }]}>{amb.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Kategoriler */}
      {renderPresetList('sleep', 'Sleep & Rest')}
      {renderPresetList('focus', 'Deep Focus')}
      {renderPresetList('meditation', 'Meditation & Flow')}
      {renderPresetList('recovery', 'Recovery & Healing')}
      {renderPresetList('relax', 'Relaxation')}

      {/* Favoriler (Custom Scenarios) */}
      {favorites.length > 0 && (
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Scenarios (Favorites)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {favorites.map((fav) => (
              <TouchableOpacity
                key={fav.id}
                style={[styles.presetCard, activePresetId === fav.id && styles.presetCardActive]}
                onPress={() => handleSelectFavorite(fav)}
              >
                <View style={styles.cardIconBox}>
                  <Feather name="star" size={32} color={AppleTheme.colors.accentAmber} />
                </View>
                <Text style={styles.cardTitle}>{fav.name}</Text>
                <Text style={styles.cardSub}>Custom Recipe</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={{ height: 120 }} /> {/* BottomPlayer ve TabBar boşluğu */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppleTheme.colors.background },
  content: { paddingVertical: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: AppleTheme.colors.textPrimary, marginLeft: 16, marginBottom: 12 },
  
  categorySection: { marginBottom: 32 },
  categoryTitle: { fontSize: 22, fontWeight: '700', color: AppleTheme.colors.textPrimary, marginLeft: 16, marginBottom: 16 },
  hScroll: { paddingHorizontal: 16, gap: 16 },
  
  presetCard: {
    width: 140,
    height: 160,
    backgroundColor: AppleTheme.colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppleTheme.colors.cardBorder,
    padding: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  presetCardActive: {
    backgroundColor: '#1C1C1E', // Hafif parlak siyah
    borderColor: '#FFFFFF', // Beyaz çizgi
  },
  cardIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: AppleTheme.colors.textSecondary,
    textAlign: 'center',
  },
  cardSub: {
    fontSize: 12,
    color: AppleTheme.colors.textTertiary,
    marginTop: 4,
  },

  ambienceCard: {
    width: 110,
    height: 130,
    backgroundColor: AppleTheme.colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppleTheme.colors.cardBorder,
    padding: 12,
    alignItems: 'center',
  },
  ambienceCardActive: {
    borderColor: '#FFFFFF',
    backgroundColor: '#1C1C1E',
  },

  timerSection: { marginBottom: 32 },
  timerRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16 },
  timerBtn: { flex: 1, backgroundColor: AppleTheme.colors.card, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  timerBtnText: { color: AppleTheme.colors.textPrimary, fontSize: 16, fontWeight: '600' },
  timerActiveCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(10, 132, 255, 0.1)', marginHorizontal: 16, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(10, 132, 255, 0.3)' },
  timerActiveLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timerCountdown: { color: AppleTheme.colors.accentBlue, fontSize: 18, fontWeight: '700', fontVariant: ['tabular-nums'] },
  timerCancelBtn: { backgroundColor: 'rgba(255, 255, 255, 0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  timerCancelText: { color: AppleTheme.colors.textPrimary, fontSize: 14, fontWeight: '600' },
});