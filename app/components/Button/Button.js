import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../styles';
import { indent } from '../../styles/dimensions';
import SpinnerButton from './Spinner/SpinnerButton';
import Icon from '../Icon';
import TextView from '../TextView/TextView';

const Button = ({
  onPress,
  ButtonText = '',
  children,
  style,
  containerStyle,
  animationStyle,
  isLoading = false,
  spinnerDotSize = 8,
  spinnerType = 'DotIndicator',
  disabled = false,
  disabledStyle,
  textStyle,
  isIcon = false,
  iconName,
  isIconRight = false,
  rightIconName,
  iconType = 'ionic',
  ...props
}) => {
  return (
    <View style={[containerStyle]}>
      <SpinnerButton
        animationStyle={[s.animationButton, animationStyle]}
        buttonStyle={[s.fullWidthButton, style, disabled && [s.disabledStyle, disabledStyle]]}
        spinnerColor={disabled && colors.borderColor}
        size={spinnerDotSize}
        disabled={disabled}
        isLoading={isLoading}
        onPress={onPress}
        spinnerType={spinnerType}
        indicatorCount={4}
        activeOpacity={0.7}
        {...props}>
        {isIcon && (
          <Icon
            isFeather={false}
            type={iconType}
            style={[s.buttonIcon]}
            name={iconName}
            size={22}
            color={colors.white}
          />
        )}
        <TextView
          type={'button-text'}
          text={ButtonText}
          isTextColorWhite={true}
          style={[textStyle, disabled && s.disabledTextStyle]}
        />
        {isIconRight && (
          <Icon
            isFeather={false}
            type={iconType}
            style={[s.buttonIconRight]}
            name={rightIconName}
            size={22}
            color={colors.white}
          />
        )}
      </SpinnerButton>
    </View>
  );
};

const s = StyleSheet.create({
  fullWidthButton: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  animationButton: {
    width: '100%'
  },
  buttonIcon: {
    position: 'absolute',
    top: -2,
    left: 0,
    padding: indent,
    marginLeft: 'auto'
  },
  buttonIconRight: {
    position: 'absolute',
    top: -2,
    right: 0,
    padding: indent,
    marginRight: 'auto'
  },
  disabledStyle: {
    backgroundColor: colors.disableColor,
    opacity: 1
  },
  disabledTextStyle: {
    color: colors.borderColor
  }
});
export default Button;
