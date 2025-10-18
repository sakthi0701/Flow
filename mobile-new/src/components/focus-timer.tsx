import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { IconSymbol } from '../../components/ui/icon-symbol';
import type { ColorScheme } from '../../types/theme'; // <-- 1. Import ColorScheme

const TIMER_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes in seconds
const CIRCLE_LENGTH = 1024; // SVG circle circumference

export const FocusTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // 2. Cast the theme
  const theme = useTheme();
  const colors: ColorScheme = {
    ...theme.colors,
    tint: theme.colors.primary,
    icon: theme.colors.text,
    tabIconDefault: theme.colors.border,
    tabIconSelected: theme.colors.primary,
    primary: theme.colors.primary,
    subtle: theme.colors.border,
    accent: {
      blue: '#67E8F9',
      mint: '#A7F3D0',
      lavender: '#8E85FF'
    }
  };
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let interval: any;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time === 0) {
            setIsActive(false);
            return TIMER_DURATION;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1 - timeLeft / TIMER_DURATION,
      duration: 1000,
      useNativeDriver: false, // <-- UseNativeDriver must be false for SVG props
    }).start();
  }, [timeLeft, TIMER_DURATION, progress]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCLE_LENGTH, 0],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.closeButton}>
        <IconSymbol name="xmark" size={24} color={colors.text} />
      </TouchableOpacity>
      
      <Text style={[styles.title, { color: colors.text }]}>Focus Mode</Text>

      <View style={styles.timerContainer}>
        <Svg width={300} height={300} viewBox="0 0 400 400" style={styles.svg}>
          <Circle
            cx={200}
            cy={200}
            r={180}
            stroke={colors.border}
            strokeWidth={20}
            fill="none"
          />
          <AnimatedCircle
            cx={200}
            cy={200}
            r={180}
            stroke={colors.primary}
            strokeWidth={20}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCLE_LENGTH}
            strokeDashoffset={strokeDashoffset}
          />
        </Svg>
        
        <View style={styles.timerContent}>
          <Text style={[styles.timeText, { color: colors.text }]}>
            {formatTime(timeLeft)}
          </Text>
          <Text style={[styles.subText, { color: colors.subtle }]}>
            Time to focus
          </Text>
        </View>
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.infoText, { color: colors.text }]}>
          You'll get a <Text style={{ color: colors.primary }}>5 minute</Text> break 
          for every <Text style={{ color: colors.primary }}>25 minutes</Text> of work.
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: colors.card }]}
          onPress={() => setIsPaused(!isPaused)}
        >
          <IconSymbol 
            name={isPaused ? "play.fill" : "pause.fill"} 
            size={32} 
            color={colors.text} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.mainButton, { backgroundColor: colors.primary }]}
          onPress={() => setIsActive(!isActive)}
        >
          <IconSymbol 
            name={isActive ? "stop.fill" : "play.fill"} 
            size={40} 
            color="white" 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: colors.card }]}
          onPress={() => setTimeLeft(TIMER_DURATION)}
        >
          <IconSymbol name="arrow.clockwise" size={32} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 48, // Adjusted for status bar
    left: 16,
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 40,
    marginTop: 48, // Adjusted for status bar
  },
  timerContainer: {
    position: 'relative',
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  },
  timerContent: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    marginTop: 8,
  },
  infoCard: {
    marginTop: 32,
    padding: 16,
    borderRadius: 20,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    gap: 24,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
});