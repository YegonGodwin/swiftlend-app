import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, BORDER_RADIUS, SPACING } from "../../constants/theme";
import {
  createProgressAnimation,
  ANIMATION_DURATIONS,
} from "../../utils/animations";

const ProgressBar = ({
  progress = 0,
  height = 8,
  backgroundColor = COLORS.backgroundLight,
  progressColor = COLORS.primary,
  gradient,
  animated = true,
  duration = ANIMATION_DURATIONS.SLOW,
  borderRadius = BORDER_RADIUS.base,
  style,
  showGlow = false,
  glowColor = COLORS.primary,
  ...props
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      const animation = createProgressAnimation(
        animatedProgress,
        progress,
        duration,
      );
      animation.start();

      if (showGlow && progress > 0) {
        const glowAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(glowOpacity, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(glowOpacity, {
              toValue: 0.3,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        );
        glowAnimation.start();

        return () => {
          glowAnimation.stop();
        };
      }
    } else {
      animatedProgress.setValue(progress);
    }
  }, [progress, animated, duration, showGlow]);

  const progressWidth = animated
    ? animatedProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
        extrapolate: "clamp",
      })
    : `${Math.max(0, Math.min(100, progress * 100))}%`;

  const renderProgressFill = () => {
    if (gradient) {
      return (
        <LinearGradient
          colors={gradient}
          style={[
            styles.progressFill,
            {
              height,
              borderRadius,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      );
    }

    return (
      <View
        style={[
          styles.progressFill,
          {
            backgroundColor: progressColor,
            height,
            borderRadius,
          },
        ]}
      />
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor,
          borderRadius,
        },
        style,
      ]}
      {...props}
    >
      <Animated.View
        style={[
          styles.progressContainer,
          {
            width: progressWidth,
            height,
            borderRadius,
          },
          showGlow && {
            shadowColor: glowColor,
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 4,
            elevation: 4,
          },
        ]}
      >
        {showGlow ? (
          <Animated.View style={{ opacity: glowOpacity }}>
            {renderProgressFill()}
          </Animated.View>
        ) : (
          renderProgressFill()
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
  },
  progressContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    overflow: "hidden",
  },
  progressFill: {
    flex: 1,
  },
});

export default ProgressBar;
