import React, { useRef, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/theme";
import {
  createEntranceAnimation,
  createButtonPressAnimation,
  fadeIn,
  scaleIn,
  slideInFromBottom,
  SPRING_CONFIGS,
} from "../../utils/animations";

const Card = ({
  children,
  style,
  onPress,
  disabled = false,
  variant = "default",
  gradient,
  padding = "medium",
  shadow = true,
  borderRadius = "large",
  animateOnMount = false,
  animationDelay = 0,
  animationType = "fadeIn",
  ...props
}) => {
  const fadeValue = useRef(new Animated.Value(animateOnMount ? 0 : 1)).current;
  const scaleValue = useRef(
    new Animated.Value(animateOnMount ? 0.9 : 1),
  ).current;
  const translateValue = useRef(
    new Animated.Value(animateOnMount ? 20 : 0),
  ).current;
  const pressScaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animateOnMount) {
      const animations = {
        fadeIn: () => fadeIn(fadeValue, 300, animationDelay),
        scaleIn: () => scaleIn(scaleValue, 300),
        slideUp: () => slideInFromBottom(translateValue, 300),
        entrance: () =>
          createEntranceAnimation(
            fadeValue,
            scaleValue,
            translateValue,
            animationDelay,
          ),
      };

      const animation = animations[animationType] || animations.fadeIn;
      animation().start();
    }
  }, [animateOnMount, animationDelay, animationType]);

  const handlePressIn = () => {
    if (onPress && !disabled) {
      createButtonPressAnimation(pressScaleValue).start();
    }
  };

  const handlePress = () => {
    if (onPress && !disabled) {
      onPress();
    }
  };
  const getCardStyle = () => {
    const baseStyle = [styles.card];

    // Padding styles
    switch (padding) {
      case "none":
        baseStyle.push(styles.paddingNone);
        break;
      case "small":
        baseStyle.push(styles.paddingSmall);
        break;
      case "large":
        baseStyle.push(styles.paddingLarge);
        break;
      default:
        baseStyle.push(styles.paddingMedium);
    }

    // Border radius styles
    switch (borderRadius) {
      case "none":
        baseStyle.push(styles.borderRadiusNone);
        break;
      case "small":
        baseStyle.push(styles.borderRadiusSmall);
        break;
      case "medium":
        baseStyle.push(styles.borderRadiusMedium);
        break;
      case "extra":
        baseStyle.push(styles.borderRadiusExtra);
        break;
      default:
        baseStyle.push(styles.borderRadiusLarge);
    }

    // Variant styles
    switch (variant) {
      case "elevated":
        baseStyle.push(styles.elevated);
        break;
      case "outlined":
        baseStyle.push(styles.outlined);
        break;
      case "flat":
        baseStyle.push(styles.flat);
        break;
      case "transparent":
        baseStyle.push(styles.transparent);
        break;
      default:
        baseStyle.push(styles.default);
    }

    // Shadow
    if (shadow && variant !== "flat" && variant !== "transparent") {
      baseStyle.push(styles.shadow);
    }

    // Disabled state
    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    // Pressable state
    if (onPress && !disabled) {
      baseStyle.push(styles.pressable);
    }

    // Custom style
    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const renderContent = () => {
    if (gradient && !disabled) {
      return (
        <LinearGradient
          colors={gradient}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {children}
        </LinearGradient>
      );
    }

    return children;
  };

  const CardComponent = onPress && !disabled ? TouchableOpacity : Animated.View;

  return (
    <Animated.View
      style={[
        {
          opacity: fadeValue,
          transform: [
            { scale: animateOnMount ? scaleValue : 1 },
            { translateY: translateValue },
          ],
        },
      ]}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale: pressScaleValue }],
          },
        ]}
      >
        <CardComponent
          onPress={onPress && !disabled ? handlePress : undefined}
          onPressIn={onPress && !disabled ? handlePressIn : undefined}
          style={getCardStyle()}
          activeOpacity={onPress ? 1 : undefined}
          {...props}
        >
          {renderContent()}
        </CardComponent>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },

  // Padding styles
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: SPACING.sm,
  },
  paddingMedium: {
    padding: SPACING.lg,
  },
  paddingLarge: {
    padding: SPACING["2xl"],
  },

  // Border radius styles
  borderRadiusNone: {
    borderRadius: 0,
  },
  borderRadiusSmall: {
    borderRadius: BORDER_RADIUS.sm,
  },
  borderRadiusMedium: {
    borderRadius: BORDER_RADIUS.lg,
  },
  borderRadiusLarge: {
    borderRadius: BORDER_RADIUS.xl,
  },
  borderRadiusExtra: {
    borderRadius: BORDER_RADIUS["2xl"],
  },

  // Variant styles
  default: {
    backgroundColor: COLORS.backgroundCard,
  },
  elevated: {
    backgroundColor: COLORS.backgroundCard,
    elevation: 4,
  },
  outlined: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  flat: {
    backgroundColor: COLORS.backgroundCard,
    elevation: 0,
  },
  transparent: {
    backgroundColor: "transparent",
  },

  // Shadow
  shadow: {
    ...SHADOWS.medium,
  },

  // States
  disabled: {
    opacity: 0.6,
  },
  pressable: {
    // Add any pressable specific styles here
  },

  // Gradient
  gradient: {
    flex: 1,
    padding: SPACING.lg,
  },
});

export default Card;
