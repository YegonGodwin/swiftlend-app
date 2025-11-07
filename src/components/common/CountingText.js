import React, { useEffect, useRef } from 'react';
import { Text, Animated } from 'react-native';
import { TYPOGRAPHY, COLORS } from '../../constants/theme';
import { createCountingAnimation, ANIMATION_DURATIONS } from '../../utils/animations';

const CountingText = ({
  value,
  duration = ANIMATION_DURATIONS.SLOW,
  startValue = 0,
  style,
  prefix = '',
  suffix = '',
  formatNumber = true,
  decimalPlaces = 0,
  separator = ',',
  animateOnMount = true,
  ...props
}) => {
  const animatedValue = useRef(new Animated.Value(startValue)).current;
  const displayValue = useRef(startValue);

  useEffect(() => {
    if (animateOnMount || displayValue.current !== value) {
      const animation = createCountingAnimation(
        animatedValue,
        displayValue.current,
        value,
        duration
      );

      const listener = animatedValue.addListener(({ value: animatedVal }) => {
        displayValue.current = animatedVal;
      });

      animation.start(() => {
        displayValue.current = value;
        animatedValue.removeListener(listener);
      });

      return () => {
        animatedValue.removeListener(listener);
      };
    }
  }, [value, duration, animateOnMount]);

  const formatDisplayValue = (val) => {
    let formattedValue = val.toFixed(decimalPlaces);

    if (formatNumber) {
      const [integerPart, decimalPart] = formattedValue.split('.');
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      formattedValue = decimalPlaces > 0 ? `${formattedInteger}.${decimalPart}` : formattedInteger;
    }

    return `${prefix}${formattedValue}${suffix}`;
  };

  return (
    <Animated.Text
      style={[
        {
          fontSize: TYPOGRAPHY.fontSize.xl,
          fontWeight: TYPOGRAPHY.fontWeight.bold,
          color: COLORS.textPrimary,
        },
        style,
      ]}
      {...props}
    >
      {animatedValue._value !== undefined ? formatDisplayValue(displayValue.current) : formatDisplayValue(value)}
    </Animated.Text>
  );
};

export default CountingText;
