import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { dspEngine } from '../audio/dspEngine';
import { AppleTheme } from '../theme/colors';

interface AudioVisualizerProps {
  isPlaying: boolean;
  accentColor?: string;
  height?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  accentColor = AppleTheme.colors.accentBlue,
  height = 110,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, width, h);

      if (!isPlaying) {
        // Idle calm baseline with subtle pulse
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.moveTo(0, h / 2);
        ctx.lineTo(width, h / 2);
        ctx.stroke();
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      // Read real or simulated waveform
      const data = dspEngine.getWaveformData();
      phase += 0.04;

      // Draw primary glowing wave
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = accentColor;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 12;

      for (let x = 0; x < width; x++) {
        const dataIndex = Math.floor((x / width) * data.length);
        const rawAmp = (data[dataIndex] - 128) / 128; // -1.0 to 1.0
        const harmonic = Math.sin(x * 0.03 + phase) * 0.4 + Math.cos(x * 0.015 - phase * 0.5) * 0.2;
        const totalAmp = rawAmp * 0.7 + harmonic * 0.3;
        const y = h / 2 + totalAmp * (h * 0.38);

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw secondary subtle harmonic wave
      ctx.beginPath();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.shadowBlur = 0;

      for (let x = 0; x < width; x += 2) {
        const harmonic = Math.sin(x * 0.02 - phase * 1.2) * (h * 0.22);
        const y = h / 2 + harmonic;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, accentColor]);

  return (
    <View style={[styles.container, { height }]}>
      {Platform.OS === 'web' ? (
        <canvas
          ref={canvasRef}
          width={360}
          height={height}
          style={{ width: '100%', height: '100%', borderRadius: 12 }}
        />
      ) : (
        <View style={styles.fallbackContainer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#070709',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackContainer: {
    width: '100%',
    height: 2,
    backgroundColor: AppleTheme.colors.cardBorder,
  },
});