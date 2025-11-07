import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';

const Input = forwardRef(({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  onFocus,
  error,
  helperText,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  editable = true,
  style,
  inputStyle,
  containerStyle,
  labelStyle,
  errorStyle,
  variant = 'default',
  size = 'medium',
  prefix,
  suffix,
  showPasswordToggle = false,
  autoFocus = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

  const handleFocus = (e) => {
    setIsFocused(true);
    animateLabel(1);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (!value) {
      animateLabel(0);
    }
    onBlur?.(e);
  };

  const animateLabel = (toValue) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.container];

    if (containerStyle) {
      baseStyle.push(containerStyle);
    }

    return baseStyle;
  };

  const getInputContainerStyle = () => {
    const baseStyle = [styles.inputContainer];

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.inputContainerSmall);
        break;
      case 'large':
        baseStyle.push(styles.inputContainerLarge);
        break;
      default:
        baseStyle.push(styles.inputContainerMedium);
    }

    // Variant styles
    switch (variant) {
      case 'filled':
        baseStyle.push(styles.inputContainerFilled);
        break;
      case 'outlined':
        baseStyle.push(styles.inputContainerOutlined);
        break;
      default:
        baseStyle.push(styles.inputContainerDefault);
    }

    // Focus state
    if (isFocused) {
      baseStyle.push(styles.inputContainerFocused);
    }

    // Error state
    if (error) {
      baseStyle.push(styles.inputContainerError);
    }

    // Disabled state
    if (!editable) {
      baseStyle.push(styles.inputContainerDisabled);
    }

    return baseStyle;
  };

  const getInputStyle = () => {
    const baseStyle = [styles.input];

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.inputSmall);
        break;
      case 'large':
        baseStyle.push(styles.inputLarge);
        break;
      default:
        baseStyle.push(styles.inputMedium);
    }

    // Multiline adjustment
    if (multiline) {
      baseStyle.push(styles.inputMultiline);
    }

    // Custom style
    if (inputStyle) {
      baseStyle.push(inputStyle);
    }

    return baseStyle;
  };

  const getLabelStyle = () => {
    const baseStyle = [styles.label];

    if (variant === 'floating' && (isFocused || value)) {
      baseStyle.push(styles.labelFloating);
    }

    if (error) {
      baseStyle.push(styles.labelError);
    }

    if (labelStyle) {
      baseStyle.push(labelStyle);
    }

    return baseStyle;
  };

  const renderFloatingLabel = () => {
    if (variant !== 'floating' || !label) return null;

    const labelTranslateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -25],
    });

    const labelScale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.8],
    });

    return (
      <Animated.Text
        style={[
          styles.floatingLabel,
          {
            transform: [
              { translateY: labelTranslateY },
              { scale: labelScale },
            ],
          },
          isFocused && styles.floatingLabelFocused,
          error && styles.floatingLabelError,
        ]}
      >
        {label}
      </Animated.Text>
    );
  };

  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    return (
      <View style={styles.iconContainer}>
        <Ionicons
          name={leftIcon}
          size={20}
          color={isFocused ? COLORS.primary : COLORS.textSecondary}
        />
      </View>
    );
  };

  const renderRightIcon = () => {
    if (showPasswordToggle && secureTextEntry) {
      return (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.iconContainer}
        >
          <Ionicons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }

    if (!rightIcon) return null;

    return (
      <View style={styles.iconContainer}>
        <Ionicons
          name={rightIcon}
          size={20}
          color={isFocused ? COLORS.primary : COLORS.textSecondary}
        />
      </View>
    );
  };

  const renderPrefix = () => {
    if (!prefix) return null;

    return (
      <View style={styles.affixContainer}>
        <Text style={styles.affixText}>{prefix}</Text>
      </View>
    );
  };

  const renderSuffix = () => {
    if (!suffix) return null;

    return (
      <View style={styles.affixContainer}>
        <Text style={styles.affixText}>{suffix}</Text>
      </View>
    );
  };

  return (
    <View style={getContainerStyle()}>
      {/* Static Label */}
      {label && variant !== 'floating' && (
        <Text style={getLabelStyle()}>{label}</Text>
      )}

      {/* Input Container */}
      <View style={getInputContainerStyle()}>
        {renderFloatingLabel()}
        {renderLeftIcon()}
        {renderPrefix()}

        <TextInput
          ref={ref}
          style={getInputStyle()}
          placeholder={variant === 'floating' ? '' : placeholder}
          placeholderTextColor={COLORS.textTertiary}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={editable}
          autoFocus={autoFocus}
          selectionColor={COLORS.primary}
          {...props}
        />

        {renderSuffix()}
        {renderRightIcon()}
      </View>

      {/* Helper Text or Error */}
      {(helperText || error) && (
        <View style={styles.helperContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={COLORS.error} />
              <Text style={[styles.helperText, styles.errorText, errorStyle]}>
                {error}
              </Text>
            </View>
          ) : (
            <Text style={styles.helperText}>{helperText}</Text>
          )}
        </View>
      )}

      {/* Character Count */}
      {maxLength && (
        <View style={styles.characterCount}>
          <Text style={styles.characterCountText}>
            {value?.length || 0}/{maxLength}
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },

  // Labels
  label: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  labelError: {
    color: COLORS.error,
  },

  floatingLabel: {
    position: 'absolute',
    left: SPACING.md,
    top: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xs,
    zIndex: 1,
  },

  floatingLabelFocused: {
    color: COLORS.primary,
  },

  floatingLabelError: {
    color: COLORS.error,
  },

  // Input Container
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
    position: 'relative',
  },

  inputContainerDefault: {
    backgroundColor: COLORS.backgroundInput,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  inputContainerFilled: {
    backgroundColor: COLORS.backgroundCard,
  },

  inputContainerOutlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.border,
  },

  inputContainerSmall: {
    minHeight: 36,
    paddingHorizontal: SPACING.sm,
  },

  inputContainerMedium: {
    minHeight: 48,
    paddingHorizontal: SPACING.md,
  },

  inputContainerLarge: {
    minHeight: 56,
    paddingHorizontal: SPACING.lg,
  },

  inputContainerFocused: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },

  inputContainerError: {
    borderColor: COLORS.error,
  },

  inputContainerDisabled: {
    opacity: 0.6,
    backgroundColor: COLORS.backgroundLight,
  },

  // Input
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.sm,
  },

  inputSmall: {
    fontSize: TYPOGRAPHY.fontSize.base,
  },

  inputMedium: {
    fontSize: TYPOGRAPHY.fontSize.lg,
  },

  inputLarge: {
    fontSize: TYPOGRAPHY.fontSize.xl,
  },

  inputMultiline: {
    textAlignVertical: 'top',
    minHeight: 80,
    paddingTop: SPACING.md,
  },

  // Icons and Affixes
  iconContainer: {
    padding: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },

  affixContainer: {
    paddingHorizontal: SPACING.xs,
    justifyContent: 'center',
  },

  affixText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },

  // Helper Text
  helperContainer: {
    marginTop: SPACING.xs,
  },

  helperText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  errorText: {
    color: COLORS.error,
    marginLeft: SPACING.xs,
    flex: 1,
  },

  // Character Count
  characterCount: {
    alignItems: 'flex-end',
    marginTop: SPACING.xs,
  },

  characterCountText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
  },
});

Input.displayName = 'Input';

export default Input;
