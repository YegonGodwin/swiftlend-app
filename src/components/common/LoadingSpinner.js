import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/theme';
import {
  rotateAnimation,
  pulseAnimation,
  createLoadingDots,
  ANIMATION_DURATIONS
} from '../../utils/animations';

const LoadingSpinner = ({
  size = 40,
  color = COLORS.primary,
  type = 'spinner',
  gradient,
  thickness = 4,
  style,
  ...props
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const dotValues = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  useEffect(() => {
    let animation;

    switch (type) {
      case 'spinner':
        animation = rotateAnimation(spinValue, ANIMATION_DURATIONS.VERY_SLOW);
        break;
      case 'pulse':
        animation = pulseAnimation(pulseValue, 0.8, 1.2);
        break;
      case 'dots':
        animation = createLoadingDots(dotValues, 800);
        break;
      case 'gradient-spinner':
        animation = rotateAnimation(spinValue, ANIMATION_DURATIONS.VERY_SLOW);
        break;
      default:
        animation = rotateAnimation(spinValue, ANIMATION_DURATIONS.VERY_SLOW);
    }

    animation.start();

    return () => {
      animation.stop();
    };
  }, [type]);

  const renderSpinner = () => {
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        style={[
          styles.spinner,
          {
            width: size,
            height: size,
            borderWidth: thickness,
            borderColor: `${color}40`,
            borderTopColor: color,
            borderRadius: size / 2,
            transform: [{ rotate: spin }],
          },
        ]}
      />
    );
  };

  const renderGradientSpinner = () => {
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const gradientColors = gradient || COLORS.gradientPrimary;

    return (
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <View style={styles.gradientSpinnerContainer}>
          <LinearGradient
            colors={gradientColors}
            style={[
              styles.gradientSpinner,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
              },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View
            style={[
              styles.gradientSpinnerInner,
              {
                width: size - thickness * 2,
                height: size - thickness * 2,
                borderRadius: (size - thickness * 2) / 2,
                backgroundColor: COLORS.background,
              },
            ]}
          />
        </View>
      </Animated.View>
    );
  };

  const renderPulse = () => {
    return (
      <Animated.View
        style={[
          styles.pulse,
          {
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: size / 2,
            transform: [{ scale: pulseValue }],
          },
        ]}
      />
    );
  };

  const renderDots = () => {
    const dotSize = size / 6;
    const spacing = size / 8;

    return (
      <View style={[styles.dotsContainer, { width: size }]}>
        {dotValues.map((dotValue, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: dotSize,
                height: dotSize,
                backgroundColor: color,
                borderRadius: dotSize / 2,
                marginHorizontal: spacing / 2,
                transform: [{ scale: dotValue }],
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderWave = () => {
    return (
      <View style={[styles.waveContainer, { width: size, height: size / 2 }]}>
        {[...Array(5)].map((_, index) => {
          const delay = index * 100;
          const waveValue = useRef(new Animated.Value(0)).current;

          useEffect(() => {
            const waveAnimation = Animated.loop(
              Animated.sequence([
                Animated.delay(delay),
                Animated.timing(waveValue, {
                  toValue: 1,
                  duration: 400,
                  useNativeDriver: true,
                }),
                Animated.timing(waveValue, {
                  toValue: 0,
                  duration: 400,
                  useNativeDriver: true,
                }),
              ])
            );
            waveAnimation.start();

            return () => waveAnimation.stop();
          }, []);

          const waveHeight = waveValue.interpolate({
            inputRange: [0, 1],
            outputRange: [size / 8, size / 2],
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.waveLine,
                {
                  width: size / 10,
                  height: waveHeight,
                  backgroundColor: color,
                  marginHorizontal: size / 50,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return renderSpinner();
      case 'gradient-spinner':
        return renderGradientSpinner();
      case 'pulse':
        return renderPulse();
      case 'dots':
        return renderDots();
      case 'wave':
        return renderWave();
      default:
        return renderSpinner();
    }
  };

  return (
    <View style={[styles.container, style]} {...props}>
      {renderLoader()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    // Base spinner styles applied dynamically
  },
  gradientSpinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientSpinner: {
    position: 'absolute',
  },
  gradientSpinnerInner: {
    position: 'absolute',
  },
  pulse: {
    // Pulse styles applied dynamically
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    // Dot styles applied dynamically
  },
  waveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  waveLine: {
    borderRadius: 2,
  },
});

export default LoadingSpinner;
