import React from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { AppleTheme } from '../theme/colors';

interface SimulatorProps {
  children: React.ReactNode;
}

export const IPhoneSimulator: React.FC<SimulatorProps> = ({ children }) => {
  // If running on a real iOS/Android device, display full native screen without mockup chassis
  if (Platform.OS !== 'web') {
    return <View style={styles.nativeContainer}>{children}</View>;
  }

  const { width } = Dimensions.get('window');
  const isDesktop = width > 700;

  if (!isDesktop) {
    // If opened on mobile browser, fill the screen
    return <View style={styles.mobileWebContainer}>{children}</View>;
  }

  return (
    <View style={styles.outerDesktopWrapper}>
      {/* Background ambient branding */}
      <View style={styles.brandHeader}>
        <Text style={styles.brandTitle}>AuraFreq iOS</Text>
        <Text style={styles.brandSubtitle}>
          Windows 11 Live Simulator • Apple HIG & Binaural DSP Audio Engine
        </Text>
      </View>

      {/* Titanium iPhone 16 Pro Chassis */}
      <View style={styles.phoneChassis}>
        {/* Outer Titanium Rim */}
        <View style={styles.phoneScreen}>
          {/* Dynamic Island */}
          <View style={styles.islandContainer}>
            <View style={styles.dynamicIsland}>
              <View style={styles.islandCamera} />
              <View style={styles.islandSensor} />
            </View>
          </View>

          {/* Status Bar */}
          <View style={styles.statusBar}>
            <Text style={styles.statusTime}>21:41</Text>
            <View style={styles.statusIcons}>
              <Text style={styles.statusIconText}>5G</Text>
              <Text style={styles.statusIconText}>􀙇</Text>
              <Text style={styles.statusIconText}>􀛨</Text>
            </View>
          </View>

          {/* App Content Area */}
          <View style={styles.appViewport}>{children}</View>

          {/* Apple Home Indicator */}
          <View style={styles.homeIndicatorContainer}>
            <View style={styles.homeIndicator} />
          </View>
        </View>
      </View>

      <Text style={styles.hintFooter}>
        🎧 Stereo kulaklık takarak sol ve sağ kulak binaural vuruşlarını dinleyebilirsiniz.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  nativeContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mobileWebContainer: {
    flex: 1,
    backgroundColor: '#000000',
    minHeight: '100vh' as unknown as number,
  },
  outerDesktopWrapper: {
    flex: 1,
    backgroundColor: '#0A0A0C',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh' as unknown as number,
    paddingVertical: 20,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: AppleTheme.colors.textPrimary,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: AppleTheme.colors.textSecondary,
    marginTop: 4,
  },
  phoneChassis: {
    width: 410,
    height: 860,
    backgroundColor: '#1E1E22', // Brushed titanium frame
    borderRadius: 56,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.7,
    shadowRadius: 36,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 48,
    overflow: 'hidden',
    position: 'relative',
  },
  islandContainer: {
    position: 'absolute',
    top: 11,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  dynamicIsland: {
    width: 120,
    height: 34,
    backgroundColor: '#000000',
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  islandCamera: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#080816',
    borderWidth: 1.5,
    borderColor: '#181828',
  },
  islandSensor: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#0d0d12',
  },
  statusBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 8,
    zIndex: 90,
  },
  statusTime: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  appViewport: {
    flex: 1,
    backgroundColor: '#000000',
  },
  homeIndicatorContainer: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 136,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 2.5,
  },
  hintFooter: {
    color: AppleTheme.colors.textSecondary,
    fontSize: 12,
    marginTop: 14,
  },
});