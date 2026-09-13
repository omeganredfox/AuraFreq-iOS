import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { AppleTheme } from '../theme/colors';

interface RotaryDialProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  label?: string;
  accentColor?: string;
  size?: number;
  onValueChange: (value: number) => void;
}

/**
 * Apple-style Dairesel Haptik Frekans Kadranı (Rotary Dial)
 * Parmakla (veya fareyle) dairesel çevirerek frekansı hassas ayarlama.
 */
export const RotaryDial: React.FC<RotaryDialProps> = ({
  value,
  min,
  max,
  step = 1,
  unit = 'Hz',
  label = 'Frekans',
  accentColor = AppleTheme.colors.accentBlue,
  size = 200,
  onValueChange,
}) => {
  const containerRef = useRef<View>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastAngleRef = useRef<number | null>(null);

  const normalizedValue = (value - min) / (max - min);
  const sweepAngle = normalizedValue * 300; // 300 degrees of travel
  const startAngle = -240; // Starting angle (7 o'clock position)

  const calculateAngle = (gestureX: number, gestureY: number, layoutX: number, layoutY: number): number => {
    const centerX = layoutX + size / 2;
    const centerY = layoutY + size / 2;
    const dx = gestureX - centerX;
    const dy = gestureY - centerY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_evt: GestureResponderEvent, _gestureState: PanResponderGestureState) => {
        setIsDragging(true);
        lastAngleRef.current = null;
      },
      onPanResponderMove: (evt: GestureResponderEvent, _gestureState: PanResponderGestureState) => {
        if (!containerRef.current) return;

        containerRef.current.measureInWindow((layoutX: number, layoutY: number) => {
          const currentAngle = calculateAngle(
            evt.nativeEvent.pageX,
            evt.nativeEvent.pageY,
            layoutX,
            layoutY
          );

          if (lastAngleRef.current !== null) {
            let angleDelta = currentAngle - lastAngleRef.current;

            // Handle angle wrapping
            if (angleDelta > 180) angleDelta -= 360;
            if (angleDelta < -180) angleDelta += 360;

            const sensitivity = (max - min) / 300; // Map 300 degrees to full range
            const valueDelta = angleDelta * sensitivity;
            const newValue = Math.max(min, Math.min(max, value + valueDelta));
            const snapped = Math.round(newValue / step) * step;
            const clamped = Number(Math.max(min, Math.min(max, snapped)).toFixed(1));

            if (clamped !== value) {
              onValueChange(clamped);
            }
          }

          lastAngleRef.current = currentAngle;
        });
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        lastAngleRef.current = null;
      },
    })
  ).current;

  // Generate tick marks
  const ticks: { angle: number; isMajor: boolean }[] = [];
  const tickCount = 30;
  for (let i = 0; i <= tickCount; i++) {
    ticks.push({
      angle: startAngle + (i / tickCount) * 300,
      isMajor: i % 5 === 0,
    });
  }

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        ref={containerRef}
        style={[
          styles.dialContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: isDragging ? accentColor : 'rgba(255, 255, 255, 0.1)',
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Background ring */}
        {Platform.OS === 'web' && (
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ position: 'absolute' }}
          >
            {/* Track ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 16}
              fill="none"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="3"
            />
            {/* Active arc */}
            {(() => {
              const r = size / 2 - 16;
              const startRad = ((startAngle - 90) * Math.PI) / 180;
              const endRad = ((startAngle + sweepAngle - 90) * Math.PI) / 180;
              const x1 = size / 2 + r * Math.cos(startRad);
              const y1 = size / 2 + r * Math.sin(startRad);
              const x2 = size / 2 + r * Math.cos(endRad);
              const y2 = size / 2 + r * Math.sin(endRad);
              const largeArc = sweepAngle > 180 ? 1 : 0;
              return (
                <path
                  d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity={0.8}
                />
              );
            })()}
            {/* Tick marks */}
            {ticks.map((tick, i) => {
              const r1 = size / 2 - (tick.isMajor ? 8 : 10);
              const r2 = size / 2 - 4;
              const rad = ((tick.angle - 90) * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={size / 2 + r1 * Math.cos(rad)}
                  y1={size / 2 + r1 * Math.sin(rad)}
                  x2={size / 2 + r2 * Math.cos(rad)}
                  y2={size / 2 + r2 * Math.sin(rad)}
                  stroke={
                    ((tick.angle - startAngle) / 300) <= normalizedValue
                      ? accentColor
                      : 'rgba(255, 255, 255, 0.15)'
                  }
                  strokeWidth={tick.isMajor ? 2 : 1}
                  strokeLinecap="round"
                />
              );
            })}
            {/* Knob indicator dot */}
            {(() => {
              const r = size / 2 - 24;
              const rad = ((startAngle + sweepAngle - 90) * Math.PI) / 180;
              const kx = size / 2 + r * Math.cos(rad);
              const ky = size / 2 + r * Math.sin(rad);
              return (
                <>
                  <circle cx={kx} cy={ky} r={6} fill={accentColor} />
                  <circle cx={kx} cy={ky} r={3} fill="#FFFFFF" opacity={0.9} />
                </>
              );
            })()}
          </svg>
        )}

        {/* Center display */}
        <View style={styles.centerDisplay}>
          <Text style={[styles.valueText, isDragging && { color: accentColor }]}>
            {value}
          </Text>
          <Text style={[styles.unitText, { color: accentColor }]}>{unit}</Text>
        </View>
      </View>
      {isDragging && (
        <Text style={[styles.hint, { color: accentColor }]}>Çevirerek ayarla</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: AppleTheme.colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  dialContainer: {
    backgroundColor: '#0A0A0E',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  centerDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 36,
    fontWeight: '700',
    color: AppleTheme.colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  unitText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  hint: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
});