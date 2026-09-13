import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { AppleTheme } from '../theme/colors';

interface LissajousVisualizerProps {
  isPlaying: boolean;
  leftFreq: number;
  rightFreq: number;
  accentColor?: string;
  size?: number;
}

/**
 * Lissajous Rezonans Görselleştiricisi
 * Sol (x) ve Sağ (y) kulak frekanslarının faz farkını
 * 2D parametrik eğri olarak çizer.
 * x(t) = A * sin(a*t + δ)
 * y(t) = B * sin(b*t)
 * burada a = leftFreq, b = rightFreq
 */
export const LissajousVisualizer: React.FC<LissajousVisualizerProps> = ({
  isPlaying,
  leftFreq,
  rightFreq,
  accentColor = AppleTheme.colors.accentPurple,
  size = 180,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    if (Platform.OS !== 'web' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = (Math.min(w, h) / 2) - 12;

    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, w, h);

      if (!isPlaying) {
        // Idle: soft crosshair
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy - radius);
        ctx.lineTo(cx, cy + radius);
        ctx.moveTo(cx - radius, cy);
        ctx.lineTo(cx + radius, cy);
        ctx.stroke();

        // Idle dot
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fill();

        animationRef.current = requestAnimationFrame(render);
        return;
      }

      phaseRef.current += 0.018;
      const delta = phaseRef.current;

      // Frequency ratio determines the Lissajous pattern
      const a = leftFreq || 1;
      const b = rightFreq || 1;

      // Draw the Lissajous curve
      ctx.beginPath();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 8;

      const steps = 600;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const x = cx + Math.sin(a * t + delta) * radius * 0.85;
        const y = cy + Math.sin(b * t) * radius * 0.85;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Leading dot (current phase position)
      const dotT = delta % (Math.PI * 2);
      const dotX = cx + Math.sin(a * dotT + delta) * radius * 0.85;
      const dotY = cy + Math.sin(b * dotT) * radius * 0.85;

      ctx.beginPath();
      ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Subtle axis labels
      ctx.font = '9px system-ui';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.textAlign = 'center';
      ctx.fillText('L', cx, cy - radius - 4);
      ctx.fillText('R', cx + radius + 8, cy + 3);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, leftFreq, rightFreq, accentColor, size]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {Platform.OS === 'web' ? (
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          style={{ width: '100%', height: '100%', borderRadius: size / 2 }}
        />
      ) : (
        <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#050508',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignSelf: 'center',
  },
  fallback: {
    backgroundColor: '#0A0A0E',
  },
});