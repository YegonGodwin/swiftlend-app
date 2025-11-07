import { Animated, Easing, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Animation constants
export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
};

export const EASING_TYPES = {
  LINEAR: Easing.linear,
  EASE: Easing.ease,
  EASE_IN: Easing.in(Easing.ease),
  EASE_OUT: Easing.out(Easing.ease),
  EASE_IN_OUT: Easing.inOut(Easing.ease),
  SPRING: Easing.elastic(1),
  BOUNCE: Easing.bounce,
  BACK: Easing.back(1.5),
};

// Spring animation configs
export const SPRING_CONFIGS = {
  GENTLE: {
    tension: 120,
    friction: 8,
    useNativeDriver: true,
  },
  WOBBLY: {
    tension: 180,
    friction: 12,
    useNativeDriver: true,
  },
  STIFF: {
    tension: 280,
    friction: 20,
    useNativeDriver: true,
  },
  BOUNCY: {
    tension: 300,
    friction: 8,
    useNativeDriver: true,
  },
};

// Fade animations
export const createFadeAnimation = (
  animatedValue,
  toValue = 1,
  duration = ANIMATION_DURATIONS.NORMAL,
  easing = EASING_TYPES.EASE_OUT,
) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing,
    useNativeDriver: true,
  });
};

export const fadeIn = (animatedValue, duration, delay = 0) => {
  return Animated.sequence([
    Animated.delay(delay),
    createFadeAnimation(animatedValue, 1, duration),
  ]);
};

export const fadeOut = (animatedValue, duration, delay = 0) => {
  return Animated.sequence([
    Animated.delay(delay),
    createFadeAnimation(animatedValue, 0, duration),
  ]);
};

export const fadeInOut = (animatedValue, stayDuration = 2000) => {
  return Animated.sequence([
    createFadeAnimation(animatedValue, 1, ANIMATION_DURATIONS.NORMAL),
    Animated.delay(stayDuration),
    createFadeAnimation(animatedValue, 0, ANIMATION_DURATIONS.NORMAL),
  ]);
};

// Scale animations
export const createScaleAnimation = (
  animatedValue,
  toValue = 1,
  duration = ANIMATION_DURATIONS.NORMAL,
  easing = EASING_TYPES.EASE_OUT,
) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing,
    useNativeDriver: true,
  });
};

export const scaleIn = (
  animatedValue,
  duration = ANIMATION_DURATIONS.NORMAL,
) => {
  return createScaleAnimation(animatedValue, 1, duration, EASING_TYPES.BACK);
};

export const scaleOut = (
  animatedValue,
  duration = ANIMATION_DURATIONS.FAST,
) => {
  return createScaleAnimation(animatedValue, 0, duration, EASING_TYPES.EASE_IN);
};

export const pulseAnimation = (
  animatedValue,
  minScale = 0.95,
  maxScale = 1.05,
) => {
  return Animated.loop(
    Animated.sequence([
      createScaleAnimation(animatedValue, maxScale, ANIMATION_DURATIONS.SLOW),
      createScaleAnimation(animatedValue, minScale, ANIMATION_DURATIONS.SLOW),
    ]),
  );
};

export const heartbeatAnimation = (animatedValue) => {
  return Animated.loop(
    Animated.sequence([
      createScaleAnimation(animatedValue, 1.2, 150, EASING_TYPES.EASE_OUT),
      createScaleAnimation(animatedValue, 1, 150, EASING_TYPES.EASE_IN),
      Animated.delay(800),
    ]),
  );
};

// Translation animations
export const createTranslateAnimation = (
  animatedValue,
  toValue,
  duration = ANIMATION_DURATIONS.NORMAL,
  easing = EASING_TYPES.EASE_OUT,
) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing,
    useNativeDriver: true,
  });
};

export const slideInFromLeft = (
  animatedValue,
  duration = ANIMATION_DURATIONS.NORMAL,
) => {
  return createTranslateAnimation(
    animatedValue,
    0,
    duration,
    EASING_TYPES.EASE_OUT,
  );
};

export const slideInFromRight = (
  animatedValue,
  duration = ANIMATION_DURATIONS.NORMAL,
) => {
  return createTranslateAnimation(
    animatedValue,
    0,
    duration,
    EASING_TYPES.EASE_OUT,
  );
};

export const slideInFromBottom = (
  animatedValue,
  duration = ANIMATION_DURATIONS.NORMAL,
) => {
  return createTranslateAnimation(
    animatedValue,
    0,
    duration,
    EASING_TYPES.EASE_OUT,
  );
};

export const slideInFromTop = (
  animatedValue,
  duration = ANIMATION_DURATIONS.NORMAL,
) => {
  return createTranslateAnimation(
    animatedValue,
    0,
    duration,
    EASING_TYPES.EASE_OUT,
  );
};

