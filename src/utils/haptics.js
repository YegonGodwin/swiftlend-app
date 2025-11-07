import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Haptic feedback types and intensities
export const HAPTIC_TYPES = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  SELECTION: 'selection',
  IMPACT: 'impact',
};

// Haptic patterns for different interactions
export const HAPTIC_PATTERNS = {
  BUTTON_PRESS: 'light',
  TOGGLE_ON: 'success',
  TOGGLE_OFF: 'light',
  FORM_SUBMIT: 'medium',
  ERROR_SHAKE: 'error',
  SUCCESS_NOTIFICATION: 'success',
  NAVIGATION: 'selection',
  SCROLL_EDGE: 'light',
  REFRESH_START: 'light',
  REFRESH_COMPLETE: 'success',
  CARD_SWIPE: 'light',
  LONG_PRESS: 'medium',
  DELETE_ACTION: 'warning',
  PAYMENT_SUCCESS: 'success',
  LOAN_APPROVED: 'success',
  CREDIT_SCORE_UPDATE: 'medium',
};

// Check if haptics are available
export const isHapticsAvailable = () => {
  return Platform.OS === 'ios' || Platform.OS === 'android';
};

// Basic haptic feedback functions
export const lightHaptic = () => {
  if (!isHapticsAvailable()) return;

  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
};

export const mediumHaptic = () => {
  if (!isHapticsAvailable()) return;

  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
};

export const heavyHaptic = () => {
  if (!isHapticsAvailable()) return;

  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
};

export const successHaptic = () => {
  if (!isHapticsAvailable()) return;

  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
};

export const warningHaptic = () => {
  if (!isHapticsAvailable()) return;

  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
};

export const errorHaptic = () => {
  if (!isHapticsAvailable()) return;

  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
};

