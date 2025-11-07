export const COLORS = {
  // Primary Colors
  primary: '#00D9B5',
  primaryDark: '#00A88E',
  primaryLight: '#33E0C4',

  // Secondary Colors
  secondary: '#4158D0',
  secondaryDark: '#3147B8',
  secondaryLight: '#5A69D8',

  // Background Colors
  background: '#151828',
  backgroundLight: '#1E2337',
  backgroundCard: '#2A2F4A',
  backgroundInput: '#2A2F4A',

  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#8F92A1',
  textTertiary: '#5A5F75',
  textDisabled: '#3A3F5C',

  // Status Colors
  success: '#00D9B5',
  warning: '#FFC107',
  error: '#FF5252',
  info: '#4A90E2',

  // Gradient Colors
  gradientPrimary: ['#00D9B5', '#00A88E'],
  gradientSecondary: ['#4158D0', '#C850C0'],
  gradientWarning: ['#FF6B6B', '#FF8E53'],
  gradientInfo: ['#4A90E2', '#357ABD'],
  gradientBackground: ['#151828', '#1E2337', '#151828'],
  gradientCard: ['#2A2F4A', '#3A3F5C'],

  // Border Colors
  border: '#3A3F5C',
  borderLight: '#2A2F4A',
  borderFocus: '#00D9B5',

  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Transparent Colors
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
};

export const TYPOGRAPHY = {
  // Font Sizes
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 36,
    '7xl': 48,
    '8xl': 56,
  },

  // Font Weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
  '8xl': 96,
};

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  base: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  primary: {
    shadowColor: '#00D9B5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const ANIMATIONS = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

export const LAYOUT = {
  // Screen dimensions will be calculated dynamically
  headerHeight: 60,
  tabBarHeight: 60,
  buttonHeight: {
    small: 36,
    medium: 44,
    large: 52,
  },
  inputHeight: 48,
};

export const THEME = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  animations: ANIMATIONS,
  layout: LAYOUT,
};

export default THEME;
