import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { indent, lessIndent, halfindent, borderRadius } from '../styles/dimensions';
import { colors } from '../styles';
import Icon from './Icon';
import Typography from '../styles/Typography';
import { IconButton } from './Button';
import TextView from './TextView/TextView';
import { scale, verticalScale } from 'react-native-size-matters';

const Input = ({
  style,
  wrapperStyle,
  containerStyle,
  value,
  onChangeText,
  placeholder,
  onPressIcon,
  leftIconName,
  rightIconName,
  loading,
  label,
  labelStyle,
  iconStyle,
  isIconLeft = false,
  isIconRight = false,
  multiline = false,
  ...props
}) => (
  <View style={[s.formControlSpace, wrapperStyle]}>
    {label && (
      <TextView style={labelStyle} text={label} type={'body-one'} isTextColorWhite={true} isUpperCaseText={true} />
    )}
    <View style={[s.inputWrapper, containerStyle]}>
      {isIconLeft && (
        <Icon
          isFeather={false}
          type={'ionic'}
          name={leftIconName}
          color={colors.primary}
          size={22}
          style={[s.iconStyle, iconStyle]}
        />
      )}
      <TextInput
        underlineColorAndroid='transparent'
        style={[s.formControl, !multiline && { height: verticalScale(60) },  { color: colors.white },style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.lightWhite}
        multiline={multiline}
        {...props}
      />
      {isIconRight && (
        <IconButton
          style={s.iconButton}
          icon={rightIconName}
          isFeatherIcon={false}
          iconType={'ionic'}
          iconColor={colors.white}
          iconSize={22}
          disabled={loading}
          onPress={onPressIcon}
        />
      )}
    </View>
  </View>
);

const s = StyleSheet.create({
  formControlSpace: {
    marginVertical: verticalScale(halfindent + 2)
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: borderRadius
  },
  iconStyle: {
    paddingLeft: scale(indent + 4),
    paddingRight: scale(5)
  },
  formControl: {
    ...Typography.body,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0
    // paddingLeft: 0
  },
  iconButton: {
    marginLeft: 'auto',
    paddingRight: scale(halfindent / 2)
  }
});
export default Input;