export const selectionHaptic = () => {
  if (!isHapticsAvailable()) return;

  try {
    Haptics.selectionAsync();
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
};

// Generic haptic function
export const triggerHaptic = (type = HAPTIC_TYPES.LIGHT) => {
  if (!isHapticsAvailable()) return;

  const hapticMap = {
    [HAPTIC_TYPES.LIGHT]: lightHaptic,
    [HAPTIC_TYPES.MEDIUM]: mediumHaptic,
    [HAPTIC_TYPES.HEAVY]: heavyHaptic,
    [HAPTIC_TYPES.SUCCESS]: successHaptic,
    [HAPTIC_TYPES.WARNING]: warningHaptic,
    [HAPTIC_TYPES.ERROR]: errorHaptic,
    [HAPTIC_TYPES.SELECTION]: selectionHaptic,
    [HAPTIC_TYPES.IMPACT]: mediumHaptic, // Default to medium for impact
  };

  const hapticFunction = hapticMap[type] || lightHaptic;
  hapticFunction();
};

// Interaction-specific haptic functions
export const buttonPressHaptic = () => triggerHaptic(HAPTIC_PATTERNS.BUTTON_PRESS);
export const toggleOnHaptic = () => triggerHaptic(HAPTIC_PATTERNS.TOGGLE_ON);
export const toggleOffHaptic = () => triggerHaptic(HAPTIC_PATTERNS.TOGGLE_OFF);
export const formSubmitHaptic = () => triggerHaptic(HAPTIC_PATTERNS.FORM_SUBMIT);
export const errorShakeHaptic = () => triggerHaptic(HAPTIC_PATTERNS.ERROR_SHAKE);
export const successNotificationHaptic = () => triggerHaptic(HAPTIC_PATTERNS.SUCCESS_NOTIFICATION);
export const navigationHaptic = () => triggerHaptic(HAPTIC_PATTERNS.NAVIGATION);
export const scrollEdgeHaptic = () => triggerHaptic(HAPTIC_PATTERNS.SCROLL_EDGE);
export const refreshStartHaptic = () => triggerHaptic(HAPTIC_PATTERNS.REFRESH_START);
export const refreshCompleteHaptic = () => triggerHaptic(HAPTIC_PATTERNS.REFRESH_COMPLETE);
export const cardSwipeHaptic = () => triggerHaptic(HAPTIC_PATTERNS.CARD_SWIPE);
export const longPressHaptic = () => triggerHaptic(HAPTIC_PATTERNS.LONG_PRESS);
export const deleteActionHaptic = () => triggerHaptic(HAPTIC_PATTERNS.DELETE_ACTION);
export const paymentSuccessHaptic = () => triggerHaptic(HAPTIC_PATTERNS.PAYMENT_SUCCESS);
export const loanApprovedHaptic = () => triggerHaptic(HAPTIC_PATTERNS.LOAN_APPROVED);
export const creditScoreUpdateHaptic = () => triggerHaptic(HAPTIC_PATTERNS.CREDIT_SCORE_UPDATE);

// Complex haptic patterns
export const doubleHaptic = (type = HAPTIC_TYPES.LIGHT, delay = 100) => {
  triggerHaptic(type);
  setTimeout(() => triggerHaptic(type), delay);
};

export const tripleHaptic = (type = HAPTIC_TYPES.LIGHT, delay = 100) => {
  triggerHaptic(type);
  setTimeout(() => triggerHaptic(type), delay);
  setTimeout(() => triggerHaptic(type), delay * 2);
};

export const crescendoHaptic = () => {
  lightHaptic();
  setTimeout(() => mediumHaptic(), 100);
  setTimeout(() => heavyHaptic(), 200);
};

export const diminuendoHaptic = () => {
  heavyHaptic();
  setTimeout(() => mediumHaptic(), 100);
  setTimeout(() => lightHaptic(), 200);
};

// Rhythm patterns
export const heartbeatHaptic = () => {
  lightHaptic();
  setTimeout(() => mediumHaptic(), 150);
  setTimeout(() => lightHaptic(), 300);
  setTimeout(() => mediumHaptic(), 450);
};

export const knockHaptic = () => {
  mediumHaptic();
  setTimeout(() => mediumHaptic(), 100);
  setTimeout(() => heavyHaptic(), 200);
};

export const alertHaptic = () => {
  errorHaptic();
  setTimeout(() => errorHaptic(), 300);
  setTimeout(() => errorHaptic(), 600);
};

// Financial app specific haptics
export const moneyTransferHaptic = () => {
  lightHaptic();
  setTimeout(() => successHaptic(), 200);
};

export const creditScoreImproveHaptic = () => {
  crescendoHaptic();
  setTimeout(() => successHaptic(), 400);
};

export const creditScoreDeclineHaptic = () => {
  diminuendoHaptic();
  setTimeout(() => warningHaptic(), 300);
};

export const loanApplicationHaptic = () => {
  mediumHaptic();
  setTimeout(() => lightHaptic(), 150);
  setTimeout(() => successHaptic(), 300);
};

export const paymentReminderHaptic = () => {
  doubleHaptic(HAPTIC_TYPES.WARNING, 200);
};

export const achievementUnlockedHaptic = () => {
  successHaptic();
  setTimeout(() => mediumHaptic(), 100);
  setTimeout(() => successHaptic(), 200);
  setTimeout(() => lightHaptic(), 300);
};

// Utility functions
export const createHapticSequence = (pattern = []) => {
  pattern.forEach((item, index) => {
    setTimeout(() => {
      triggerHaptic(item.type || HAPTIC_TYPES.LIGHT);
    }, item.delay || index * 100);
  });
};

export const randomHaptic = () => {
  const types = Object.values(HAPTIC_TYPES);
  const randomType = types[Math.floor(Math.random() * types.length)];
  triggerHaptic(randomType);
};

// Settings management
let hapticsEnabled = true;

export const setHapticsEnabled = (enabled) => {
  hapticsEnabled = enabled;
};

export const getHapticsEnabled = () => {
  return hapticsEnabled && isHapticsAvailable();
};

// Enhanced trigger function that respects settings
export const triggerHapticIfEnabled = (type) => {
  if (getHapticsEnabled()) {
    triggerHaptic(type);
  }
};

// Export all haptic functions with settings check
export const hapticFeedback = {
  light: () => getHapticsEnabled() && lightHaptic(),
  medium: () => getHapticsEnabled() && mediumHaptic(),
  heavy: () => getHapticsEnabled() && heavyHaptic(),
  success: () => getHapticsEnabled() && successHaptic(),
  warning: () => getHapticsEnabled() && warningHaptic(),
  error: () => getHapticsEnabled() && errorHaptic(),
  selection: () => getHapticsEnabled() && selectionHaptic(),

  // Interaction patterns
  buttonPress: () => getHapticsEnabled() && buttonPressHaptic(),
  toggleOn: () => getHapticsEnabled() && toggleOnHaptic(),
  toggleOff: () => getHapticsEnabled() && toggleOffHaptic(),
  formSubmit: () => getHapticsEnabled() && formSubmitHaptic(),
  errorShake: () => getHapticsEnabled() && errorShakeHaptic(),
  successNotification: () => getHapticsEnabled() && successNotificationHaptic(),
  navigation: () => getHapticsEnabled() && navigationHaptic(),
  scrollEdge: () => getHapticsEnabled() && scrollEdgeHaptic(),
  refreshStart: () => getHapticsEnabled() && refreshStartHaptic(),
  refreshComplete: () => getHapticsEnabled() && refreshCompleteHaptic(),
  cardSwipe: () => getHapticsEnabled() && cardSwipeHaptic(),
  longPress: () => getHapticsEnabled() && longPressHaptic(),
  deleteAction: () => getHapticsEnabled() && deleteActionHaptic(),

  // Financial specific
  paymentSuccess: () => getHapticsEnabled() && paymentSuccessHaptic(),
  loanApproved: () => getHapticsEnabled() && loanApprovedHaptic(),
  creditScoreUpdate: () => getHapticsEnabled() && creditScoreUpdateHaptic(),
  moneyTransfer: () => getHapticsEnabled() && moneyTransferHaptic(),
  creditScoreImprove: () => getHapticsEnabled() && creditScoreImproveHaptic(),
  creditScoreDecline: () => getHapticsEnabled() && creditScoreDeclineHaptic(),
  loanApplication: () => getHapticsEnabled() && loanApplicationHaptic(),
  paymentReminder: () => getHapticsEnabled() && paymentReminderHaptic(),
  achievementUnlocked: () => getHapticsEnabled() && achievementUnlockedHaptic(),

  // Complex patterns
  double: (type, delay) => getHapticsEnabled() && doubleHaptic(type, delay),
  triple: (type, delay) => getHapticsEnabled() && tripleHaptic(type, delay),
  crescendo: () => getHapticsEnabled() && crescendoHaptic(),
  diminuendo: () => getHapticsEnabled() && diminuendoHaptic(),
  heartbeat: () => getHapticsEnabled() && heartbeatHaptic(),
  knock: () => getHapticsEnabled() && knockHaptic(),
  alert: () => getHapticsEnabled() && alertHaptic(),

  // Utility
  trigger: (type) => getHapticsEnabled() && triggerHaptic(type),
  createSequence: (pattern) => getHapticsEnabled() && createHapticSequence(pattern),
  random: () => getHapticsEnabled() && randomHaptic(),
};

export default hapticFeedback;
