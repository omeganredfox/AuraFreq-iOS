import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { IPhoneSimulator } from './src/components/iPhoneSimulator';
import { ToneLabScreen } from './src/screens/ToneLabScreen';
import { BinauralLabScreen } from './src/screens/BinauralLabScreen';
import { MixerScreen } from './src/screens/MixerScreen';
import { PresetsScreen } from './src/screens/PresetsScreen';
import { AppleTheme } from './src/theme/colors';

type TabKey = 'tone' | 'binaural' | 'mixer' | 'presets';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('mixer');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <IPhoneSimulator isPlaying={isPlaying} accentColor={activeTab === 'binaural' ? '#BF5AF2' : '#0A84FF'}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top App Bar with Live Indicator */}
        <View style={styles.topBar}>
          <View style={styles.logoGroup}>
            <Text style={styles.logoText}>AuraFreq</Text>
            <View style={styles.platformBadge}>
              <Text style={styles.platformBadgeText}>iOS 18</Text>
            </View>
          </View>

          {isPlaying ? (
            <View style={styles.liveAudioBadge}>
              <View style={styles.pulsingDot} />
              <Text style={styles.liveAudioText}>DSP YAYINDA</Text>
            </View>
          ) : (
            <View style={styles.idleBadge}>
              <Text style={styles.idleBadgeText}>HAZIR</Text>
            </View>
          )}
        </View>

        {/* Screen Content Viewport */}
        <View style={styles.screenContainer}>
          {activeTab === 'tone' && (
            <ToneLabScreen isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />
          )}
          {activeTab === 'binaural' && (
            <BinauralLabScreen isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />
          )}
          {activeTab === 'mixer' && (
            <MixerScreen isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />
          )}
          {activeTab === 'presets' && (
            <PresetsScreen isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />
          )}
        </View>

        {/* Apple HIG Bottom Tab Bar (Gate 4: 48pt targets) */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('tone')}
          >
            <Text style={[styles.tabIcon, activeTab === 'tone' && styles.tabIconActive]}>
              〰️
            </Text>
            <Text style={[styles.tabLabel, activeTab === 'tone' && styles.tabLabelActive]}>
              Saf Ton
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('binaural')}
          >
            <Text style={[styles.tabIcon, activeTab === 'binaural' && styles.tabIconActive]}>
              🧠
            </Text>
            <Text style={[styles.tabLabel, activeTab === 'binaural' && styles.tabLabelActive]}>
              Beyin
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('mixer')}
          >
            <Text style={[styles.tabIcon, activeTab === 'mixer' && styles.tabIconActive]}>
              🎛️
            </Text>
            <Text style={[styles.tabLabel, activeTab === 'mixer' && styles.tabLabelActive]}>
              Mikser
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('presets')}
          >
            <Text style={[styles.tabIcon, activeTab === 'presets' && styles.tabIconActive]}>
              ✨
            </Text>
            <Text style={[styles.tabLabel, activeTab === 'presets' && styles.tabLabelActive]}>
              Şifa
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </IPhoneSimulator>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppleTheme.colors.background,
  },
  topBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontSize: 17,
    fontWeight: '800',
    color: AppleTheme.colors.textPrimary,
    letterSpacing: 0.3,
  },
  platformBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  platformBadgeText: {
    color: AppleTheme.colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  liveAudioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(48, 209, 88, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(48, 209, 88, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 6,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AppleTheme.colors.accentGreen,
  },
  liveAudioText: {
    color: AppleTheme.colors.accentGreen,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  idleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  idleBadgeText: {
    color: AppleTheme.colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: AppleTheme.colors.background,
  },
  tabBar: {
    height: 64,
    flexDirection: 'row',
    backgroundColor: '#0D0D10',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingBottom: 4,
  },
  tabItem: {
    flex: 1,
    height: 48, // Gate 4: minimum 44pt
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 18,
    opacity: 0.45,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppleTheme.colors.textSecondary,
    marginTop: 2,
  },
  tabLabelActive: {
    color: AppleTheme.colors.accentBlue,
    fontWeight: '700',
  },
});