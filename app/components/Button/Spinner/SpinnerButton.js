import React from 'react';
import { TouchableOpacity, View } from 'react-native';
// import { FadeIn } from 'react-native-reanimated'; // Reanimated v3
import Animated, { FadeIn, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Spinner from './Spinner';
import styles from './SpinnerButtonStyle';

const CustomButton = (props) => {
  const { animationType = 'fadeIn', buttonStyle, onPress, isLoading, children } = props;

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(1, { duration: 300 }),
  }));

  return (
    <Animated.View entering={FadeIn.duration(300)} style={animatedStyle}>
      <TouchableOpacity {...props} style={[styles.defaultButtonStyle, buttonStyle]} onPress={onPress} disabled={isLoading}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const SpinnerButton = (props) => {
  const {
    animationType,
    animationStyle,
    buttonStyle,
    spinnerColor,
    spinnerType,
    isLoading,
    onPress,
    children,
    indicatorCount,
    size,
    spinnerOptions
  } = props;
  if (isLoading) {
    return (
      <Spinner
        {...props}
        spinnerColor={spinnerColor || 'rgb(255, 255, 255)'}
        spinnerType={spinnerType}
        buttonStyle={buttonStyle}
        count={indicatorCount}
        spinnerOptions={spinnerOptions}
        size={size}
        isLoading={isLoading}
        animationType={animationType}
        animationStyle={animationStyle}
      />
    );
  }
  return (
    <CustomButton
      {...props}
      buttonStyle={buttonStyle}
      onPress={onPress}
      children={children}
      isLoading={isLoading}
      animationType={animationType}
      animationStyle={animationStyle}
    />
  );
};

export default SpinnerButton;
