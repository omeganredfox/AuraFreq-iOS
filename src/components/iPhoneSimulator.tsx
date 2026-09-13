import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, Animated, Easing } from 'react-native';
import { AppleTheme } from '../theme/colors';

interface SimulatorProps {
  children: React.ReactNode;
  isPlaying?: boolean;
  accentColor?: string;
}

export const IPhoneSimulator: React.FC<SimulatorProps> = ({
  children,
  isPlaying = false,
  accentColor = AppleTheme.colors.accentPurple,
}) => {
  // Dynamic Island animation values
  const islandWidth = useRef(new Animated.Value(120)).current;
  const islandHeight = useRef(new Animated.Value(34)).current;
  const islandOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPlaying) {
      // Expand island when playing
      Animated.parallel([
        Animated.spring(islandWidth, {
          toValue: 200,
          friction: 8,
          tension: 60,
          useNativeDriver: false,
        }),
        Animated.spring(islandHeight, {
          toValue: 44,
          friction: 8,
          tension: 60,
          useNativeDriver: false,
        }),
        Animated.timing(islandOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();

      // Pulse glow loop
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      );
      pulse.start();

      return () => pulse.stop();
    } else {
      // Collapse island
      Animated.parallel([
        Animated.spring(islandWidth, {
          toValue: 120,
          friction: 8,
          tension: 60,
          useNativeDriver: false,
        }),
        Animated.spring(islandHeight, {
          toValue: 34,
          friction: 8,
          tension: 60,
          useNativeDriver: false,
        }),
        Animated.timing(islandOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isPlaying]);

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

  const glowColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 0, 0, 1)', accentColor + '40'],
  });

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
          {/* Dynamic Island — Animated */}
          <View style={styles.islandContainer}>
            <Animated.View
              style={[
                styles.dynamicIsland,
                {
                  width: islandWidth,
                  height: islandHeight,
                  backgroundColor: glowColor,
                },
              ]}
            >
              <View style={styles.islandCamera} />
              {/* Mini player info when playing */}
              <Animated.View style={[styles.islandMiniPlayer, { opacity: islandOpacity }]}>
                <Text style={styles.islandMiniIcon}>🎵</Text>
                <View style={styles.islandMiniPulseRow}>
                  {[0, 1, 2, 3, 4].map((i) => {
                    const barHeight = pulseAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [4, 8 + i * 2],
                    });
                    return (
                      <Animated.View
                        key={i}
                        style={[
                          styles.islandMiniBar,
                          {
                            height: barHeight,
                            backgroundColor: accentColor,
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              </Animated.View>
              <View style={styles.islandSensor} />
            </Animated.View>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0A0E',
    minHeight: '100vh' as unknown as number,
    padding: 20,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  brandSubtitle: {
    color: AppleTheme.colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },
  phoneChassis: {
    width: 393 + 12,
    height: 852 + 12,
    backgroundColor: AppleTheme.colors.titaniumBezel,
    borderRadius: 55 + 4,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 30,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 55,
    overflow: 'hidden',
  },
  islandContainer: {
    alignItems: 'center',
    paddingTop: 10,
    height: 44,
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  dynamicIsland: {
    width: 120,
    height: 34,
    backgroundColor: '#000000',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    overflow: 'hidden',
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
  islandMiniPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  islandMiniIcon: {
    fontSize: 12,
  },
  islandMiniPulseRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 16,
  },
  islandMiniBar: {
    width: 3,
    borderRadius: 1.5,
    minHeight: 4,
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