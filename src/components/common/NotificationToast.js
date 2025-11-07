import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../../constants/theme";
import {
  slideInFromTop,
  slideInFromBottom,
  fadeIn,
  fadeOut,
  createShakeAnimation,
  ANIMATION_DURATIONS,
  SPRING_CONFIGS,
} from "../../utils/animations";

const { width } = Dimensions.get("window");

const NotificationToast = ({
  visible = false,
  type = "info",
  title = "",
  message = "",
  duration = 3000,
  position = "top",
  onDismiss,
  action,
  actionText = "Action",
  swipeToDismiss = true,
  animate = true,
  style,
  ...props
}) => {
  const translateY = useRef(
    new Animated.Value(position === "top" ? -100 : 100),
  ).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const shakeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      showToast();

      if (duration > 0) {
        const timer = setTimeout(() => {
          hideToast();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      hideToast();
    }
  }, [visible, duration]);

  const showToast = () => {
    if (!animate) {
      opacity.setValue(1);
      translateY.setValue(0);
      scale.setValue(1);
      return;
    }

    const animations = [
      fadeIn(opacity, ANIMATION_DURATIONS.NORMAL),
      position === "top"
        ? slideInFromTop(translateY, ANIMATION_DURATIONS.NORMAL)
        : slideInFromBottom(translateY, ANIMATION_DURATIONS.NORMAL),
    ];

    if (type === "error") {
      animations.push(
        Animated.spring(scale, {
          toValue: 1,
          ...SPRING_CONFIGS.BOUNCY,
        }),
      );
    } else {
      animations.push(
        Animated.spring(scale, {
          toValue: 1,
          ...SPRING_CONFIGS.GENTLE,
        }),
      );
    }

    Animated.parallel(animations).start(() => {
      if (type === "error") {
        createShakeAnimation(shakeValue, 3).start();
      }
    });
  };

  const hideToast = () => {
    if (!animate) {
      if (onDismiss) onDismiss();
      return;
    }

    const hideAnimations = [
      fadeOut(opacity, ANIMATION_DURATIONS.FAST),
      Animated.timing(translateY, {
        toValue: position === "top" ? -100 : 100,
        duration: ANIMATION_DURATIONS.FAST,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(hideAnimations).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  const getToastConfig = () => {
    const configs = {
      success: {
        icon: "checkmark-circle",
        colors: [COLORS.success, COLORS.success + "CC"],
        backgroundColor: COLORS.success + "20",
        borderColor: COLORS.success,
        textColor: COLORS.success,
      },
      error: {
        icon: "alert-circle",
        colors: [COLORS.error, COLORS.error + "CC"],
        backgroundColor: COLORS.error + "20",
        borderColor: COLORS.error,
        textColor: COLORS.error,
      },
      warning: {
        icon: "warning",
        colors: [COLORS.warning, COLORS.warning + "CC"],
        backgroundColor: COLORS.warning + "20",
        borderColor: COLORS.warning,
        textColor: COLORS.warning,
      },
      info: {
        icon: "information-circle",
        colors: [COLORS.info, COLORS.info + "CC"],
        backgroundColor: COLORS.info + "20",
        borderColor: COLORS.info,
        textColor: COLORS.info,
      },
    };

    return configs[type] || configs.info;
  };

  const config = getToastConfig();

  if (!visible && !animate) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: position === "top" ? 60 : undefined,
          bottom: position === "bottom" ? 60 : undefined,
          opacity: opacity,
          transform: [
            { translateY: translateY },
            { translateX: shakeValue },
            { scale: scale },
          ],
        },
        style,
      ]}
      {...props}
    >
      <View
        style={[
          styles.toast,
          {
            backgroundColor: config.backgroundColor,
            borderLeftColor: config.borderColor,
          },
        ]}
      >
        {/* Icon gradient background */}
        <LinearGradient
          colors={config.colors}
          style={styles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={config.icon} size={24} color={COLORS.white} />
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          {title ? (
            <Text style={[styles.title, { color: config.textColor }]}>
              {title}
            </Text>
          ) : null}
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>

        {/* Action button */}
        {action && actionText && (
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: config.borderColor }]}
            onPress={action}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionText, { color: config.textColor }]}>
              {actionText}
            </Text>
          </TouchableOpacity>
        )}

        {/* Dismiss button */}
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={hideToast}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Progress indicator */}
      {duration > 0 && (
        <Animated.View
          style={[styles.progressBar, { backgroundColor: config.borderColor }]}
        >
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: config.borderColor,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.progressFillInner,
                {
                  backgroundColor: config.borderColor,
                  transform: [
                    {
                      scaleX: opacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0],
                      }),
                    },
                  ],
                },
              ]}
            />
          </Animated.View>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: SPACING.lg,
    right: SPACING.lg,
    zIndex: 9999,
    elevation: 10,
  },
  toast: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "flex-start",
    borderLeftWidth: 4,
    ...SHADOWS.large,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.xs,
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
  },
  actionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  dismissButton: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  progressBar: {
    height: 2,
    backgroundColor: COLORS.border,
    marginTop: SPACING.sm,
    borderRadius: 1,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 1,
  },
  progressFillInner: {
    height: "100%",
    borderRadius: 1,
    width: "100%",
    transformOrigin: "left",
  },
});

export default NotificationToast;