// Rotation animations
export const createRotationAnimation = (
  animatedValue,
  toValue = 1,
  duration = ANIMATION_DURATIONS.NORMAL,
  easing = EASING_TYPES.LINEAR,
) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing,
    useNativeDriver: true,
  });
};

export const rotateAnimation = (animatedValue, duration = 1000) => {
  return Animated.loop(
    createRotationAnimation(animatedValue, 1, duration, EASING_TYPES.LINEAR),
  );
};

export const wiggleAnimation = (animatedValue) => {
  return Animated.loop(
    Animated.sequence([
      createRotationAnimation(animatedValue, 0.1, 100),
      createRotationAnimation(animatedValue, -0.1, 100),
      createRotationAnimation(animatedValue, 0.1, 100),
      createRotationAnimation(animatedValue, 0, 100),
    ]),
  );
};

// Complex animations
export const staggeredFadeIn = (
  animatedValues,
  duration = ANIMATION_DURATIONS.NORMAL,
  stagger = 100,
) => {
  return Animated.stagger(
    stagger,
    animatedValues.map((value) => fadeIn(value, duration)),
  );
};

export const parallaxAnimation = (animatedValue, multiplier = 0.5) => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, multiplier],
    extrapolate: "clamp",
  });
};

export const springBounce = (
  animatedValue,
  toValue = 1,
  config = SPRING_CONFIGS.BOUNCY,
) => {
  return Animated.spring(animatedValue, {
    toValue,
    ...config,
  });
};

// Number counting animation
export const createCountingAnimation = (
  animatedValue,
  fromValue,
  toValue,
  duration = ANIMATION_DURATIONS.SLOW,
  easing = EASING_TYPES.EASE_OUT,
) => {
  animatedValue.setValue(fromValue);
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing,
    useNativeDriver: false, // Can't use native driver for numeric values
  });
};

// Progress bar animation
export const createProgressAnimation = (
  animatedValue,
  toValue,
  duration = ANIMATION_DURATIONS.SLOW,
  easing = EASING_TYPES.EASE_OUT,
) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing,
    useNativeDriver: false, // Can't use native driver for layout properties
  });
};

// Entrance animations
export const createEntranceAnimation = (
  fadeValue,
  scaleValue,
  translateValue,
  delay = 0,
) => {
  return Animated.sequence([
    Animated.delay(delay),
    Animated.parallel([
      fadeIn(fadeValue, ANIMATION_DURATIONS.NORMAL),
      scaleIn(scaleValue, ANIMATION_DURATIONS.NORMAL),
      slideInFromBottom(translateValue, ANIMATION_DURATIONS.NORMAL),
    ]),
  ]);
};

// Exit animations
export const createExitAnimation = (fadeValue, scaleValue, translateValue) => {
  return Animated.parallel([
    fadeOut(fadeValue, ANIMATION_DURATIONS.FAST),
    scaleOut(scaleValue, ANIMATION_DURATIONS.FAST),
    createTranslateAnimation(translateValue, -50, ANIMATION_DURATIONS.FAST),
  ]);
};

// Loading animations
export const createLoadingPulse = (animatedValue) => {
  return Animated.loop(
    Animated.sequence([
      createFadeAnimation(animatedValue, 0.3, 800, EASING_TYPES.EASE_IN_OUT),
      createFadeAnimation(animatedValue, 1, 800, EASING_TYPES.EASE_IN_OUT),
    ]),
  );
};

export const createLoadingDots = (animatedValues, duration = 600) => {
  const animations = animatedValues.map((value, index) => {
    return Animated.loop(
      Animated.sequence([
        Animated.delay(index * 200),
        createScaleAnimation(value, 1.5, duration / 2, EASING_TYPES.EASE_OUT),
        createScaleAnimation(value, 1, duration / 2, EASING_TYPES.EASE_IN),
      ]),
    );
  });

  return Animated.parallel(animations);
};

// Button press animations
export const createButtonPressAnimation = (scaleValue) => {
  return Animated.sequence([
    createScaleAnimation(scaleValue, 0.95, 100, EASING_TYPES.EASE_OUT),
    createScaleAnimation(scaleValue, 1, 150, EASING_TYPES.BOUNCE),
  ]);
};

// Card flip animation
export const createCardFlipAnimation = (
  animatedValue,
  duration = ANIMATION_DURATIONS.NORMAL,
) => {
  return Animated.sequence([
    createRotationAnimation(
      animatedValue,
      0.5,
      duration / 2,
      EASING_TYPES.EASE_IN,
    ),
    createRotationAnimation(
      animatedValue,
      1,
      duration / 2,
      EASING_TYPES.EASE_OUT,
    ),
  ]);
};

// Shake animation for errors
export const createShakeAnimation = (animatedValue, intensity = 10) => {
  return Animated.sequence([
    createTranslateAnimation(animatedValue, intensity, 50),
    createTranslateAnimation(animatedValue, -intensity, 50),
    createTranslateAnimation(animatedValue, intensity, 50),
    createTranslateAnimation(animatedValue, -intensity, 50),
    createTranslateAnimation(animatedValue, 0, 50),
  ]);
};

