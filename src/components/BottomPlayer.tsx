import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppleTheme } from '../theme/colors';

interface BottomPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  title: string;
  subtitle: string;
  onTimerPress?: () => void;
  timerActive?: boolean;
}

export const BottomPlayer: React.FC<BottomPlayerProps> = ({
  isPlaying,
  onTogglePlay,
  title,
  subtitle,
  onTimerPress,
  timerActive,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.iconBox}>
          <Feather name="activity" size={20} color={AppleTheme.colors.textPrimary} />
        </View>
        <View style={styles.textStack}>
          <Text style={styles.statusText}>{isPlaying ? 'Playing' : 'Paused'}</Text>
          <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitleText} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
      </View>
      
      <View style={styles.rightContent}>
        <TouchableOpacity style={[styles.timerBtn, timerActive && styles.timerBtnActive]} onPress={onTimerPress}>
          <Feather name="clock" size={20} color={timerActive ? AppleTheme.colors.accentGreen : AppleTheme.colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playBtn} onPress={onTogglePlay}>
          <Feather name={isPlaying ? "pause" : "play"} size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 72,
    backgroundColor: '#1C1C1E',
    borderRadius: 36,
    marginHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: AppleTheme.colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AppleTheme.colors.cardBorder,
  },
  textStack: {
    marginLeft: 12,
    flex: 1,
  },
  statusText: {
    color: AppleTheme.colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  titleText: {
    color: AppleTheme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  subtitleText: {
    color: AppleTheme.colors.textTertiary,
    fontSize: 11,
    marginTop: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerBtnActive: {
    backgroundColor: 'rgba(48, 209, 88, 0.1)',
  },
  playBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  }
});