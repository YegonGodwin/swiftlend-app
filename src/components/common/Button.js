import React, { useRef, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../../constants/theme";
import {
  createButtonPressAnimation,
  createLoadingDots,
  SPRING_CONFIGS,
} from "../../utils/animations";
import { hapticFeedback } from "../../utils/haptics";

const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  gradient,
  style,
  textStyle,
  hapticFeedback = true,
  ...props
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const loadingDots = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  useEffect(() => {
    if (loading) {
      // Start loading animation
      createLoadingDots(loadingDots).start();

      // Pulse animation for loading state
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
        loadingDots.forEach((dot) => dot.stopAnimation());
      };
    }
  }, [loading]);

  const handlePressIn = () => {
    if (!disabled && !loading) {
      createButtonPressAnimation(scaleValue).start();
      if (hapticFeedback) {
        hapticFeedback.buttonPress();
      }
    }
  };

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };
  const getButtonStyle = () => {
    const baseStyle = [styles.button];

    // Size styles
    switch (size) {
      case "small":
        baseStyle.push(styles.small);
        break;
      case "large":
        baseStyle.push(styles.large);
        break;
      default:
        baseStyle.push(styles.medium);
    }

    // Variant styles
    switch (variant) {
      case "secondary":
        baseStyle.push(styles.secondary);
        break;
      case "outline":
        baseStyle.push(styles.outline);
        break;
      case "ghost":
        baseStyle.push(styles.ghost);
        break;
      case "danger":
        baseStyle.push(styles.danger);
        break;
      default:
        baseStyle.push(styles.primary);
    }

    // Full width
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    // Disabled state
    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    }

    // Custom style
    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text];

    // Size text styles
    switch (size) {
      case "small":
        baseTextStyle.push(styles.textSmall);
        break;
      case "large":
        baseTextStyle.push(styles.textLarge);
        break;
      default:
        baseTextStyle.push(styles.textMedium);
    }

    // Variant text styles
    switch (variant) {
      case "secondary":
        baseTextStyle.push(styles.textSecondary);
        break;
      case "outline":
        baseTextStyle.push(styles.textOutline);
        break;
      case "ghost":
        baseTextStyle.push(styles.textGhost);
        break;
      case "danger":
        baseTextStyle.push(styles.textDanger);
        break;
      default:
        baseTextStyle.push(styles.textPrimary);
    }

    // Disabled text
    if (disabled || loading) {
      baseTextStyle.push(styles.textDisabled);
    }

    // Custom text style
    if (textStyle) {
      baseTextStyle.push(textStyle);
    }

    return baseTextStyle;
  };

  const renderLoadingDots = () => {
    const dotColor =
      variant === "outline" || variant === "ghost"
        ? COLORS.primary
        : COLORS.white;

    return (
      <View style={styles.loadingDotsContainer}>
        {loadingDots.map((dot, index) => (
          <Animated.View
            key={index}
            style={[
              styles.loadingDot,
              {
                backgroundColor: dotColor,
                transform: [{ scale: dot }],
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Animated.View
          style={[
            styles.loadingContainer,
            { transform: [{ scale: pulseValue }] },
          ]}
        >
          {renderLoadingDots()}
          {title && (
            <Text style={[getTextStyle(), styles.loadingText]}>{title}</Text>
          )}
        </Animated.View>
      );
    }

    return (
      <View style={[styles.content, icon && styles.contentWithIcon]}>
        {icon && iconPosition === "left" && (
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [
                  {
                    rotate: rotateValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <Ionicons
              name={icon}
              size={size === "small" ? 16 : size === "large" ? 24 : 20}
              color={getIconColor()}
              style={[styles.icon, styles.iconLeft]}
            />
          </Animated.View>
        )}
        {title && <Text style={getTextStyle()}>{title}</Text>}
        {icon && iconPosition === "right" && (
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [
                  {
                    rotate: rotateValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <Ionicons
              name={icon}
              size={size === "small" ? 16 : size === "large" ? 24 : 20}
              color={getIconColor()}
              style={[styles.icon, styles.iconRight]}
            />
          </Animated.View>
        )}
      </View>
    );
  };

  const getIconColor = () => {
    if (disabled || loading) return COLORS.textDisabled;

    switch (variant) {
      case "outline":
      case "ghost":
        return COLORS.primary;
      case "secondary":
        return COLORS.white;
      case "danger":
        return COLORS.white;
      default:
        return COLORS.white;
    }
  };

  const shouldUseGradient = () => {
    return (
      (variant === "primary" || variant === "danger") && !disabled && !loading
    );
  };

  const getGradientColors = () => {
    if (gradient) return gradient;

    switch (variant) {
      case "danger":
        return COLORS.gradientWarning;
      default:
        return COLORS.gradientPrimary;
    }
  };

  if (shouldUseGradient()) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          disabled={disabled || loading}
          activeOpacity={1}
          style={getButtonStyle()}
          {...props}
        >
          <LinearGradient
            colors={getGradientColors()}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {renderContent()}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        disabled={disabled || loading}
        activeOpacity={1}
        style={getButtonStyle()}
        {...props}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  // Size styles
  small: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.lg,
    minHeight: 56,
  },

  // Variant styles
  primary: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  secondary: {
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: COLORS.error,
    ...SHADOWS.medium,
  },

  // State styles
  disabled: {
    opacity: 0.6,
    ...SHADOWS.small,
  },
  fullWidth: {
    width: "100%",
  },

  // Gradient
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  // Content
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contentWithIcon: {
    paddingHorizontal: SPACING.sm,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },

  loadingDotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },

  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  loadingText: {
    marginLeft: SPACING.sm,
  },

  iconContainer: {
    // Container for animated icons
  },

  // Icon
  icon: {
    // Default icon styles
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },

  // Text styles
  text: {
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    textAlign: "center",
  },

  // Size text styles
  textSmall: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  textMedium: {
    fontSize: TYPOGRAPHY.fontSize.lg,
  },
  textLarge: {
    fontSize: TYPOGRAPHY.fontSize.xl,
  },

  // Variant text styles
  textPrimary: {
    color: COLORS.white,
  },
  textSecondary: {
    color: COLORS.textPrimary,
  },
  textOutline: {
    color: COLORS.primary,
  },
  textGhost: {
    color: COLORS.primary,
  },
  textDanger: {
    color: COLORS.white,
  },
  textDisabled: {
    color: COLORS.textDisabled,
  },
});

export default Button;