// Swipe gesture animations
export const createSwipeAnimation = (
  animatedValue,
  direction = "left",
  threshold = width * 0.3,
) => {
  const toValue = direction === "left" ? -threshold : threshold;
  return createTranslateAnimation(
    animatedValue,
    toValue,
    ANIMATION_DURATIONS.NORMAL,
    EASING_TYPES.EASE_OUT,
  );
};

// Morphing animations
export const createMorphAnimation = (
  animatedValue,
  fromValue,
  toValue,
  duration = ANIMATION_DURATIONS.NORMAL,
) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: EASING_TYPES.EASE_IN_OUT,
    useNativeDriver: false, // Can't use native driver for layout/color changes
  });
};

// Interpolation helpers
export const createInterpolation = (
  animatedValue,
  inputRange,
  outputRange,
  extrapolate = "clamp",
) => {
  return animatedValue.interpolate({
    inputRange,
    outputRange,
    extrapolate,
  });
};

export const createRotationInterpolation = (animatedValue) => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
    extrapolate: "clamp",
  });
};

export const createScaleInterpolation = (
  animatedValue,
  minScale = 0,
  maxScale = 1,
) => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [minScale, maxScale],
    extrapolate: "clamp",
  });
};

// Gesture response animations
export const createPanResponderAnimation = (animatedValue, gestureState) => {
  return Animated.spring(animatedValue, {
    toValue: 0,
    ...SPRING_CONFIGS.GENTLE,
  });
};

// Sequential animations
export const createSequentialAnimation = (animations) => {
  return Animated.sequence(animations);
};

export const createParallelAnimation = (animations) => {
  return Animated.parallel(animations);
};

// Utility functions
export const resetAnimatedValue = (animatedValue, value = 0) => {
  animatedValue.setValue(value);
};

export const resetAnimatedValues = (animatedValues, value = 0) => {
  animatedValues.forEach((animatedValue) => {
    animatedValue.setValue(value);
  });
};

export const runAnimation = (animation, callback) => {
  animation.start(callback);
};

export const stopAnimation = (animatedValue) => {
  animatedValue.stopAnimation();
};

// Common animation combinations
export const ENTRANCE_ANIMATIONS = {
  FADE_IN: (opacity) => fadeIn(opacity),
  SCALE_IN: (scale) => scaleIn(scale),
  SLIDE_UP: (translateY) => slideInFromBottom(translateY),
  SLIDE_DOWN: (translateY) => slideInFromTop(translateY),
  SLIDE_LEFT: (translateX) => slideInFromLeft(translateX),
  SLIDE_RIGHT: (translateX) => slideInFromRight(translateX),
};

export const EXIT_ANIMATIONS = {
  FADE_OUT: (opacity) => fadeOut(opacity),
  SCALE_OUT: (scale) => scaleOut(scale),
  SLIDE_DOWN: (translateY) => createTranslateAnimation(translateY, 100),
  SLIDE_UP: (translateY) => createTranslateAnimation(translateY, -100),
  SLIDE_RIGHT: (translateX) => createTranslateAnimation(translateX, width),
  SLIDE_LEFT: (translateX) => createTranslateAnimation(translateX, -width),
};

export const LOADING_ANIMATIONS = {
  PULSE: (opacity) => createLoadingPulse(opacity),
  ROTATE: (rotation) => rotateAnimation(rotation),
  HEARTBEAT: (scale) => heartbeatAnimation(scale),
  WIGGLE: (rotation) => wiggleAnimation(rotation),
};

export default {
  ANIMATION_DURATIONS,
  EASING_TYPES,
  SPRING_CONFIGS,
  createFadeAnimation,
  fadeIn,
  fadeOut,
  fadeInOut,
  createScaleAnimation,
  scaleIn,
  scaleOut,
  pulseAnimation,
  heartbeatAnimation,
  createTranslateAnimation,
  slideInFromLeft,
  slideInFromRight,
  slideInFromBottom,
  slideInFromTop,
  createRotationAnimation,
  rotateAnimation,
  wiggleAnimation,
  staggeredFadeIn,
  parallaxAnimation,
  springBounce,
  createCountingAnimation,
  createProgressAnimation,
  createEntranceAnimation,
  createExitAnimation,
  createLoadingPulse,
  createLoadingDots,
  createButtonPressAnimation,
  createCardFlipAnimation,
  createShakeAnimation,
  createSwipeAnimation,
  createMorphAnimation,
  createInterpolation,
  createRotationInterpolation,
  createScaleInterpolation,
  createPanResponderAnimation,
  createSequentialAnimation,
  createParallelAnimation,
  resetAnimatedValue,
  resetAnimatedValues,
  runAnimation,
  stopAnimation,
  ENTRANCE_ANIMATIONS,
  EXIT_ANIMATIONS,
  LOADING_ANIMATIONS,
};
